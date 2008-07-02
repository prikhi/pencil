#!/bin/sh

echo "Processing $1..."
sed "s/%version%/$VERSION/g;s/%author%/$AUTHOR/g;s/%name%/$NAME/g;s/%build%/$BUILD/g" < $1 > temp
mv -f temp $1

