#!/bin/sh
cd `dirname $0`
DIR=`pwd`
APP_INI=$DIR/application.ini

xulrunner --app "$APP_INI"
