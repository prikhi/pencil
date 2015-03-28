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


## Develop

If you set the `DEBUG` environmental variable, the `build.sh` script will
enable debugging settings, like printing calls to `dump()` to the console:
```bash

export DEBUG=true
cd build
./build.sh linux
xulrunner Outputs/Linux/application.ini -console

```

If you make changes that affect users, please update `CHANGELOG.md`.
Setting `DEBUG` will cause also Pencil to start a remote debugging server on
port `6000`. This lets you use Firefox's DOM Inspector to debug Pencil. You can
connect Firefox to the debugging server by going to `Firefox -> Tools -> Web
Developer -> Connect...`. You may need to enable Remote Debugging under
Firefox's `Web Developer Tools` Settings(`Ctrl-Shift-I` then click the gear
icon in the upper-right).


## License

This fork is released under GPLv2 like it's parent codebase.

http://pencil.evolus.vn/

https://code.google.com/p/evoluspencil/
