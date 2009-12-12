#!/bin/sh
export NAME='Pencil'
export VERSION='1.1'
export BUILD='0'
export AUTHOR='Duong Thanh An (an.duong@evolus.vn) and Contributors'
export XPINAME='Pencil-'$VERSION'-'$BUILD'-fx.xpi'
export FXMINVER='3.0b3'
export FXMAXVER='3.6.*'
export XRMINVER='1.9'
export XRMAXVER='1.9.2.*'

rm -Rf ./Outputs/
mkdir -p ./Outputs

echo "----------------------"
echo "* Cleaning up source *"
echo "----------------------"
rm -Rf ./Outputs/Pencil/
mkdir ./Outputs/Pencil/
cp -R ../Source/* ./Outputs/Pencil/
find ./Outputs/Pencil/ -name .svn | xargs -i rm -Rf {}

./replacer.sh ./Outputs/Pencil/UI/Window.xul
./replacer.sh ./Outputs/Pencil/Common/Pencil.js

echo "----------------"
echo "* Building XPI *"
echo "----------------"
rm -Rf ./Outputs/XPI/
mkdir ./Outputs/XPI/
cp -R ./XPI/* ./Outputs/XPI/
find ./Outputs/XPI/ -name .svn | xargs -i rm -Rf {}

cp -R ./Outputs/Pencil/* ./Outputs/XPI/chrome/content/
mkdir -p ./Outputs/XPI/chrome/icons/default/
cp ./Outputs/Pencil/Icons/pencil.ico ./Outputs/XPI/chrome/icons/default/pencilMainWindow.ico
cp ./Outputs/Pencil/Icons/pencil.xpm ./Outputs/XPI/chrome/icons/default/pencilMainWindow.xpm

./replacer.sh ./Outputs/XPI/install.rdf

echo "Compressing XPI file..."
cd ./Outputs/XPI/
rm -f ../$XPINAME
zip -r ../$XPINAME * > /dev/null
export XPIHASH=`sha1sum ../$XPINAME | sed -e s^..../$XPINAME^^`
echo 'XPI SHA1 hash: '$XPIHASH
cd ../../

echo "Creating Update manifest..."
cp -R ./XPI/update.rdf ./Outputs/
./replacer.sh ./Outputs/update.rdf

rm -Rf ./Outputs/XPI/

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


echo "---------------------------------------------"
echo "* Building Win32 Installer with Private XRE *"
echo "---------------------------------------------"
rm -Rf ./Outputs/Win32/
mkdir ./Outputs/Win32/
cp -R ./Win32/* ./Outputs/Win32/
mkdir -p ./Outputs/Win32/app
cp -R ./XULRunner/* ./Outputs/Win32/app/
find ./Outputs/Win32/ -name .svn | xargs -i rm -Rf {}

mkdir -p ./Outputs/Win32/app/chrome/content/
cp -R ./Outputs/Pencil/* ./Outputs/Win32/app/chrome/content/

mkdir -p ./Outputs/Win32/app/chrome/icons/default/
cp ./Outputs/Pencil/Icons/pencil.ico ./Outputs/Win32/app/chrome/icons/default/pencilMainWindow.ico
cp ./Outputs/Pencil/Icons/pencil.xpm ./Outputs/Win32/app/chrome/icons/default/pencilMainWindow.xpm

./replacer.sh ./Outputs/Win32/app/application.ini
./replacer.sh ./Outputs/Win32/setup.nsi

cd Outputs/Win32
makensis pencil.nsi && makensis setup.nsi
cd ../../
rm -Rf ./Outputs/Win32/

rm -Rf ./Outputs/Pencil/

echo "Done!"
