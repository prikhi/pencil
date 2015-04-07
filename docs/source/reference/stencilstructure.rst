Stencil Collection Structure and File Format
============================================

Stencil Collection Structure
----------------------------

A stencil collection is usually distributed as a single ZIP archive containing all related files for that collection.

This collection ZIP archive has one main XML file named (exactly) Definition.xml and other optional files or sub-directories containing supporting files for the main XML (primarily icon files).

The Definition.xml file name is case-sensitive and is the only required file for a collection. All other files can be omitted when not needed.

Format of the Definition.xml file
---------------------------------

Each Definition.xml file defines a collection of stencils by providing collection information and all stencil definitions. This is just a standard XML file that can be created by virtually any text editor you have on your system.

General Structure
^^^^^^^^^^^^^^^^^

The Definition.xml file has the following structure:

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

        <Properties>
            <!-- Collection properties -->
        </Properties>
        <Script>
            <!-- Shared script code for your collection -->
        </Script>

        <!-- Shape and shortcut definitions -->
        <Shape>...</Shape>
        <Shortcut>...</Shortcut>

    </Shapes>

The following list summarizes the format:

* The out-most tag is ``<Shapes>`` with the namespace URI set to *http://www.evolus.vn/Namespace/Pencil*

* Information about the collection is specified by the ``<Shapes>`` node's attributes: id, displayName, description, author and url.

* A collection may have properties that can referenced as initial values for shape properties. These properties should be defined in the ``<Properties>`` section of the collection.

* A collection may also have shared JavaScript code that can be re-used across its shapes. Such code can be defined in the ``<Script>`` tag.

* Each shape in the collection is defined in a separate ``<Shape>`` tag placed right under the root ``<Shapes>`` tag. Please refer the next section for details on definition structure for a shape.

* Beside shapes, a collection may contain also shortcuts which are references to another shape with different default values for its properties. Shortcuts are defined in ``<Shortcut>`` tags.

The <Shape> tag
^^^^^^^^^^^^^^^

Each shape in a collection is defined in a ``<Shape>`` tag with the following structure:

.. code-block:: xml

    <Shape id="shape_id" displayName="Shape display name" icon="url_to_shape_icon">
        <Properties>
            <PropertyGroup name="Property group name">
                <Property name="..."
                    displayName="..."
                    type="...">{Default value}</Property>
                <Property>...</Property>
                <Property>...</Property>
            </PropertyGroup>
            <PropertyGroup>...</PropertyGroup>
        </Properties>
        <Behaviors>
            <For ref="target_element_id">
                <!-- Single argument behavior, for example 'Font' -->
                <Behavior_Name>JS expression for input value<Behavior_Name>

                <!-- Multi argument behavior, for example 'BoxFit' -->
                <Other_Behavior_Name>
                    <Arg>JS expression for argument 1</Arg>
                    <Arg>JS expression for argument 2</Arg>
                    ...
                </Other_Behavior_Name>
            </For>
        </Behaviors>
        <p:Content xmlns:p="http://www.evolus.vn/Namespace/Pencil" xmlns="http://www.w3.org/2000/svg">
            <!-- SVG content of the stencil
                Each element can be identified by the 'id' attribute
                which is referenced by the 'ref' attributes in the Behavior
                sections defined above -->
        </p:Content>
    </Shape>

The collection's <Properties> tag
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The collection's ``<Properties>`` tag is used as the place to define properties at the collection level. This is the recommended way for stencil author to define changeable default values for shape properties. Properties defined in this section can be referenced in the stencil's code using the ``$$`` syntax and can be changed by users by right-clicking on the collection in the collection pane.

The structure of this section is similar to the ``<Properties>`` section at the stencil level:

.. code-block:: xml

    <Shapes>
        ...
        <Properties>
            <PropertyGroup name="Text">
                <Property displayName="Default Text Font"
                    name="defaultTextFont"
                    type="Font">Helvetica|normal|normal|12px</Property>
                <Property displayName="Default Text Color"
                    name="defaultTextColor"
                    type="Color">#000000ff</Property>
            </PropertyGroup>
        </Properties>
        ...
    </Shapes>

The collection's <Script> tag
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The collection's ``<Script>`` tag is used to define shared JavaScript code within a collection. JavaScript code in this section will be executed when the collection is loaded into Pencil. In the execution context of these scripts, a special object named ``collection`` is available and is virtually bound to the collection itself. This object is also available in the execution of behavior and action code of each stencil so developers can use it as a shared object for storing function definitions and constants that need to be used across stencils.

.. code-block:: xml

    <Shapes>
        ...
        <Script commnent="Shared collection objects">
            //sample constant definition
            collection.DEFAULT_PADDING = 5;

            //sample shared function
            collection.gradToDeg = function (grad) {
                return grad * 180 / Math.PI;
            };
        </Script>
        ...
    </Shapes>

The collection's <Shortcut> tag
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The ``<Shortcut>`` tag creates an alias to an existing stencil and provides different initial values to that stencil's properties. The structure of this tag is described below:

.. code-block:: xml

    <Shapes>
        ...
        <Shortcut displayName="Display name"
            icon="..."
            to="[collection_id:]stencil_id">
            <PropertyValue name="property_name">new default value</PropertyValue>
            <PropertyValue>...</PropertyValue>
            <PropertyValue>...</PropertyValue>
        </Shortcut>
        ...
    </Shapes>
