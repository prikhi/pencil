# Pencil

A GUI prototyping tool for GNU/Linux, Windows & Mac.


## Status

This project was originally hosted on https://code.google.com/p/evoluspencil/ &
was abandoned around 2013. This fork was started for new development on March
13th, 2015.

Much of this project is still unmaintained & could use some love.


## Prerequisites

You will need version 36 or higher of `firefox` or `xulrunner` to run Pencil
under Linux. Windows builds have everything you need in the installer.


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

There is currently no toolbar icon, you need to press `Alt+T` to open the Tools
menu in Firefox and select Pencil from there.

### Linux
```bash

cd build
./build.sh linux
xulrunner Outputs/Linux/application.ini || firefox --app Outputs/Linux/application.ini

```

### Windows

You'll need `wget` installed so you can pull the Windows XULRunner runtime.

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


## License

This fork is released under GPLv2 like it's parent codebase.

http://pencil.evolus.vn/

https://code.google.com/p/evoluspencil/
