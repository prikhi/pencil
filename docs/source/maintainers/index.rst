Maintainer Documentation
========================

This section contains some information that's useful for Pencil maintainers.


Creating a New Release
----------------------

There's a ``release.sh`` script that lives in the ``build/`` directory. This
script automates:

#. Creating a release branch
#. Updating the version number
#. Sectioning off the changelog
#. Updating distribution-specific files
#. Creating a release commit & tag
#. Pushing the branch to origin
#. Creating a release on Github
#. Uploading the built packages to the Github release

You will need ``git``, ``curl``, ``sed`` and ``jshon``. Then you can just pass
the new version number to the script::

    cd build
    ./release.sh 2.4.42

Once the script is complete, you will have to manually merge the release branch
into the ``master`` and ``develop`` branches, then delete the release branch::

    git checkout master
    git merge release-v2.4.42
    git push origin
    git checkout develop
    git merge release-v2.4.42
    git push origin

    git push origin :release-v2.4.42
    git branch -d release-v2.4.42
