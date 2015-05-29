#!/bin/bash
#
# This script creates a release on a new branch, it does not modify any
# long-term branches.
#
# The only expected argument is the new version number:
#
#       ./release.sh 2.0.11

main() {
    # Github Credentials
    read -p "Enter your Github username: " GITHUB_USER
    read -s -p "Enter your Github password: " GITHUB_PASS
    echo ""


    # Config
    echo "Configurating..."
    . ./properties.sh       # Gives us access to the previous version
    NEW_VERSION="$1"
    REPO_NAME='pencil'
    REPO_OWNER='prikhi'
    API_ENDPOINT="https://api.github.com/repos/$REPO_OWNER/$REPO_NAME"


    # Update Code
    echo "Checking out a release branch..."
    RELEASE_BRANCH="release-v$NEW_VERSION"
    git checkout develop -b $RELEASE_BRANCH

    echo "Switching version numbers..."
    VERSION_FILES=("../docs/source/conf.py"
                   "./properties.sh"
                   "./ArchLinux/PKGBUILD")
    for f in ${VERSION_FILES[@]}; do
        sed -i "s/$VERSION/$NEW_VERSION/" $f
        git add $f
    done

    echo "Sectioning off changelog..."
    sed -i "s/# develop/# develop\n\n# v$NEW_VERSION/" ../CHANGELOG.md
    git add ../CHANGELOG.md

    echo "Building packages..."
    #./build.sh > /dev/null

    echo "Updating ArchLinux PKGBUILD..."
    ARCH_PKGBUILD="./ArchLinux/PKGBUILD"
    LINUX_SHA256=`sha256sum ./Outputs/Pencil-$NEW_VERSION-linux-pkg.tar.gz | cut -d" " -f 1`
    sed -i "s/sha256sums.*/sha256sums=('$LINUX_SHA256')/" $ARCH_PKGBUILD
    sed -i "s/pkgrel.*/pkgrel=1/" $ARCH_PKGBUILD
    git add $ARCH_PKGBUILD



    # Commit, Tag & Push
    echo "Commiting changes..."
    git commit -m "Prepare for v$NEW_VERSION Release"

    echo "Tagging commit..."
    git tag -a -m "v$NEW_VERSION" "v$NEW_VERSION"
    #
    echo "Pushing release branch and tag..."
    git push origin
    git push origin --tags



    # Create Github Release & Upload Packages
    BASE_CMD="curl -u $GITHUB_USER:$GITHUB_PASS "

    echo -e "\nCreating draft Github release..."
    RELEASE_DESCRIPTION=`sed -n "/# v$NEW_VERSION/,/# v$VERSION/p" ../CHANGELOG.md | tail -n+3 | head -n-2`
    CREATE_PAYLOAD=`jshon -Q -n {} -s "$RELEASE_DESCRIPTION" -i body -s "v$NEW_VERSION" -i tag_name -s "v$NEW_VERSION" -i name -j`
    CREATE_CMD="$BASE_CMD -s $API_ENDPOINT/releases"
    CREATE_RESPONSE=`$CREATE_CMD --data "$CREATE_PAYLOAD"`


    echo "Uploading packages to Github..."
    UPLOAD_URL=`echo $CREATE_RESPONSE | jshon -e upload_url -u`

    BUILD_FILES=("Pencil-$NEW_VERSION.xpi"
                 "Pencil-$NEW_VERSION-linux.tar.gz"
                 "Pencil-$NEW_VERSION-linux-pkg.tar.gz"
                 "Pencil-$NEW_VERSION-mac-osx.zip"
                 "Pencil-$NEW_VERSION.win32.installer.exe")

    for f in ${BUILD_FILES[@]}; do
        echo "Uploading $f..."
        MIME_TYPE=`file --mime-type $f | cut -f2 -d' '`
        FILE_UPLOAD_URL=`echo $UPLOAD_URL | sed "s/{?name}/?name=$f/"`
        $BASE_CMD -o curl_tmp -H "Content-Type:$MIME_TYPE" --data-binary "@./Outputs/$f" $FILE_UPLOAD_URL
        rm -f curl_tmp
        echo ""
    done


    # Build ArchLinux AUR Package if makepkg is available
    which makepkg > /dev/null
    if [ "$?" == "0" ]; then
        echo "Found makepkg, building ArchLinux source package..."
        cd ./ArchLinux
        PKGDEST="../Outputs/" PKGEXT="archlinux.pkg.tar.gz" makepkg --source
        cd ..
    fi



    echo -e "\n\nTag successfully created & packages uploaded."

    echo "If everything looks alright, merge and push into master and develop:"
    echo -e "\n\tgit checkout master"
    echo -e "\tgit merge $RELEASE_BRANCH"
    echo -e "\tgit push origin"
    echo -e "\tgit checkout develop"
    echo -e "\tgit merge $RELEASE_BRANCH"
    echo -e "\tgit push origin"
    echo -e "\nThen you can delete the release branch:"
    echo -e "\n\tgit push origin '':$RELEASE_BRANCH"
    echo -e "\tgit branch -d $RELEASE_BRANCH"
}

if [ "$#" = "1" ]; then
    main "$1"
else
    echo "Usage:"
    echo -e "\t./release.sh <version-number>"
    echo -e "\t./release.sh 4.2.0"
fi
