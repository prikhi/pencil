# Pencil

A GUI prototyping tool for Firefox, GNU/Linux, OS X & Windows.

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

You will need version 36 or higher of [`firefox`](https://www.mozilla.org/firefox/) to run Pencil as a Firefox
Extension. Linux users will need version 36 of either `firefox`, `iceweasel` or
[`xulrunner`](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/XULRunner). The Windows installer and OS X archive has everything you need
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

To build the docs locally you'll need [`Sphinx`](http://sphinx-doc.org/) and the `sphinx_rtd_theme`,
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
* **File Bugs** and Feature Requests. If you are unsure how to do this, read
  ["Writing Good Bug Reports"][writing-bugs].
* **Reproduce Bugs** – there are many issues which have not been confirmed since
  they were migrated from the original project. Try to reproduce the bug and
  state in a comment if you could reproduce it or not.  State your operating
  system and Pencil version ([example bug][example-bug]).
* **Report Duplicate Bugs** - lots of imported bugs are duplicates and simply add
  noise to the issue tracker. If you notice a duplicate issue, please leave a
  comment on the issue & mention the issue that you think it duplicates.
* **Improve the [Documentation][docs]**. The files are in the `docs` folder and
  written in [reStructuredText][rst-quickref].
* **Just spread the word** :)

### Technical Users
* **Package Pencil** for your distribution or OS.
* **Create a Stencil** Collection for your favorite UI framework or improve
  Pencil's default offering, as described in the
  [Stencil Developer Documentation][stencil-dev-docs].

### Developers
* **There are many bugs to fix** – if you could tackle one or two that would be
great! The most important bugs have a [Critical label][critical-issues]. The
`stars` labels are a heritage of the old google code repository: Many stars =
many people interested in the bug or feature. You can also check the
[Milestones][milestones] for issues to tackle.
* **Commenting and documenting** code to ease the programming for others – most of it is currently without comments and having them would help much. 

If you make changes that affect users, please update `CHANGELOG.md`.

For lots more information on getting started developing on Pencil, check out
the [Developer's Documentation][dev-docs].


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

[writing-bugs]: http://www.lee-dohm.com/2015/01/04/writing-good-bug-reports.html
[example-bug]: https://github.com/prikhi/pencil/issues/640
[rst-quickref]: http://docutils.sourceforge.net/docs/user/rst/quickref.html
[stencil-dev-docs]: https://pencil-prototyping.readthedocs.org/en/develop/stencil-dev/

[critical-issues]: https://github.com/prikhi/pencil/labels/Priority-Critical
[milestones]: https://github.com/prikhi/pencil/milestones?state=open
[dev-docs]: https://pencil-prototyping.readthedocs.org/en/develop/developers/
