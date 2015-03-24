#!/bin/sh

echo "Processing $1..."
sed "s/@VERSION@/$VERSION/g;s/@AUTHOR@/$AUTHOR/g;s/@NAME@/$NAME/g;s/@BUILD@/$BUILD/g;s/@XPI_NAME@/$XPI_NAME/g;s/@MIN_VERSION@/$MIN_VERSION/g;s/@MAX_VERSION@/$MAX_VERSION/g;s/@XPIHASH@/$XPIHASH/g;s/@XULRUNNER_XUL@/$XULRUNNER_XUL/g;" < $1 > temp
mv -f temp $1

if [ ! $DEBUG ]; then
    sed -f sed-debug-script < $1 > temp
    mv -f temp $1
fi
