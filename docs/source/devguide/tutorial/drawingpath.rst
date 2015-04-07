Drawing Path - The D Behaviour
==============================

Pencil shapes are usually created using paths that are based on the SVG path specification. Pencil supports drawing shapes using the ``D`` behaviour. This behaviour generates the "d" attribute for the ``<path>`` SVG element as defined in the SVG Path data specification . The value used in ``D`` is an array in which each item is a drawing command.

The shape in this tutorial is a triangle drawn from 3 points that are defined by properties of type Handle .

.. code-block:: xml

    <Shape id="triangle" displayName="Triangle" icon="Icons/triangle.png">
        <Properties>
            <PropertyGroup>
                <Property name="a" displayName="Point" type="Handle">0,0</Property>
                <Property name="b" displayName="Point" type="Handle">90,0</Property>
                <Property name="c" displayName="Point" type="Handle">45,60</Property>
            </PropertyGroup>
            <PropertyGroup name="Border">
                <Property name="strokeColor" displayName="Line Color" type="Color">#1B3280ff</Property>
                <Property name="strokeStyle" displayName="Line Style" type="StrokeStyle">2|</Property>
            </PropertyGroup>
        </Properties>
        <Behaviors>
            <For ref="path">
                <StrokeColor>$strokeColor</StrokeColor>
                <StrokeStyle>$strokeStyle</StrokeStyle>
                <D>[M($a.x, $a.y), L($b.x, $b.y), L($c.x, $c.y), z]</D>
            </For>
        </Behaviors>
        <p:Content xmlns:p="http://www.evolus.vn/Namespace/Pencil" xmlns="http://www.w3.org/2000/svg">
            <path id="path" fill="none" style="stroke-linejoin: round;" />
        </p:Content>
    </Shape>


In the above example, Handle properties provide points that can be moved on the drawing canvas. Their values are changed upon the move and the behaviour code will be executed to re-generate the path's "D" value.

You can notice that various commands are used in this example. Pencil supports the following SVG Path commands: M, L, l, C, c, S, s, Q, q, T, A and a.

In many other situations, paths may not rely solely on the position of handles. For example, a triangle can also be drawn based on a bounding box, as shown in the following example:

.. code-block:: xml

    <Shape id="triangle" displayName="Triangle" icon="Icons/triangle .png">
        <Properties>
            <PropertyGroup>
                <Property name="box" type="Dimension">200,80</Property>
                    <Property name="strokeColor" displayName="Line Color" type="Color">#1B3280ff</Property>
                    <Property name="strokeStyle" displayName="Line Style" type="StrokeStyle">2|</Property>
            </PropertyGroup>
        </Properties>
        <Behaviors>
            <For ref="path">
                <StrokeColor>$strokeColor</StrokeColor>
                <StrokeStyle>$strokeStyle</StrokeStyle>
                <D>[M(0, 0), L($box.w, 0), L($box.w/2, $box.h), z]</D>
            </For>
        </Behaviors>
        <p:Content xmlns:p="http://www.evolus.vn/Namespace/Pencil" xmlns="http://www.w3.org/2000/svg">
            <path id="path" fill="none" style="stroke-linejoin: round;" />
        </p:Content>
    </Shape>

It is very convenient to create shapes with specific points based on handles or the bounding box. The "D" behaviour is used heavily in the built-in Flowchart stencil collection .

Add Transparent Background
--------------------------

The two examples above generate unfilled triangles so it is very difficult for users to drag and move the objects on the drawing canvas. The suggested way to avoid this is to create a transparent path as the background below the triangle with a thicker stroke.

.. code-block:: xml

    <Shape>
        ....
        <Behaviors>
            <For ref="bgpath">
                <D>[M($a.x, $a.y), L($b.x, $b.y), L($c.x, $c.y), z]</D>
            </For>
            <For ref="path">
                ...
            </For>
        </Behaviors>
        <p:Content>
            <path id="bgpath" fill="none" style="stroke: rgba(0, 0, 0, 0); stroke-width: 10px;"/>
            <path id="path" fill="none" style="stroke-linejoin: round;" />
        </p:Content>
    </Shape>
