#!/bin/sh

. ./properties.sh

prep() {

    rm -Rf ./Outputs/
    mkdir -p ./Outputs

    echo "--------------------"
    echo "* Preparing Source *"
    echo "--------------------"

    rm -Rf ./Outputs/Pencil/
    mkdir ./Outputs/Pencil/

    cp -R ../app/* ./Outputs/Pencil/
    find ./Outputs/Pencil/ -name .svn | xargs -i rm -Rf {}

    ./replacer.sh ./Outputs/Pencil/content/pencil/mainWindow.xul
    ./replacer.sh ./Outputs/Pencil/content/pencil/aboutDialog.xul
    ./replacer.sh ./Outputs/Pencil/content/pencil/common/pencil.js
    ./replacer.sh ./Outputs/Pencil/content/pencil/common/util.js

    rm ./Outputs/Pencil/defaults/preferences/personal.js.xulrunner
    rm ./Outputs/Pencil/defaults/preferences/debug.js
}

xpi() {
    echo "----------------"
    echo "* Building XPI * XPI_NAME"
    echo "----------------"
    rm -Rf ./Outputs/XPI/
    mkdir ./Outputs/XPI/

    cp -R ./Outputs/Pencil/* ./Outputs/XPI/

    cp -R ./Outputs/Pencil/install.rdf.tpl.xml ./Outputs/XPI/install.rdf
    cp -R ./Outputs/Pencil/update.rdf.tpl.xml ./Outputs/XPI/update.rdf

    ./replacer.sh ./Outputs/XPI/install.rdf
    ./replacer.sh ./Outputs/XPI/update.rdf

    echo "Compressing XPI file..."
    cd ./Outputs/XPI/
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
    export OUTPUT="./Outputs/Linux"
    rm -Rf $OUTPUT
    mkdir -p $OUTPUT

    cp -R ./Outputs/Pencil/* $OUTPUT/

    echo "Copying Icons..."
    mkdir -p $OUTPUT/chrome/icons/default/
    cp ./Outputs/Pencil/skin/classic/pencil.ico $OUTPUT/chrome/icons/default/pencilMainWindow.ico
    cp ./Outputs/Pencil/skin/classic/pencil.xpm $OUTPUT/chrome/icons/default/pencilMainWindow.xpm

    ./replacer.sh $OUTPUT/application.ini
    ./replacer.sh $OUTPUT/content/pencil/aboutDialog.js
    ./replacer.sh $OUTPUT/defaults/preferences/pencil.js

    echo "Compressing..."
    cd $OUTPUT/
    tar -czvf ../Pencil-$VERSION-$BUILD-linux-gtk.tar.gz * > /dev/null
    cd ../../
}

fedorarpm()  {
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
    echo "---------------------------------------------"
    echo "* Building Win32 Installer with Private XRE *"
    echo "---------------------------------------------"

    rm -Rf ./Outputs/Win32/
    mkdir ./Outputs/Win32/
    mkdir -p ./Outputs/Win32/app

    cp -R ./Outputs/Pencil/* ./Outputs/Win32/app/
    cp -R ./Win32/* ./Outputs/Win32/

    cp -R ./Outputs/Pencil/application.ini.tpl ./Outputs/Win32/app/application.ini

    ./replacer.sh ./Outputs/Win32/app/application.ini
    ./replacer.sh ./Outputs/Win32/app/defaults/preferences/pencil.js

    ./replacer.sh ./Outputs/Win32/setup.nsi

    cd Outputs/Win32
    makensis pencil.nsi && makensis setup.nsi
    cd ../../
}

mac() {
    echo "---------------------------------------------"
    echo "* Building Mac OS X App with Private XRE *"
    echo "---------------------------------------------"

    rm -Rf ./Outputs/Mac/
    mkdir ./Outputs/Mac/

    cp -R ./Mac/* ./Outputs/Mac/
    cp -R ./Outputs/Pencil/* ./Outputs/Mac/Pencil.app/Contents/Resources/

    find ./Outputs/Mac/ -name .svn | xargs -i rm -Rf {}

    cp -R ./Outputs/Pencil/application.ini.tpl ./Outputs/Mac/Pencil.app/Contents/Resources/application.ini

    ./replacer.sh ./Outputs/Mac/Pencil.app/Contents/Resources/application.ini
    ./replacer.sh ./Outputs/Mac/Pencil.app/Contents/Resources/defaults/preferences/pencil.js
    ./replacer.sh ./Outputs/Mac/Pencil.app/Contents/Info.plist

    #genisoimage -V Pencil -r -apple -root ./Outputs/Mac/

    cp -R ./Outputs/Mac/Pencil.app ./Outputs/Pencil.app
}

ubuntu(){
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
    #wget -nc http://ftp.mozilla.org/pub/mozilla.org/xulrunner/releases/15.0.1/runtimes/xulrunner-15.0.1.en-US.linux-x86_64.tar.bz2 -O ./Ubuntu/xulrunner-15.0.1.en-US.linux-x86_64.tar.bz2
    #tar xvfj ./Ubuntu/xulrunner-15.0.1.en-US.linux-x86_64.tar.bz2
    #cp -r ./xulrunner  ./Outputs/Ubuntu/pencil-2.0.2/usr/share/pencil/xre
    cp ./Ubuntu/deb ./Outputs/Ubuntu/pencil-2.0.2/deb
    cp ./Ubuntu/control ./Outputs/Ubuntu/pencil-2.0.2/control
    cp ./Ubuntu/rules ./Outputs/Ubuntu/pencil-2.0.2/rules
    cd ./Outputs/Ubuntu/pencil-2.0.2
    sh ./deb
    mv ../evoluspencil_2.0.2_all.deb ../../evoluspencil_2.0.2_all.deb
}

cleanup() {
    echo "------------------------"
    echo "* Removing Build Files *"
    echo "------------------------"

    rm -Rf ./Outputs
    echo "Done!"
    exit
}



if [ "$1" = "clean" ]
then
    cleanup
fi

prep

if [ "$1" = "xpi" ]
then
    xpi
fi

if [ "$1" = "win32" ]
then
    win32
fi

if [ "$1" = "mac" ]
then
    mac
fi

if [ "$1" = "linux" ]
then
    linux
fi

if [ "$1" = "fedorarpm" ]
then
    fedorarpm
fi

if [ "$1" = "ubuntu" ]
then
    ubuntu
fi

if [ "$1" = "all" ]
then
    xpi
    win32
    linux
    mac
fi

echo "Done!"
