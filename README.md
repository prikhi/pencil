# Pencil

A GUI prototyping tool for GNU/Linux, Windows & Mac.

![Screenshot](http://i.imgur.com/DF715Nr.png)

### Status

This project was originally hosted on https://code.google.com/p/evoluspencil/ &
was abandoned around 2013. This fork was started for new development on March
13th, 2015.


### Links

* [Downloads][releases]
* [The documentation][docs]
* [The discussion forum][google-group]
* [The original project's homepage][evolus-page]
* [The original repository][evolus-repo]

#### Extra Stencil Collections

* [Android Lollipop][lollipop-collection] by [Nathanielw][nathanielw]
* [Bootstrap (WIP)][bootstrap-collection] by [Nathanielw][nathanielw]
* [Material Design Icons][material-collection] by [Nathanielw][nathanielw]

Additional collections are available on the
[Original Stencil Download Page][evolus-stencil-downloads].


## Prerequisites

You will need version 36 or higher of `firefox` to run Pencil as a Firefox
Extension. Linux users will need version 36 of either `firefox`, `iceweasel` or
`xulrunner`. The Windows installer has everything you need built-in.


## Install

Windows, Linux & Firefox Packages are available for download from the
[Releases Page][releases].

For specific Linux distributions:
* **Arch Linux** - Available in the [AUR][aur-pkg].
* **Nix/NixOS** - Run `nix-env -iA pencil`. You'll need to be tracking
  [Unstable][nix-unstable].

## Build

### Firefox Extension

Pencil can be installed as Firefox Extension, instead of a standalone
application. To build the extension's `XPI` file:
```bash

cd build
./build.sh xpi
firefox Outputs/Pencil*.xpi
```

### Linux
```bash

cd build
./build.sh linux
xulrunner Outputs/Linux/application.ini || firefox --app Outputs/Linux/application.ini
```

A `Pencil-*-linux-pkg.tar.gz` package will also be created. This contains
Pencil nested within the directory structure that most Linux distributions
expect(under `/usr/share` and `/usr/bin`) along with an executable, a desktop
entry & mimetype information. This can be used for creating
distribution-specific packages.

### Windows

You'll need `curl` installed so you can pull the Windows XULRunner runtime and
`nsis` to compile the installer.

```bash

cd build
./build.sh win32
```

This should place an installer `exe` in the `Outputs/` folder.

### OS X

You'll need `curl` installed to fetch the OS X XULRunner runtime.

```bash

cd build
./build.sh mac
```

This will create a `Pencil.app` in the `Outputs/` folder.

### Documentation

To build the docs locally you'll need `Sphinx` and the `sphinx_rtd_theme`,
which are easily installable using `pip`:

```bash

cd docs/
sudo pip install -r requirements.txt
make html
# Or if you want a PDF
make latexpdf
```

The output files will be put in `/docs/build/`.


## Contribute

You don't have to be a programmer to contribute! All feature requests & bug
reports are appreciated. You can also update or improve the docs, package
Pencil for your Linux distribution, write some stencils, attempt to reproduce
bug reports or just spread the word :)

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
firefox --app Outputs/Linux/application.ini -console -jsconsole -purgecaches
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
xulrunner, creating the expected directory structure, etc.).

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

#### Creating a Release

Start off by changing the version numbers in `build/properties.sh` &
`docs/source/conf.py`and sectioning off the changes in `CHANGELOG.md`. Then run
`cd build; ./build.sh` & test the built packages in `Outputs`.

If everything looks OK, update the `pkgver` & `sha256sums` variables in the
`build/ArchLinux/PKGBUILD` file & commit all the changes(with a message like
`Prepare for v2.0.8 Release`).

Create a new tag, merge it into master & push:

```bash

git checkout develop
git tag -s -a v2.0.8
git checkout master
git merge develop
git push
git push --tags
```

Upload the packages in `build/Outputs/` to the new Release created on Github.
Update the GNU/Linux distro-specific packages or ping their maintainers.


## License

This fork is released under GPLv2 like it's parent codebase.


[docs]: http://pencil-prototyping.rtfd.org/
[google-group]: https://groups.google.com/forum/#!forum/pencil-user
[evolus-page]: http://pencil.evolus.vn/
[evolus-repo]: https://code.google.com/p/evoluspencil/
[evolus-stencil-downloads]: https://code.google.com/p/evoluspencil/downloads/list?q=label:Stencil

[releases]: https://github.com/prikhi/pencil/releases
[aur-pkg]: https://aur.archlinux.org/packages/pencil/
[nix-unstable]: https://nixos.org/nixos/manual/sec-upgrading.html

[nathanielw]: https://github.com/nathanielw
[lollipop-collection]: https://github.com/nathanielw/Android-Lollipop-Pencil-Stencils
[material-collection]: https://github.com/nathanielw/Material-Icons-for-Pencil
[bootstrap-collection]: https://github.com/nathanielw/Bootstrap-Pencil-Stencils
