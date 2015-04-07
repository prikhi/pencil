Preparing the Development Environment
=====================================

This document gives you a quick overview of how the development environment can be set up for developers to start creating stencils.

Creating the skeleton structure
-------------------------------

To start a new stencil collection, you need to have a dedicated directory in your local file-system to store all files related to that collection. A minimal collection requires only the Definition.xml file while a more complex collection requires extra files/directories to store icons.

A typical collection structure should be created as shown in the following diagram::

    [dir] CollectionName
      |
      |__[dir] icons  #optional
      |     |
      |     |__shape1.png
      |
      |__Definition.xml

The Definition.xml file should contain the following skeleton code:

.. code-block:: xml

    <Shapes xmlns="http://www.evolus.vn/Namespace/Pencil"
        xmlns:p="http://www.evolus.vn/Namespace/Pencil"
        xmlns:svg="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"

        id="your_collection_id"
        displayName="Display name of your collection"
        description="Further description of this collection"
        author="Names of the authors"
        url="Optional URL to the collection's web page">

        <!-- Your shapes go here -->

    </Shapes>

Development tools
-----------------

Developing Pencil stencil collections requires no special tools. All that's needed is a text editor and, for distribution, a compatible archiving tool that can create ZIP files.

Although special tools are not required, the following set of software programs may be useful in the stencil creation process.

* **Text editor:** Just about any modern text editor is sufficent for creating stencils. Features such as XML syntax highlighting and completion are useful when editing stencil collections. For GNU/Linux users, gedit is recommended. It should be installed by default in many Gnome-based distributions. For Windows users, Notepad ++ is an awesome selection. For Mac users, the open-source Textmate is strongly recommended.

* **SVG editor:** Inkscape provides powerful tools for creating standards-compliant SVGs. You will need it for all SVG-related work when creating your stencils.

* **Bitmap editor:** You may need a bitmap editor for creating stencil icons or editing bitmaps used in the stencil code. GIMP is highly recommended for all your needs, including all everyday bitmap editing activities, not just for developing stencils.

Installing into Pencil as a developer collection
------------------------------------------------

Pencil provides a convenient way to load and reload a stencil collection that is under development as if it is installed like the others for testing purpose.

To load your collection, go to Tools » Developer Tools » Load Developer Stencil Directory... and select the directory that contains your Definition.xml file. To reload your stencil collection after making changes, simply hit the "F5" key.

Debugging in stencil development
--------------------------------

There may be cases where you encounter issues in your stencil JavaScript code that you would like to debug. There is no supported way to set up a interactive debugging session for your stencil code like what you may have with an IDE. The only way to debug your code is to add debugging trace messages. Since stencil JavaScript code is executed in a sand-boxed environment, use of ``alert`` or file writing is not possible.

For the purpose of debugging, Pencil provides a utility function named stencilDebug for logging a message to the console::

    stencilDebug("Value of x: " + x);

This statement will log the message to the Error Console that can be enabled by launching Pencil via::

    xulrunner -app "path_to_pencil_application.ini" -jconsole

Packaging for distribution
--------------------------

When you're happy with your collection and would like to distribute it to other users, you'll need to create a package by compressing all files in the stencil directory into a single ZIP package. Make sure that the ``Definition.xml`` file is located at the root level of ZIP file.
