#!/bin/sh

echo "Processing $1..."
sed "s/%version%/$VERSION/g;s/%author%/$AUTHOR/g;s/%name%/$NAME/g;s/%build%/$BUILD/g;s/%xpiname%/$XPINAME/g;s/%fxminver%/$FXMINVER/g;s/%fxmaxver%/$FXMMAXVER/g;s/%xpihash%/$XPIHASH/g" < $1 > temp
mv -f temp $1

