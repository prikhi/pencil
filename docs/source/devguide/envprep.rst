Preparing the Development Environment
=====================================

This document gives you a quick overview of how the development environment can be set up for developers to start creating stencils.

Creating the skeleton structure
-------------------------------

To start a new stencil collection, you need to have a dedicated directory in your local file-system to store all files related to that collection. A minimal collection requires only the Definition.xml file while more complex collection requires extra files/directories to store icons.

A typical collection structure should be created as in the following diagram::

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
        description="More description about this collection"
        author="Names of the authors"
        url="Optional URL to its web page">

        <!-- Your shapes go here -->

    </Shapes>

Development tools
-----------------

Developing Pencil stencil collections requires no special tools. What you need is just a text editor and for distribution, you need just a compatible archiving tool that can create ZIP files.

Although special tools are not requires, the following set of software programs are recommended since they will help you get your job done much easier.

* **Text editor:** for GNU/Linux users, gedit is recommended. It should be installed by default in many Gnome-based distributions. For Windows users, Notepad ++ is an awesome selection. For Mac users, I strongly recommend Textmate which is now open source software.

* **SVG editor:** it's for sure that I will recommend only Inkscape which is, to me, the most standard-compliant SVG editor. You will need it in all SVG-related works when creating your stencils.

* **Bitmap editor:** you may need a bitmap editor sometimes for either creating stencil icons or editing bitmaps used in the stencil code. I recommend Gimp for all your needs, including all everyday bitmap editing activities, not just for developing stencils.

Installing into Pencil as a developer collection
------------------------------------------------

Pencil provides a convenient way to load and reload stencil collection that is under development as it is installed like the others for the testing purpose.

To load your collection, go to Tools » Developer Tools » Load Developer Stencil Directory... and select the directory that contains your Definition.xml file. To reload your stencil collection after making changes, simply hit the "F5" key.

Debugging in stencil development
--------------------------------

There may be cases that you encounter issues in your stencil JavaScript code and would like to debug it. There is no supported way to setup interactive debugging session for your stencil code like what you may have with an IDE. The only way to debug your code is to add debugging trace messages. Since stencil JavaScript code is executed in a sand-boxed environment, using of alert or file writing is not possible.

For the purpose of debugging, Pencil provides a utility function named stencilDebug for logging a message to the console::

    stencilDebug("Value of x: " + x);

This statement will log the message to the Error Console that can be enabled by changing the launching of Pencil to::

    xulrunner -app "path_to_pencil_application.ini" -jconsole

Packaging for distribution
--------------------------

When you feel ready with your collection and would like to distribute it to other users, you need to create a package by compress all files in the stencil directory in a single ZIP package and make sure that the Definition.xml file is located at the root level in the ZIP file.
