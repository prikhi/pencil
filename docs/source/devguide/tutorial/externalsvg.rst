Using External SVG
==================

There may be cases where you would like to create a stencil based on an
existing SVG vector image. Since the internal format of Pencil shapes is also
SVG, it is straight-forward to import an SVG image into a stencil. The general
approach to do this is to use your SVG editor to pick up the SVG code of the
element you want to import and place that SVG XML code into the stencil's
<Content> tag. The recommended SVG editor is Inkscape which is available for
many platforms.

Suppose that we have a hand image in SVG format:

.. image:: /images/tutorial_hand_image.png

And its SVG XML code is the following:

.. code-block:: xml

    <?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
    xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="64" height="64" id="svg2" version="1.1"
    inkscape:version="0.48.1 ">
        <path d="m 32.3,53.9 c -7.8,0 -15.3,0 -15.3,-21 0,-19 3.5,-15.3 5.1,-13.8 v -3.3 c 0.2,-2.4 6,-2.2 6,-0.3 v -3 c 0,-3.2 6.7,-2.9 6.7,-0.8 v 4.1 c 0.2,-2.3 5.4,-3.2 5.6,1.3 0,7 -0.1,14.6 -0.2,16.8 2.7,3 5.7,-11.6 10.9,-9 2.4,2.5 -6.7,19.7 -7.7,21.5 -1,1.7 -5.2,7.5 -11.1,7.5 z"
        id="path8" inkscape:connector-curvature="0"
        style="fill:#ffffff;stroke:#000000;stroke-width:1;stroke-miterlimit:4;stroke-dasharray:none" />
        <path sodipodi:nodetypes="cccccccccc" style="fill:none;stroke:#000000" inkscape:connector-curvature="0" id="path10" d="M 22.025873,18.820772 22.948882,32.71885 M 28.060203,14.888365 29,31 M 34.808683,14.331201 35,32 m 3,5 c 0,0 -5,1 -7,11 M 20,35 c 4,-5 12,-4 17,-3" />
    </svg>

The primary part of the SVG is the set of two ``<path>`` elements. This XML
fragment should be copied into the stencil code as in the following code:

.. code-block:: xml

    <Shape id="hand" displayName="Hand" icon="Icons/hand.png">
        <Properties>
            <PropertyGroup>
                <Property name="box" type="Dimension" p:lockRatio="true">72,90</Property>

                <Property name="fillColor" type="Color" displayName="Background Color">#f3f8c5ff</Property>
            </PropertyGroup>
            <PropertyGroup name="Border">
                <Property name="strokeColor" displayName="Line Color" type="Color">
                    <E>$$strokeColor</E>
                </Property>
                <Property name="strokeStyle" displayName="Line Style" type="StrokeStyle">
                    <E>$$strokeStyle</E>
                </Property>
            </PropertyGroup>

            <PropertyGroup name="Text">
                <Property name="name" displayName="Name" type="PlainText">Hello World</Property>
                <Property name="textColor" displayName="Color" type="Color">#000000ff</Property>
                <Property name="textFont" displayName="Font" type="Font">Arial,sans-serif|normal|normal|13px</Property>
            </PropertyGroup>
        </Properties>
        <Behaviors>
            <For ref="group">
                <Transform>[scale($box.w/36, $box.h/45)]</Transform>
                <StrokeColor>$strokeColor</StrokeColor>
                <StrokeStyle>
                    new StrokeStyle($strokeStyle.w / (Math.max($box.w / 36, $box.h / 45)), $strokeStyle.array);
                </StrokeStyle>
                <Fill>Color.fromString("#00000000")</Fill>
            </For>

            <For ref="hand">
                <Fill>$fillColor</Fill>
            </For>

            <For ref="name">
                <TextContent>$name</TextContent>
                <Fill>$textColor</Fill>
                <Font>$textFont</Font>
                <BoxFit>
                    <Arg>new Bound(0, $box.h + 13, $box.w, 13)</Arg>
                    <Arg>new Alignment(1, 1)</Arg>
                </BoxFit>
            </For>
        </Behaviors>
        <p:Content xmlns="http://www.w3.org/2000/svg">
            <g id="group">
                <path id="hand" d="m 32.3,53.9 c -7.8,0 -15.3,0 -15.3,-21 0,-19 3.5,-15.3 5.1,-13.8 v -3.3 c 0.2,-2.4 6,-2.2 6,-0.3 v -3 c 0,-3.2 6.7,-2.9 6.7,-0.8 v 4.1 c 0.2,-2.3 5.4,-3.2 5.6,1.3 0,7 -0.1,14.6 -0.2,16.8 2.7,3 5.7,-11.6 10.9,-9 2.4,2.5 -6.7,19.7 -7.7,21.5 -1,1.7 -5.2,7.5 -11.1,7.5 z"
                <path d="M 22.025873,18.820772 22.948882,32.71885 M 28.060203,14.888365 29,31 M 34.808683,14.331201 35,32 m 3,5 c 0,0 -5,1 -7,11 M 20,35 c 4,-5 12,-4 17,-3" />
            </g>

            <text id="name" />
        </p:Content>
    </Shape>

The stencil will contain only the SVG content copied from the original hand
image. This hand can be scaled with a fixed ratio and a fixed stroke-width now.

Maintaining a Fixed Stroke Width
--------------------------------

Please note that without any special handling, when an SVG element is scaled
with ``Transform`` behaviour, the stroke width will be also scaled accordingly.
If we would like to have the hand scaled while the stroke width is unchanged,
the way to do it is as in the above example: recalculating the width using the
scale ratio::

    <StrokeStyle>
        new StrokeStyle($strokeStyle.w / (Math.max($box.w / 36, $box.h / 45)), $strokeStyle.array);
    </StrokeStyle>

Grouping SVG elements
---------------------

Many of the SVG attributes are inherited by children nodes from their parent
node. In this example, the two <path> elements are grouped in a <g> parent node
so that common behaviours can be applied to just this parent node. By grouping,
all the Fill, StrokeStyle, StroleColor and Transform behaviours will be applied
to both the paths.

In case one or more children need to have special treatments, you can always
assign them an id and declare separate behaviours for it::

    <For ref="hand">
        <Fill>$fillColor</Fill>
    </For>
