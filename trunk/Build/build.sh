#!/bin/sh
export NAME='Pencil'
export VERSION='1.0'
export BUILD='1'
export AUTHOR='Duong Thanh An; an.duong@evolus.vn'

mkdir -p ./Outputs

echo "Building XPI..."
rm -Rf ./Outputs/XPI/
mkdir ./Outputs/XPI/
cp -R ./XPI/* ./Outputs/XPI/
cp -R ../Source/* ./Outputs/XPI/chrome/content/

./replacer.sh ./Outputs/XPI/install.rdf
./replacer.sh ./Outputs/XPI/chrome/content/UI/Window.xul
./replacer.sh ./Outputs/XPI/chrome/content/Common/Pencil.js

echo "Compressing XPI file..."
cd ./Outputs/XPI/
rm -f ../Pencil-$VERSION-$BUILD-fx.xpi
zip -r ../Pencil-$VERSION-$BUILD-fx.xpi * > /dev/null
cd ../../

rm -Rf ./Outputs/XPI/

echo "------------------------------"
echo "Building Linux GTK+ version..."
rm -Rf ./Outputs/Linux/
mkdir ./Outputs/Linux/
cp -R ./Linux/xulrunner/* ./Outputs/Linux/
cp -R ../Source/* ./Outputs/Linux/chrome/pencil@evolus.vn/

./replacer.sh ./Outputs/Linux/chrome/pencil@evolus.vn/UI/Window.xul
./replacer.sh ./Outputs/Linux/chrome/pencil@evolus.vn/Common/Pencil.js
./replacer.sh ./Outputs/Linux/application.ini

echo "Compressing..."
cd ./Outputs/Linux/
tar -czvf ../Pencil-$VERSION-$BUILD-linux-gtk.tar.gz * > /dev/null
cd ../../
rm -Rf ./Outputs/Linux/


echo "-------------------------"
echo "Building Win32 version..."
rm -Rf ./Outputs/Win32/
mkdir ./Outputs/Win32/
cp -R ./Win32/xulrunner/* ./Outputs/Win32/
cp -R ../Source/* ./Outputs/Win32/chrome/pencil@evolus.vn/

./replacer.sh ./Outputs/Win32/chrome/pencil@evolus.vn/UI/Window.xul
./replacer.sh ./Outputs/Win32/chrome/pencil@evolus.vn/Common/Pencil.js
./replacer.sh ./Outputs/Win32/application.ini

echo "Compressing..."
cd ./Outputs/Win32/
zip -r ../Pencil-$VERSION-$BUILD-win32.zip * > /dev/null
cd ../../
rm -Rf ./Outputs/Win32/

echo "Done!"
