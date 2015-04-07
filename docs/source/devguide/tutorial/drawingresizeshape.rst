Drawing Resizeable Shapes - The box Property
============================================

In most cases, shapes are expected to be scalable. Pencil uses the
``Dimension`` property type to set shape size through the ``Box`` behaviour. A
Dimension property named ``box`` can be modified by the on-screen geometry
editor. The box size changes will be applied to the shape size.

The example in this tutorial is a resizeable rectangle based on a $box
property.

.. code-block:: xml

    <Shape id="RoundedRect" displayName="Rectangle" icon="...">
        <Properties>
            <PropertyGroup>
                <Property name="box" type="Dimension">200,80</Property>
            </PropertyGroup>
            <PropertyGroup name="Background">
                <Property name="fillColor" displayName="Background Color" type="Color">#4388CCff</Property>
            </PropertyGroup>
            <PropertyGroup name="Border">
                <Property name="strokeColor" displayName="Line Color" type="Color">#1B3280ff</Property>
                <Property name="strokeStyle" displayName="Line Style" type="StrokeStyle">2|</Property>
            </PropertyGroup>
        </Properties>
        <Behaviors>
            <For ref="rrRect">
                <Box>$box</Box>
                <Fill>$fillColor</Fill>
                <StrokeColor>$strokeColor</StrokeColor>
                <StrokeStyle>$strokeStyle</StrokeStyle>
            </For>
        </Behaviors>
        <p:Content xmlns:p="http://www.evolus.vn/Namespace/Pencil" xmlns="http://www.w3.org/2000/svg">
            <rect id="rrRect" x="0" y="0" />
        </p:Content>
    </Shape>

The SVG rectangle has width and height attributes. The Box behaviour will use
the input Dimension value to change those width and height attributes. When the
user scales the shape using the on-canvas geometry editor, the behaviour will
apply the changes to the SVG element.

Add Rounded Corner
------------------

SVG rectangle may have rounded corners. Pencil also supports Radius behaviour
to simplify this. In this example we add a Handle property into the shape and
use its value in the Radius behaviour.

.. code-block:: xml

    <PropertyGroup name="Handles">
        <Property name="radius" displayName="Corner Radius"
            type="Handle" p:lockY="true" p:minX="0" p:maxX="$box.w / 2">0,0</Property>
    </PropertyGroup>

    <Behaviors>
        ...
        <Radius>
        <Arg>$radius.x</Arg>
        <Arg>$radius.x</Arg>
        </Radius>
        ...
    </Behaviors>

In previous examples, the ``Dimension`` property type is used for drawing
resizeable shapes via the ``Box`` behaviour. However the ``Box`` behaviour can
only be used in cases where the target element supports width and height
attributes. For cases where we want to apply the ``Dimension`` value to an
arbitrary attribute we can use the ``Attr`` behaviour. This approach can be
used for all property types, not just ``Dimension``.

.. code-block:: xml

    <Shape id="ms-oval" displayName="Oval" icon="Icons/oval.png">
        <Properties>
            <PropertyGroup>
                <Property name="box" displayName="Box" type="Dimension">100,80<Property>
            </PropertyGroup>
            <PropertyGroup name="Background">
                <Property name="fillColor" displayName="Background Color" type="Color">#4388CCff</Property>
            </PropertyGroup>
            <PropertyGroup name="Border">
                <Property name="strokeColor" displayName="Line Color" type="Color">#1B3280ff</Property>
                <Property name="strokeStyle" displayName="Line Style" type="StrokeStyle">2|</Property>
            </PropertyGroup>
        </Properties>
        <Behaviors>
            <For ref="ellipse">
                <StrokeColor>$strokeColor</StrokeColor>
                <StrokeStyle>$strokeStyle</StrokeStyle>
                <Fill>$fillColor</Fill>
                <Attr>
                    <Arg>"cx"</Arg>
                    <Arg>$box.w / 2</Arg>
                </Attr>
                <Attr>
                    <Arg>"cy"</Arg>
                    <Arg>$box.h / 2</Arg>
                </Attr>
                <Attr>
                    <Arg>"rx"</Arg>
                    <Arg>$box.w / 2</Arg>
                </Attr>
                <Attr>
                    <Arg>"ry"</Arg>
                    <Arg>$box.h / 2</Arg>
                </Attr>
            </For>
        </Behaviors>
        <p:Content xmlns:p="http://www.evolus.vn/Namespace/Pencil" xmlns="http://www.w3.org/2000/svg">
            <ellipse id="ellipse" />
        </p:Content>
    </Shape>

The ``<Attr></Attr>`` behaviour can be used for assigning a value to any
attribute of an object. In the previous example, the ``Attr`` behaviour can
also be used instead of ``<Box>$box</Box>`` for the rectangle element:

.. code-block:: xml

    <Attr>
        <Arg>"width"</Arg>
        <Arg>$box.w</Arg>
    </Attr>
    <Attr>
        <Arg>"height"</Arg>
        <Arg>$box.h</Arg>
    </Attr>
