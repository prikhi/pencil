# Pencil

A GUI prototyping tool for GNU/Linux, Windows & Mac.


## Status

This project was originally hosted on https://code.google.com/p/evoluspencil/ &
was abandoned around 2013. This fork was started for new development on March
13th, 2015.


## Prerequisites

You will need version 36 or higher of `firefox` to run Pencil as a Firefox
Extension. Linux users will need version 36 of either `firefox` or `xulrunner`.
The Windows installer has everything you need in the built-in.


## Install

No hosted packages yet, sorry. Most likely some will appear in `v2.0.8`.


## Build

The build script is currently broken for Mac OS X :(

### Firefox

Pencil can be installed as an Extension to Firefox, instead of a standalone
app. To build the addon's `XPI` file:
```bash

cd build
./build.sh xpi
firefox Outputs/Pencil*.xpi
```

### Linux
```bash

cd build
./build.sh linux
xulrunner Outputs/Linux/application.ini || firefox --app Outputs/Linux/application.ini --no-remote

```

### Windows

You'll need `wget` installed so you can pull the Windows XULRunner runtime and
`nsis` to compile the installer.

```bash

cd build
./build.sh win32
```

This should place an installer `exe` in the `Outputs/` folder.


## Contibute

You don't have to be a programmer to contribute! All feature requests & bug
reports are appreciated. You can also update or improve the docs, write some
stencils, attempt to reproduce bug reports or just spread the word :)

### Develop

If you make changes that affect users, please update `CHANGELOG.md`.

If you set the `DEBUG` environmental variable, the `build.sh` script will
enable debugging features like printing calls to `dump()` to the console or
`debug()` to the javascript console:
```bash

export DEBUG=true
cd build
./build.sh linux
# If you've got XULRunner:
xulrunner Outputs/Linux/application.ini -console -jsconsole -purgecaches
# If you only have Firefox installed:
firefox --app Outputs/Linux/application.ini --no-remote -console -jsconsole -purgecaches

```

Setting `DEBUG` will cause also Pencil to start a remote debugging server on
port `6000`. This lets you use Firefox's DOM Inspector to debug Pencil. You can
connect Firefox to the debugging server by going to `Firefox -> Tools -> Web
Developer -> Connect...`. You may need to enable Remote Debugging under
Firefox's `Web Developer Tools` Settings(`Ctrl-Shift-I` then click the gear
icon in the upper-right).

#### The Build System

The `build.sh` script is responsible for building everything. Each build is
usually in two steps: copying & modifying files common to all builds then
customizing those files for the specific build(by removing files, embedding
xulrunner, creating the expected direcory structure, etc.).

The build script uses the `properties.sh` file to hold variables such as the
current version & the minimum/maximum firefox/xulrunner versions. The script
uses `replacer.sh` to replace all instances of `@VARIABLE@` with the value of
`VARIABLE` in the file passed to it.

If you add a variable to `properties.sh` you **must** modify the `replacer.sh`
script to replace the variable. If you add a variable to a file, you **must**
make sure that file is processed by `replacer.sh` at some point(usually in the
`prep()` function).

`replacer.sh` uses the `sed-debug-script` to remove all the text between
`//DEBUG_BEGIN` and `//DEBUG_END`. This can be used to enable code only when
building for development. If you add `//DEBUG_BEGIN` and `//DEBUG_END` to a
file, make sure `build.sh` passes the file to `replacer.sh`(again, this usually
happens in the `prep()` function).

You can pass the `clean` argument to `build.sh` to remove all the outputs. You
can use `maintainer-clean` to remove any XULRunner downloads as well.


## License

This fork is released under GPLv2 like it's parent codebase.


## Links

The original project's homepage: http://pencil.evolus.vn/

And it's repository: https://code.google.com/p/evoluspencil/

The current discussion forum:
https://groups.google.com/forum/#!forum/pencil-user
