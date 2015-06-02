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
`xulrunner`. The Windows installer and OS X archive has everything you need
built-in.


## Install

Windows, Linux, OS X & Firefox Packages are available for download from the
[Releases Page][releases].

To install the OS X package, unzip the archive and copy the `Pencil.app` folder
to your `Applications` directory.

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

This will create a `Pencil.app` folder in `Outputs/Mac` and a compressed
version in `Outputs/`.

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
reports are appreciated. 

### Users
* File Bugs and Feature Requests. If you are unsure how to do this, read ["Writing Good Bug Reports"](http://www.lee-dohm.com/2015/01/04/writing-good-bug-reports.html).
* Reproduce Bugs – there are quite many which are not "confirmed". Try to reproduce the bug and state in a comment if you could reproduce it or not. State your operating system and Pencil version ([example bug](https://github.com/prikhi/pencil/issues/640)). 
* Improve the [documentation](http://pencil-prototyping.readthedocs.org/en/latest/). The files are in the "docs" folder and written in [reStructuredText](http://docutils.sourceforge.net/docs/user/rst/quickref.html)
* just spread the word :)

### Technical
* Package Pencil for your distribution or OS
* Write Stencils, like described in the [docs](http://pencil-prototyping.readthedocs.org/en/latest/).

### Develop
There are many bugs to fix – if you could tackle one or two that would be great! The most important bugs have the [critical](https://github.com/prikhi/pencil/labels/Priority-Critical) label; The "stars" are a heritage of the old google code repo: Many stars = many people interested in the bug (fix).

Commenting uncommented code to ease the programming for others is also appreciated. 

Begin your journey with the `MainWindow.xul`/ `MainWindow.js` which is the code that kicks of the application. 

If you make changes that affect users, please update `CHANGELOG.md`.

#### Hints

Begin your journey with the `MainWindow.xul`/ `MainWindow.js` which is the code that kicks of the application. 

For programming, you probably want to setup an [extension development environment](https://developer.mozilla.org/en-US/Add-ons/Setting_up_extension_development_environment). 

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

A `release.sh` script lives in the `build` directory to automate the creation
of new releases. You will need `git`, `curl`, `sed` and `jshon`. Then you can
just pass the new version number to the script:

```bash
cd build
./release.sh 2.4.42
```

The script will create a new release branch, update version numbers and
checksums, build the packages, commit/tag/push the release branch, create a new
release on github and upload the packages. You will be prompted for your Github
credentials.

Once the script is complete, you will have to manually merge the release branch
into the `master` and `develop` branches, then delete the release branch:

```bash
git checkout master
git merge release-v2.4.42
git push origin
git checkout develop
git merge release-v2.4.42
git push origin

git push origin :release-v2.4.42
git branch -d release-v2.4.42
```


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
