#!/bin/sh

export NAME='Pencil'
export VERSION='2.0.8'
export BUILD=`date -I | sed 's/-//g'`
export AUTHOR='Pavan Rikhi(pavan.rikhi@gmail.com) and Contributors'
export XPI_NAME='Pencil-'$VERSION'.xpi'
export MIN_VERSION='36.0'
export MAX_VERSION='36.*'
export UPDATE_URL="http://pencil.evolus.vn"
export XULRUNNER_XUL="*"
