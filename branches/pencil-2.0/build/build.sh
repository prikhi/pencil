#!/bin/sh
export NAME='Pencil'
export VERSION='1.3'
export BUILD='2'
export AUTHOR='Duong Thanh An (an.duong@evolus.vn) and Contributors'
export XPI_NAME='Pencil-'$VERSION'-'$BUILD'-fx.xpi'
export MIN_VERSION='1.9.8'
export MAX_VERSION='10.*'
export UPDATE_URL="http://pencil.evolus.vn"
export XULRUNNER_XUL="*"

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

    rm ./Outputs/Pencil/defaults/preferences/personal.js
}

xpi() {
    echo "----------------"
    echo "* Building XPI *"
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
export BUILDROOT=./Outputs/RPM/buildroot

export OUTPUT=$BUILDROOT/usr/lib/evolus-pencil-$VERSION
mkdir -p $OUTPUT/
cp -R ./XULRunner/* $OUTPUT/
./replacer.sh $OUTPUT/application.ini

mkdir -p $OUTPUT/chrome/content/
cp -R ./Outputs/Pencil/* $OUTPUT/chrome/content/
mkdir -p $OUTPUT/chrome/icons/default/
cp ./Outputs/Pencil/Icons/pencil.ico $OUTPUT/chrome/icons/default/pencilMainWindow.ico
cp ./Outputs/Pencil/Icons/pencil.xpm $OUTPUT/chrome/icons/default/pencilMainWindow.xpm

cp -R ./Fedora-RPM/* ./Outputs/RPM/
./replacer.sh $BUILDROOT/usr/bin/evoluspencil
chmod 775 $BUILDROOT/usr/bin/evoluspencil

./replacer.sh ./Outputs/RPM/evolus-pencil.spec

find ./Outputs/RPM/ -name .svn | xargs -i rm -Rf {}

cd $BUILDROOT
BUILDROOTASB=`pwd`
find . -type f | sed s#./usr/#/usr/#g >> ../evolus-pencil.spec

cd ..
rpmbuild -ba --buildroot "$BUILDROOTASB" ./evolus-pencil.spec
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
}

prep
xpi
#linux
win32
mac
#fedorarpm
cleanup

echo "Done!"

