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

echo "----------------"
echo "* Building XPI *"
echo "----------------"
rm -Rf ./Outputs/XPI/
mkdir ./Outputs/XPI/
cp -R ./XPI/* ./Outputs/XPI/
cp -R ../Source/* ./Outputs/XPI/chrome/content/
find ./Outputs/XPI/ -name .svn | xargs -i rm -Rf {}

./replacer.sh ./Outputs/XPI/install.rdf
./replacer.sh ./Outputs/XPI/chrome/content/UI/Window.xul
./replacer.sh ./Outputs/XPI/chrome/content/Common/Pencil.js

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

echo "-------------------------------------------"
echo "* Building Linux Shared XULRunner version *"
echo "-------------------------------------------"
rm -Rf ./Outputs/Linux/
mkdir ./Outputs/Linux/
cp -R ./Linux/* ./Outputs/Linux/
cp -R ./XULRunner/* ./Outputs/Linux/
mkdir -p ./Outputs/Linux/chrome/content
cp -R ../Source/* ./Outputs/Linux/chrome/content/
find ./Outputs/Linux/ -name .svn | xargs -i rm -Rf {}

./replacer.sh ./Outputs/Linux/chrome/content/UI/Window.xul
./replacer.sh ./Outputs/Linux/chrome/content/Common/Pencil.js
./replacer.sh ./Outputs/Linux/application.ini
chmod +x ./Outputs/Linux/*.sh

echo "Compressing..."
cd ./Outputs/Linux/
tar -czvf ../Pencil-$VERSION-$BUILD-linux-gtk.tar.gz * > /dev/null
cd ../../
rm -Rf ./Outputs/Linux/


echo "Done!"
