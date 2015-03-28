#!/bin/sh

export NAME='Pencil'
export VERSION='2.0.7'
export BUILD=`date -I | sed 's/-//g'`
export AUTHOR='Duong Thanh An (an.duong@evolus.vn) and Contributors'
export XPI_NAME='Pencil-'$VERSION'-'$BUILD'-fx.xpi'
export MIN_VERSION='36.0'
export MAX_VERSION='36.*'
export XUL_VERSION='36.0.1'
export UPDATE_URL="http://pencil.evolus.vn"
export XULRUNNER_XUL="*"
