Your First Shape
================

Let's begin with a collection contains a simple shape that provides a *Hello
World* text item. This shape contains Property definitions, Element definitions
(in the ``p:Content`` section) and Behaviors(which make the content change
according to ``Property`` values).

.. code-block:: xml

    <?xml version="1.0" encoding="UTF-8"?>
    <Shapes xmlns="http://www.evolus.vn/Namespace/Pencil"
        xmlns:p="http://www.evolus.vn/Namespace/Pencil"
        xmlns:svg="http://www.w3.org/2000/svg"
        id="collection" displayName="My Collection"
        description="My First Collection" author="author">

        <Shape id="helloworld" displayName="Hello World"
            icon="Icons/plain-text.png">

            <Properties>
                <PropertyGroup name="Text">
                    <Property name="label" displayName="Label"
                        type="PlainText">Hello World</Property>
                    <Property name="textColor" displayName="Color"
                        type="Color">#000000ff</Property>
                    <Property name="textFont"
                        displayName="Font"
                        type="Font">Arial|normal|normal|13px</Property>
                </PropertyGroup>
            </Properties>

            <Behaviors>
                <For ref="text">
                    <TextContent>$label</TextContent>
                        <Fill>$textColor</Fill>
                        <Font>$textFont</Font>
                        <BoxFit>
                            <Arg>new Bound(0, 0, 100, 12)</Arg>
                            <Arg>new Alignment(0, 1)</Arg>
                        </BoxFit>
                </For>
            </Behaviors>

            <p:Content xmlns:p="http://www.evolus.vn/Namespace/Pencil"
                xmlns="http://www.w3.org/2000/svg">
                <text id="text" />
            </p:Content>
        </Shape>
    </Shapes>


Each child node in ``<For></For>`` is a behavior that defines how content
should be changed according to the properties. More details about can be found
in the :doc:`/reference/behaviors`.

The ``$label`` variable used in the :ref:`TextContent` behavior demonstrates
how properties can be referenced in the input arguments for behaviors.
