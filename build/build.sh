#!/usr/bin/env bash

. ./properties.sh


run_task() {
  task=$@

  ${task}
  result=$?

  if [ "${result}" != "0" ]; then
    echo ":: Task has failed with exit code ${result}" 1>&2
    echo " -> ${task}"
    exit ${result}
  fi
}


prep() {
    rm -Rf ./Outputs/
    mkdir -p ./Outputs

    echo "--------------------------"
    echo "* Preparing Common Files *"
    echo "--------------------------"

    rm -Rf ./Outputs/Pencil/
    mkdir -p ./Outputs/Pencil/

    echo "Configuring build..."
    PKG_NAME="pencil"
    XUL_VERSION='36.0.1'        # The version of XULRunner for Private XREs


    echo "Copying base application files..."
    run_task cp -R ../app/* ./Outputs/Pencil/

    echo "Copying icons..."
    mkdir -p ./Outputs/Pencil/chrome/icons/default/
    run_task cp ./Outputs/Pencil/skin/classic/pencil.ico ./Outputs/Pencil/chrome/icons/default/pencilMainWindow.ico
    run_task cp ./Outputs/Pencil/skin/classic/pencil.xpm ./Outputs/Pencil/chrome/icons/default/pencilMainWindow.xpm

    echo "Configuring application..."
    run_task ./replacer.sh ./Outputs/Pencil/application.ini
    run_task ./replacer.sh ./Outputs/Pencil/defaults/preferences/pencil.js
    run_task ./replacer.sh ./Outputs/Pencil/content/pencil/mainWindow.xul
    run_task ./replacer.sh ./Outputs/Pencil/content/pencil/aboutDialog.xul
    run_task ./replacer.sh ./Outputs/Pencil/content/pencil/aboutDialog.js
    run_task ./replacer.sh ./Outputs/Pencil/content/pencil/common/pencil.js
    run_task ./replacer.sh ./Outputs/Pencil/content/pencil/common/util.js

    if [ ! $DEBUG ]; then
        echo "Removing debugging files..."
        run_task rm ./Outputs/Pencil/defaults/preferences/personal.js.xulrunner
        run_task rm ./Outputs/Pencil/defaults/preferences/debug.js
    fi
}

xpi() {
    echo "----------------"
    echo "* Building XPI * $XPI_NAME"
    echo "----------------"
    OUTPUT="./Outputs/XPI"
    rm -Rf $OUTPUT/
    mkdir -p $OUTPUT/

    run_task cp -R ./Outputs/Pencil/* $OUTPUT/
    run_task cp -R ./XPI/* $OUTPUT

    run_task ./replacer.sh $OUTPUT/install.rdf
    run_task ./replacer.sh $OUTPUT/update.rdf

    echo "Configuring XPI-specific settings..."
    run_task cp -f ../app/defaults/preferences/pencil.js $OUTPUT/defaults/preferences/pencil.js
    export XULRUNNER_XUL=""
    run_task ./replacer.sh ./Outputs/XPI/defaults/preferences/pencil.js

    echo "Removing branding..."
    run_task sed -ni '/branding/!p' $OUTPUT/chrome.manifest


    echo "Compressing XPI file..."
    cd $OUTPUT/
    rm -f ../$XPI_NAME
    run_task zip -r --quiet ../$XPI_NAME *
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
    run_task cp -R ./Outputs/Pencil/* $OUTPUT/

    echo "Compressing..."
    cd ./Outputs
    run_task cp -R ../$OUTPUT $PKG_NAME
    run_task tar -czf ./Pencil-$VERSION-linux.tar.gz $PKG_NAME
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
    run_task cp -R ./Outputs/Pencil/* $OUTPUT/usr/share/$PKG_NAME/

    echo "Copying executable and mime information..."
    run_task cp ./Linux/pencil $OUTPUT/usr/bin/
    run_task cp ./Linux/pencil.desktop $OUTPUT/usr/share/applications/
    run_task cp ./Linux/ep.xml $OUTPUT/usr/share/mime/packages/

    echo "Compressing..."
    cd ./Outputs
    run_task cp -R ../$OUTPUT $PKG_NAME
    run_task tar -czf ./Pencil-$VERSION-linux-pkg.tar.gz $PKG_NAME
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
        run_task curl $XUL_DL_URL -o temp.zip
        run_task unzip temp.zip -d Win32
        run_task rm temp.zip
    fi

    echo "---------------------------------------------"
    echo "* Building Win32 Installer with Private XRE *"
    echo "---------------------------------------------"
    OUTPUT="./Outputs/Win32"

    rm -Rf $OUTPUT/
    mkdir -p $OUTPUT/app

    run_task cp -R ./Outputs/Pencil/* $OUTPUT/app/
    run_task cp -R ./Win32/* $OUTPUT/

    run_task ./replacer.sh $OUTPUT/setup.nsi

    cd $OUTPUT
    echo "Compiling Windows Installer..."
    run_task makensis -V2 pencil.nsi && run_task makensis -V2 setup.nsi
    cd ../../
}

mac() {
    if [ ! -d 'Mac/XUL.framework' ]; then
        echo "-------------------------"
        echo "* Downloading XULRunner *"
        echo "-------------------------"
        XUL_DL_URL="http://ftp.mozilla.org/pub/mozilla.org/xulrunner/releases/$XUL_VERSION/runtimes/xulrunner-$XUL_VERSION.en-US.mac.tar.bz2"
        run_task curl $XUL_DL_URL -o temp.tar.bz2
        run_task tar -jxvf temp.tar.bz2 -C Mac
        run_task rm temp.tar.bz2
    fi
    echo "------------------------------------------"
    echo "* Building Mac OS X App with Private XRE *"
    echo "------------------------------------------"

    OUTPUT="./Outputs/Mac"

    rm -Rf $OUTPUT
    mkdir $OUTPUT

    run_task cp -R ./Mac/* $OUTPUT/

    mkdir -p $OUTPUT/Pencil.app/Contents/Resources/
    run_task cp -R ./Outputs/Pencil/* $_
    run_task cp -RL $OUTPUT/XUL.framework/Versions/Current/* $OUTPUT/Pencil.app/Contents/MacOS/
    run_task mv $OUTPUT/Pencil.app/Contents/MacOS/dependentlibs.list $OUTPUT/Pencil.app/Contents/Resources/dependentlibs.list
    run_task cp ./Outputs/Pencil/application.ini $OUTPUT/Pencil.app/Contents/Resources/application.ini

    run_task ./replacer.sh $OUTPUT/Pencil.app/Contents/Resources/application.ini
    run_task ./replacer.sh $OUTPUT/Pencil.app/Contents/Resources/defaults/preferences/pencil.js
    run_task ./replacer.sh $OUTPUT/Pencil.app/Contents/Info.plist

    echo "Compressing..."
    cd $OUTPUT
    run_task zip -r --quiet ../Pencil-$VERSION-mac-osx.zip Pencil.app
    cd ../..
}


ubuntu() {
    PKG="pencil-${VERSION}-ubuntu-all"
    DIR_TARGET="./Outputs/Ubuntu"
    DIR_BASE="${DIR_TARGET}/${PKG}"
    DIR_DEB="${DIR_BASE}/DEBIAN"
    DIR_SHARE="${DIR_BASE}/usr/share"

    echo "-----------------------"
    echo "* Building Ubuntu deb *"
    echo "-----------------------"

    rm -Rf ${DIR_TARGET}

    run_task mkdir -p "${DIR_BASE}/usr/bin" "${DIR_SHARE}/applications" "${DIR_SHARE}/doc/pencil"
    run_task cp ./Linux/pencil "${DIR_BASE}/usr/bin/pencil"
    run_task cp ./Linux/pencil.desktop "${DIR_SHARE}/applications/pencil.desktop"
    run_task cp -r ./Outputs/Pencil "${DIR_BASE}/usr/share/pencil"
    run_task mkdir -p "${DIR_DEB}"

    old_ifs="${IFS}"
    IFS=$(echo -e "\n")
    ctrl=$(cat Ubuntu/control)
    copy=$(cat Ubuntu/copyright)

    for line in $ctrl; do
      line=$(echo $line | sed "s/{VERSION}/${VERSION}/g")
      line=$(echo $line | sed "s/{MAINTAINER}/${MAINTAINER}/g")
      line=$(echo $line | sed "s/{MIN_VERSION}/${MIN_VERSION}/g")
      echo $line >> ${DIR_DEB}/control
    done

    for line in $copy; do
      line=$(echo $line | sed "s/{MAINTAINER}/${MAINTAINER}/g")
      echo $line >> ${DIR_SHARE}/doc/pencil/copyright
    done

    IFS="${old_ifs}"
    run_task cp ../CHANGELOG.md ${DIR_SHARE}/doc/pencil/changelog
    run_task gzip -9 ${DIR_SHARE}/doc/pencil/changelog

    # Remove extra license files to avoid Lintian warning
    rm ${DIR_SHARE}/pencil/content/pencil/license.txt
    rm ${DIR_SHARE}/pencil/license.txt

    # Packages retain ownership, files should be owned by root
    run_task sudo chown -R root ${DIR_BASE}

    run_task dpkg-deb --build ${DIR_BASE}

    run_task mv ${DIR_TARGET}/*.deb ./Outputs/

    # Clean up the build dir now, while we still have sudo access
    sudo rm -rf ${DIR_TARGET}
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
    fi

    if [ -d 'Mac/XUL.framework' ]; then
        echo "Removing the Mac copy of XULRunner..."
        rm -Rf ./Mac/XUL.framework
    fi
    clean
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
        ubuntu
        ;;
esac

echo "Done!"
