#!/bin/sh

. ./properties.sh

prep() {

    rm -Rf ./Outputs/
    mkdir -p ./Outputs

    echo "----------------------"
    echo "* Cleaning up source *"
    echo "----------------------"

    rm -Rf ./Outputs/Pencil/
    mkdir ./Outputs/Pencil/

    cp -R ../app/* ./Outputs/Pencil/
    find ./Outputs/Pencil/ -name .svn | xargs -i rm -Rf {}

    ./replacer.sh ./Outputs/Pencil/content/pencil/mainWindow.xul
    ./replacer.sh ./Outputs/Pencil/content/pencil/aboutDialog.xul
    ./replacer.sh ./Outputs/Pencil/content/pencil/common/pencil.js
    ./replacer.sh ./Outputs/Pencil/content/pencil/common/util.js

    rm ./Outputs/Pencil/defaults/preferences/personal.js
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
    rm -Rf ./Outputs/Linux/
    mkdir ./Outputs/Linux/

    cp -R ./Linux/* ./Outputs/Linux/
    cp -R ./XULRunner/* ./Outputs/Linux/

    find ./Outputs/Linux/ -name .svn | xargs -i rm -Rf {}

    mkdir -p ./Outputs/Linux/chrome/content
    cp -R ./Outputs/Pencil/* ./Outputs/Linux/chrome/content/

    mkdir -p ./Outputs/Linux/chrome/icons/default/
    cp ./Outputs/Pencil/Icons/pencil.ico ./Outputs/Linux/chrome/icons/default/pencilMainWindow.ico
    cp ./Outputs/Pencil/Icons/pencil.xpm ./Outputs/Linux/chrome/icons/default/pencilMainWindow.xpm

    ./replacer.sh ./Outputs/Linux/application.ini
    chmod +x ./Outputs/Linux/pencil

    echo "Compressing..."
    cd ./Outputs/Linux/
    tar -czvf ../Pencil-$VERSION-$BUILD-linux-gtk.tar.gz * > /dev/null
    cd ../../
    rm -Rf ./Outputs/Linux/
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

cleanup() {
    rm -Rf ./Outputs/XPI/
    rm -Rf ./Outputs/Win32/
    rm -Rf ./Outputs/Pencil/
    rm -Rf ./Outputs/Mac/
    rm -Rf ./Outputs/RPM/
    rm -Rf ./Outputs/Linux/
}

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

if [ "$1" = "fedorarpm" ] 
then
    fedorarpm
fi

if [ "$1" = "all" ] 
then
    xpi
    win32
    fedorarpm
    mac
fi

cleanup

echo "Done!"

