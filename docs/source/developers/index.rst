Developer Documentation
=======================

This section contains useful information for people interested in contributing
code to Pencil.

If you'll be testing & debugging using Firefox, you will probably want to start
off by setting up an `extension development environment`_.


Code Overview
-------------

The application code lives under ``app/content/pencil/``. ``mainWindow.xul`` &
``common/pencil.js`` are good places to start reading the code - they are
responsible for initializing the application.

``mainWindow.xul`` is responsible for specifying the application's base UI,
including keybindings, menus, toolbars, panes, and for including
the application's JavaScript-Files.  ``mainWindow.js`` contains
mostly helper functions used in the ``.xul`` file, along with post-boot code
like parsing command-line arguments & building the ``Recent Documents`` menu.

``common/pencil.js`` initializes a global ``Pencil`` object & sets up event
listeners on boot-up. The ``Pencil`` object contains attributes linked to the
application's Controller, Rasterizer, etc.

``common/controller.js`` is responsible for managing the ``Document`` & it's
``Pages``. The ``Controller`` object contains methods for creating new
Documents/Pages, saving/loading Documents & moving/removing/duplicating Pages.

``common/utils.js`` is a huge grab bag of randomness, from DOM & SVG
manipulation to font sorting to creating temp files to grabbing images from the
clipboard to getting a file's extension from it's path.

``bindings/`` contains components like the color picker & font editor.
``stencils/`` contains the default Stencil Collections bundled with Pencil.


Debugging
---------

If you set the ``DEBUG`` environmental variable when building Pencil, the
``build.sh`` script will enable debugging features like printing calls to
``dump()`` to the console or ``debug()`` to the javascript console::

    export DEBUG=true
    cd build
    ./build.sh linux
    # If you've got XULRunner:
    xulrunner Outputs/Linux/application.ini -console -jsconsole -purgecaches
    # If you only have Firefox installed:
    firefox --app Outputs/Linux/application.ini -console -jsconsole -purgecaches

Setting ``DEBUG`` will cause also Pencil to start a remote debugging server on
port ``6000``. This lets you use Firefox's DOM Inspector to debug Pencil. You
can connect Firefox to the debugging server by going to ``Firefox -> Tools ->
Web Developer -> Connect...``. You may need to enable Remote Debugging under
Firefox's ``Web Developer Tools`` Settings(``Ctrl-Shift-I`` then click the gear
icon in the upper-right).


The Build System
----------------

The ``build.sh`` script is responsible for building everything. Each build is
usually in two steps: copying & modifying files common to all builds then
customizing those files for the specific build(by removing files, embedding
xulrunner, creating the expected directory structure, etc.).

The build script uses the ``properties.sh`` file to hold variables such as the
current version & the minimum/maximum firefox/xulrunner versions. The script
uses ``replacer.sh`` to replace all instances of ``@VARIABLE@`` with the value
of ``VARIABLE`` in the file passed to it.

If you add a variable to ``properties.sh`` you **must** modify the
``replacer.sh`` script to replace the variable. If you add a variable to a
file, you **must** make sure that file is processed by ``replacer.sh`` at some
point(usually in the ``prep()`` function).

``replacer.sh`` uses the ``sed-debug-script`` to remove all the text between
``//DEBUG_BEGIN`` and ``//DEBUG_END``. This can be used to enable code only
when building for development. If you add ``//DEBUG_BEGIN`` and ``//DEBUG_END``
to a file, make sure ``build.sh`` passes the file to ``replacer.sh``(again,
this usually happens in the ``prep()`` function).

You can pass the ``clean`` argument to ``build.sh`` to remove all the outputs.
You can use ``maintainer-clean`` to remove any XULRunner downloads as well.


.. _extension development environment: https://developer.mozilla.org/en-US/Add-ons/Setting_up_extension_development_environment
