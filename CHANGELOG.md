This file describes all user-facing changes, by version.

# develop

* Fix loading .ep files with non-xulrunner binaries(#724).
* Correctly specify `multi-layer SVG` instead of `multi-page SVG` in the
  warning text for SVG exports(#719).
* Fix SVG exports so they use the height and width of the first page instead of
  constants. It is recommended to only use SVG exports for Pencil Documents
  with only one Page(#538).
* Fix resizing a shape vertically causing it to resize and snap to the grid
  horizontally as well (#720).

# v2.0.11

* Add Support for Firefox/XULrunner v38.
* Fix Linux Executable for Systems with Firefox and XULrunner.
* Fix the OS X Build Script(#689).
* Fix Firefox Extension's missing HTML/ODT/Print templates(#691).
* Fix Linux executable for systems where `sh` is not `bash`(#688).
* Fix Windows file asssociations(for real this time, #431).

# v2.0.10

* Add a Czech translation for the Linux .desktop file(#687).
* Support `firefox-bin` in addition to the `firefox` executable for Linux
  builds(#686,#688).

# v2.0.9

* Bump maximum firefox/xulrunner version to 37(#685).
* Fix the link to the 9-patch documentation(#684).

# v2.0.8

* Fix incorrect page backgrounds when exporting the document(#358).
* Open a new document if the file to load does not exist.
* Fix loading files from the command line(#83).
* Fix Windows File Associations(#431).
* Add a Toolbar Icon for Firefox(#671).
* Fix Pencil automatically opening everytime Firefox is launched.
* Fix the icons for the Sketchy GUI stencils(#624).
* Fix the Firefox XPI Build Script.
* Fix the Windows Build Script.
* Add the Ctrl-Q shortcut for quitting Pencil.
* Fix the Basic Web Element Table's "Use HTML Content" property(#143).


# v2.0.7

* Fix exporting PNGs
* Raise Minimum Firefox/XULrunner version to 36.


# v2.0.6

* Fix the Linux Build Script
