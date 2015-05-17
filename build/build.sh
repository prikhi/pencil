#!/bin/bash

. ./properties.sh

prep() {
    rm -Rf ./Outputs/
    mkdir -p ./Outputs

    echo "--------------------------"
    echo "* Preparing Common Files *"
    echo "--------------------------"

    rm -Rf ./Outputs/Pencil/
    mkdir -p ./Outputs/Pencil/

    echo "Configuring build..."
    PKG_NAME="evolus-pencil"
    XUL_VERSION='36.0.1'        # The version of XULRunner for Private XREs


    echo "Copying base application files..."
    cp -R ../app/* ./Outputs/Pencil/

    echo "Copying icons..."
    mkdir -p ./Outputs/Pencil/chrome/icons/default/
    cp ./Outputs/Pencil/skin/classic/pencil.ico ./Outputs/Pencil/chrome/icons/default/pencilMainWindow.ico
    cp ./Outputs/Pencil/skin/classic/pencil.xpm ./Outputs/Pencil/chrome/icons/default/pencilMainWindow.xpm

    echo "Configuring application..."
    ./replacer.sh ./Outputs/Pencil/application.ini
    ./replacer.sh ./Outputs/Pencil/defaults/preferences/pencil.js
    ./replacer.sh ./Outputs/Pencil/content/pencil/mainWindow.xul
    ./replacer.sh ./Outputs/Pencil/content/pencil/aboutDialog.xul
    ./replacer.sh ./Outputs/Pencil/content/pencil/aboutDialog.js
    ./replacer.sh ./Outputs/Pencil/content/pencil/common/pencil.js
    ./replacer.sh ./Outputs/Pencil/content/pencil/common/util.js

    if [ ! $DEBUG ]; then
        echo "Removing debugging files..."
        rm ./Outputs/Pencil/defaults/preferences/personal.js.xulrunner
        rm ./Outputs/Pencil/defaults/preferences/debug.js
    fi
}

xpi() {
    echo "----------------"
    echo "* Building XPI * $XPI_NAME"
    echo "----------------"
    OUTPUT="./Outputs/XPI"
    rm -Rf $OUTPUT/
    mkdir -p $OUTPUT/

    cp -R ./Outputs/Pencil/* $OUTPUT/
    cp -R ./XPI/* $OUTPUT

    ./replacer.sh $OUTPUT/install.rdf
    ./replacer.sh $OUTPUT/update.rdf

    echo "Configuring XPI-specific settings..."
    cp -f ../app/defaults/preferences/pencil.js $OUTPUT/defaults/preferences/pencil.js
    export XULRUNNER_XUL=""
    ./replacer.sh ./Outputs/XPI/defaults/preferences/pencil.js

    echo "Removing branding..."
    sed -ni '/branding/!p' $OUTPUT/chrome.manifest


    echo "Compressing XPI file..."
    cd $OUTPUT/
    rm -f ../$XPI_NAME
    zip -r ../$XPI_NAME * > /dev/null
    export XPIHASH=`sha1sum ../$XPI_NAME | sed -e s^..../$XPI_NAME^^`
    echo 'XPI SHA1 hash: '$XPIHASH
    cd ../../
}

linux() {
    echo "-------------------------------------"
    echo "* Building Linux Shared XRE version *"
    echo "-------------------------------------"
    OUTPUT="./Outputs/Linux"
    rm -Rf $OUTPUT
    mkdir -p $OUTPUT

    echo "Copying common files..."
    cp -R ./Outputs/Pencil/* $OUTPUT/

    echo "Compressing..."
    cd ./Outputs
    cp -R ../$OUTPUT $PKG_NAME
    tar -czf ./Pencil-$VERSION-linux.tar.gz $PKG_NAME
    rm -Rf $PKG_NAME
    cd ..
}

linuxpkg() {
    echo "------------------------------------------"
    echo "* Building Linux Package with Shared XRE *"
    echo "------------------------------------------"
    OUTPUT="./Outputs/LinuxPkg"
    rm -Rf $OUTPUT
    mkdir -p $OUTPUT

    echo "Creating directory structure..."
    mkdir -p $OUTPUT/usr/{bin,share/{$PKG_NAME,applications,mime/packages}}

    echo "Copying common files..."
    cp -R ./Outputs/Pencil/* $OUTPUT/usr/share/$PKG_NAME/

    echo "Copying executable and mime information..."
    cp ./Linux/pencil $OUTPUT/usr/bin/
    cp ./Linux/pencil.desktop $OUTPUT/usr/share/applications/
    cp ./Linux/ep.xml $OUTPUT/usr/share/mime/packages/

    echo "Compressing..."
    cd ./Outputs
    cp -R ../$OUTPUT $PKG_NAME
    tar -czf ./Pencil-$VERSION-linux-pkg.tar.gz $PKG_NAME
    echo "SHA256SUM: " `sha256sum ./Pencil-$VERSION-linux-pkg.tar.gz`
    rm -Rf $PKG_NAME
    cd ..
}

fedorarpm() {
    echo "--------------------------------------"
    echo "* Building Fedora RPM with Shared XRE *"
    echo "--------------------------------------"
    rm -Rf ./Outputs/RPM/
    export TMP=./Outputs/RPM/tmp
    export BUILDROOT=$TMP/pencil-$VERSION.$BUILD

    export OUTPUT=$BUILDROOT/usr/share/pencil
    mkdir -p $OUTPUT/
    cp -R ./Outputs/Pencil/* $OUTPUT/
    rm -f $OUTPUT/license.txt
    rm -rf $OUTPUT/platform
    find $OUTPUT -iname "*.ico" | xargs -i rm -Rf {}

    ./replacer.sh $OUTPUT/application.ini
    ./replacer.sh $OUTPUT/content/pencil/aboutDialog.js
    ./replacer.sh $OUTPUT/defaults/preferences/pencil.js

    mkdir -p $OUTPUT/chrome/icons/default/
    #cp ./Outputs/Pencil/skin/classic/pencil.ico $OUTPUT/chrome/icons/default/pencilMainWindow.ico
    cp ./Outputs/Pencil/skin/classic/pencil.xpm $OUTPUT/chrome/icons/default/pencilMainWindow.xpm

    cp -R ./Fedora-RPM/buildroot/* $BUILDROOT
    cp -R ../app/license.txt $BUILDROOT/COPYING
    cp ./Fedora-RPM/*.spec $TMP

    ./replacer.sh $BUILDROOT/usr/bin/pencil
    chmod 775 $BUILDROOT/usr/bin/pencil
    ./replacer.sh $BUILDROOT/usr/share/applications/pencil.desktop

    ./replacer.sh $TMP/pencil.spec

    find ./Outputs/RPM/ -name .svn | xargs -i rm -Rf {}

    echo "Creating source tarball..."
    CURRENT_DIR=`pwd`
    cd $TMP
    tar -pczf $HOME/rpmbuild/SOURCES/pencil-$VERSION.$BUILD.tar.gz pencil-$VERSION.$BUILD
    cd $CURRENT_DIR
    mkdir -p ./Outputs/Linux
    cp $HOME/rpmbuild/SOURCES/pencil-$VERSION.$BUILD.tar.gz ./Outputs

    cd $BUILDROOT
    BUILDROOTASB=`pwd`

    cd ..
    echo "Build RPM now..."
    rpmbuild -ba pencil.spec
    cd $CURRENT_DIR
    cp $HOME/rpmbuild/RPMS/noarch/pencil-$VERSION.$BUILD-*.noarch.rpm ./Outputs
}

win32() {
    if [ ! -d 'Win32/xulrunner' ]; then
        echo "-------------------------"
        echo "* Downloading XULRunner *"
        echo "-------------------------"
        XUL_DL_URL="http://ftp.mozilla.org/pub/mozilla.org/xulrunner/releases/$XUL_VERSION/runtimes/xulrunner-$XUL_VERSION.en-US.win32.zip"
        curl $XUL_DL_URL -o temp.zip
        unzip temp.zip -d Win32
        rm temp.zip
    fi

    echo "---------------------------------------------"
    echo "* Building Win32 Installer with Private XRE *"
    echo "---------------------------------------------"
    OUTPUT="./Outputs/Win32"

    rm -Rf $OUTPUT/
    mkdir -p $OUTPUT/app

    cp -R ./Outputs/Pencil/* $OUTPUT/app/
    cp -R ./Win32/* $OUTPUT/

    ./replacer.sh $OUTPUT/setup.nsi

    cd $OUTPUT
    echo "Compiling Windows Installer..."
    makensis -V2 pencil.nsi && makensis -V2 setup.nsi
    cd ../../
}

mac() {
    if [ ! -d 'Mac/XUL.framework' ]; then
        echo "-------------------------"
        echo "* Downloading XULRunner *"
        echo "-------------------------"
        XUL_DL_URL="http://ftp.mozilla.org/pub/mozilla.org/xulrunner/releases/$XUL_VERSION/runtimes/xulrunner-$XUL_VERSION.en-US.mac.tar.bz2"
        curl $XUL_DL_URL -o temp.tar.bz2
        tar -jxvf temp.tar.bz2 -C Mac
        rm temp.tar.bz2
    fi
    echo "---------------------------------------------"
    echo "* Building Mac OS X App with Private XRE *"
    echo "---------------------------------------------"

    rm -Rf ./Outputs/Mac/
    mkdir ./Outputs/Mac/

    cp -R ./Mac/* ./Outputs/Mac/
		
    mkdir -p ./Outputs/Mac/Pencil.app/Contents/Resources/
    cp -R ./Outputs/Pencil/* $_
	cp -RL ./Outputs/Mac/XUL.framework/Versions/Current/* ./Outputs/Mac/Pencil.app/Contents/MacOS/
    mv ./Outputs/Mac/Pencil.app/Contents/MacOS/dependentlibs.list ./Outputs/Mac/Pencil.app/Contents/Resources/dependentlibs.list
    cp ./Outputs/Pencil/application.ini ./Outputs/Mac/Pencil.app/Contents/Resources/application.ini

    ./replacer.sh ./Outputs/Mac/Pencil.app/Contents/Resources/application.ini
    ./replacer.sh ./Outputs/Mac/Pencil.app/Contents/Resources/defaults/preferences/pencil.js
    ./replacer.sh ./Outputs/Mac/Pencil.app/Contents/Info.plist

    #genisoimage -V Pencil -r -apple -root ./Outputs/Mac/

    cp -R ./Outputs/Mac/Pencil.app ./Outputs/Pencil.app
}

ubuntu() {
    echo "---------------------------------------------"
    echo "* Building Ubuntu amd 64                    *"
    echo "---------------------------------------------"
    rm -Rf ./Outputs/Ubuntu/
    mkdir ./Outputs/Ubuntu/

    mkdir ./Outputs/Ubuntu/pencil-2.0.2
    mkdir ./Outputs/Ubuntu/pencil-2.0.2/usr
    mkdir ./Outputs/Ubuntu/pencil-2.0.2/usr/bin
    mkdir ./Outputs/Ubuntu/pencil-2.0.2/usr/share/
    mkdir ./Outputs/Ubuntu/pencil-2.0.2/usr/share/applications
    cp ./Ubuntu/pencil ./Outputs/Ubuntu/pencil-2.0.2/usr/bin/pencil
    cp ./Ubuntu/pencil.desktop ./Outputs/Ubuntu/pencil-2.0.2/usr/share/applications/pencil.desktop
    cp -r ./Ubuntu/share/pencil ./Outputs/Ubuntu/pencil-2.0.2/usr/share/pencil
    #curl -nc http://ftp.mozilla.org/pub/mozilla.org/xulrunner/releases/15.0.1/runtimes/xulrunner-15.0.1.en-US.linux-x86_64.tar.bz2 -o ./Ubuntu/xulrunner-15.0.1.en-US.linux-x86_64.tar.bz2
    #tar xvfj ./Ubuntu/xulrunner-15.0.1.en-US.linux-x86_64.tar.bz2
    #cp -r ./xulrunner  ./Outputs/Ubuntu/pencil-2.0.2/usr/share/pencil/xre
    cp ./Ubuntu/deb ./Outputs/Ubuntu/pencil-2.0.2/deb
    cp ./Ubuntu/control ./Outputs/Ubuntu/pencil-2.0.2/control
    cp ./Ubuntu/rules ./Outputs/Ubuntu/pencil-2.0.2/rules
    cd ./Outputs/Ubuntu/pencil-2.0.2
    sh ./deb
    mv ../evoluspencil_2.0.2_all.deb ../../evoluspencil_2.0.2_all.deb
}

clean() {
    echo "------------------------"
    echo "* Removing Built Files *"
    echo "------------------------"

    rm -Rf ./Outputs
    echo "Done!"
    exit
}

maintainer_clean() {
	
    if [ -d 'Win32/xulrunner' ]; then
	    echo "Removing the Windows copy of XULRunner..."
	    rm -Rf ./Win32/xulrunner
	    clean
    fi

    if [ -d 'Mac/XUL.framework' ]; then
	    echo "Removing the Mac copy of XULRunner..."
	    rm -Rf ./Mac/XUL.framework
	    clean
    fi
}



case "$1" in
    clean)
        clean
        ;;

    maintainer-clean)
        maintainer_clean
        ;;

    *)
        prep
        ;;
esac

case "$1" in
    xpi)
        xpi
        ;;

    win32)
        win32
        ;;

    mac)
        mac
        ;;

    linux)
        linux
        linuxpkg
        ;;

    fedorarpm)
        fedorarpm
        ;;

    ubuntu)
        ubuntu
        ;;
    *)
        xpi
        win32
        mac
        linux
        linuxpkg
        ;;
esac

echo "Done!"
