Behaviour Reference
===================

To help Stencil developers define how the content in shapes can be changed to be reflect shape's properties, Pencil provides the Behaviour concept. With behaviours, attributes or content of the target object can be changed based on Behaviour's input values. The target object can be an SVG object or an HTML object in the <Content> section of the shape.

This document lists all supported behaviours in Pencil, each with XML syntax and examples.

Behaviours applied to an object within the shape are defined as below:::

    <For ref="target_object_id">
        <Behavior_1>....</Behavior_1>
        <Behavior_2>....</Behavior_2>
        .......
        <Behavior_n>....</Behavior_n>
    </For>

For the ease of understanding the examples used in this document, let's assume that we have a box property of type Dimension defined for the shape::

    <Property name="box" type="Dimension">150,150</Property>

CustomStyle
-----------

This behaviour is used to assign value to a specific CSS attribute of the target object. Value and name are specified in the input arguments of the behaviour.

Target object
^^^^^^^^^^^^^

All kind of objects.

XML Syntax
^^^^^^^^^^

.. code-block:: xml

    <CustomStyle>
        <Arg>propertyName</Arg>
        <Arg>value</Arg>
    </CustomStyle>

Input value
^^^^^^^^^^^

* **propertyName**: name of property.
* **value**: value is assigned to propertyName.

Result
^^^^^^

The the CSS property "propertyName" of the target object is assigned with the provided value.

Example
^^^^^^^

.. code-block:: xml

    <CustomStyle>
        <Arg>"width"</Arg>
        <Arg>$box.w + "px"</Arg>
    </CustomStyle>

Attr
----

This behaviour is used to assign value to a specific XML attribute of the target object. Value and name (and optional namespace URI) are specified in the input arguments of the behaviour.

Target object
^^^^^^^^^^^^^

All kind of objects.

XML Syntax
^^^^^^^^^^

.. code-block:: xml

    <Attr>
        <Arg>attributeName</Arg>
        <Arg>value</Arg>
        <Arg>namespace</Arg>
    </Attr>

Input value
^^^^^^^^^^^

* **attributeName**: name of attribute.
* **value**: value is assigned to propertyName.
* **namespace**: namespace URI that this attribute is in. If the attribute has no namespace, the namespace argument can be omitted.

Result
^^^^^^

The "attributeName" attribute of the target object is assigned with the provided value.

Example
^^^^^^^

.. code-block:: xml

    <Attr>
        <Arg>"width"</Arg>
        <Arg>$box.w</Arg>
    </Attr>
    <Attr>
        <Arg>"xlink:href"</Arg>
        <Arg>value</Arg>
        <Arg>PencilNamespaces.xlink</Arg>
    </Attr>

If the namespace was defined in parent node, namespace argument could also be omitted.

.. code-block:: xml

    <Attr>
      <Arg>"xlink:href"</Arg>
      <Arg>value</Arg>
    </Attr>

Box
---

This behaviour is used to assign value to width and height attributes of the target object.

Target object
^^^^^^^^^^^^^

All objects have width and height attributes.

XML syntax
^^^^^^^^^^

.. code-block:: xml

    <Box>dimensionValue</Box>

Input value
^^^^^^^^^^^

* **dimensionValue**: an expression that returns the value of type Dimension.

Result
^^^^^^

The width and height attributes of the target object is set to the dimensionValue object.

Example
^^^^^^^

.. code-block:: xml

    <Box>$box</Box>

Or directly

.. code-block:: xml

      <Box>new Dimension(50,50)</Box>

Bound
-----

This behaviour is used to assign value to width and height attributes and set position of the target object.

Target object
^^^^^^^^^^^^^

All objects have width and height properties.

XML syntax
^^^^^^^^^^

      <Bound>bound</Bound>

Input value
^^^^^^^^^^^

* **bound**: an object of type Bound

Example
^^^^^^^

.. figure:: ../images/Behaviors_html_3c35ed33.png

    <Bound>new Bound(x, y, width, height)</Bound>


.. figure:: ../images/Behaviors_html_m1f1bf638.png

    <Bound>Bound.fromBox(Box, paddingX, paddingY)</Bound>

.. figure:: ../images/Behaviors_html_m42afb0a2.png

      <Bound>Bound.fromBox(new Dimension(width, height), paddingX, paddingY)</Bound>

Radius
------

This behaviour sets the "rx" and "ry" attribute of the SVG objects that support corner radius including Rectangle and Ellipse.

Target object
^^^^^^^^^^^^^

rectangle and ellipse

XML syntax
^^^^^^^^^^

.. code-block:: xml

    <Radius>
        <Arg>rx</Arg>
        <Arg>ry</Arg>
    </Radius>

Input value
^^^^^^^^^^^

* **rx**: number - horizontal radius
* **ry**: number - vertical radius

Result
^^^^^^

The target object (Rectangle, Ellipse) is set "rx" and "ry".

Example
^^^^^^^

.. code-block:: xml

    <Radius>
        <Arg>5</Arg>
        <Arg>5</Arg>
    </Radius>

Fill
----

This behaviour sets the "fill" and "fill-opacity" attribute of the target SVG objects that can be filled with colour.

Target object
^^^^^^^^^^^^^

SVG objects that can be filled with colour.

XML syntax
^^^^^^^^^^

.. code-block:: xml

    <Fill>color</Fill>

Input value
^^^^^^^^^^^

* **color**: an object of type Colour.

Result
^^^^^^

The target object color and opacity are set.

Example
^^^^^^^

.. code-block:: xml

    <Fill>Color.fromString("#ffffffff")</Fill>

**Or**:

.. code-block:: xml

      <Property name="color" displayName="fColor" type="Color">#000000ff</Property>
      ....
      <Fill>$color</Fill>

Color
-----

This behaviour sets the "color" and "opacity" attribute of the target HTML object.

Target object
^^^^^^^^^^^^^

HTML objects.

XML syntax
^^^^^^^^^^

.. code-block:: xml

    <Color>color</Color>

Input value
^^^^^^^^^^^

* **color**: an object of type Color.

Result
^^^^^^

The target object color and opacity are set.

Example
^^^^^^^

.. code-block:: xml

    <Color>Color.fromString("#ffffffff")</Color>

**Or:**

.. code-block:: xml

      <Property name="color" displayName="fColor" type="Color">#000000ff</Property>
      ....
      <Color>$color</Color>

StrokeColor
-----------

This behaviour sets the "stroke" and "stroke-opacity" attribute of the SVG target objects that have stroke.

Target object
^^^^^^^^^^^^^

Objects that can be stroked.

XML syntax
^^^^^^^^^^

.. code-block:: xml

    <StrokeColor>color</StrokeColor>

Input value
^^^^^^^^^^^

* **color**: an object of type Color.

Result
^^^^^^

The target object stroke color and stroke opacity are set.

Example
^^^^^^^

.. code-block:: xml

    <StrokeColor>Color.fromString("#ffffffff")</StrokeColor>

**Or:**

.. code-block:: xml

      <Property name="color" displayName="fColor" type="Color">#000000ff</Property>
      ...
      <StrokeColor>$color</StrokeColor>

StrokeStyle
-----------

This behaviour is used to set "stroke-width" and "stroke-dasharray" attribute of the target object

Target object
^^^^^^^^^^^^^

Objects that have stroke.

XML syntax
^^^^^^^^^^

.. code-block:: xml

    <StrokeStyle>strokeStyle</StrokeStyle>

Input value
^^^^^^^^^^^

* **strokeStyle**: an object of type StrokeStyle.

Result
^^^^^^

The stroke of the target object is assigned value

Example
^^^^^^^

.. code-block:: xml

    <StrokeStyle>StrokeStyle.fromString("1|[1,3]")</StrokeStyle>

**Or:**

.. code-block:: xml

    <Property name="strokeStyle"
              type="StrokeStyle"
              displayName="Border Style">1|[2,1,2,4]</Property>
    ...
    <StrokeStyle>$strokeStyle</StrokeStyle>

Visibility
----------

This behaviour is used to assign value to "visibility" and "display" attribute of the target object

Target object
^^^^^^^^^^^^^

All kind of objects.

XML Syntax
^^^^^^^^^^

.. code-block:: xml

    <Visibility>value</Visibility>

Input value
^^^^^^^^^^^

* **value**: either Pencil's Bool data object or a JavaScript boolean value.

Result
^^^^^^

"visibility" and "display" attribute of target object is changed according to input value.

Example
^^^^^^^

.. code-block:: xml

    <Visibility>Bool.fromString("true")</Visibility>

**Or:**

.. code-block:: xml

      <Property name="value" displayName="Value" type="Bool">true</Property>
      ...
      <Visibility>$value</Visibility>

BoxFit
------

This behaviour is used to set text bound and alignment.

Target object
^^^^^^^^^^^^^

Only text object.

XML syntax
^^^^^^^^^^

.. code-block:: xml

    <BoxFit>
        <Arg>bound</Arg>
        <Arg>alignment</Arg>
    </BoxFit>

Input value
^^^^^^^^^^^

* **bound**: an object of type Bound
* **alignment**: an object of type Alignment.

Result
^^^^^^

Text content of the elment are changed to fit the provided bound and in the provided alignment.

Example
^^^^^^^

.. code-block:: xml

    <BoxFit>
        <Arg>Bound.fromBox($box)</Arg>
        <Arg>new Alignment(1,1)</Arg>
    </BoxFit>
    <Property name="textAlign"
              displayName="Text Alignment" type="Alignment">1,1</Property>
    ...
    <BoxFit>
        <Arg>Bound.fromBox($box)</Arg>
        <Arg>$textAlign</Arg>
    </BoxFit>

Font
----

This behaviour is used to set the target object text font. With this behaviour, a set of font-related attributes are changed.

Target object
^^^^^^^^^^^^^

SVG Text object and HTML objects.

XML Syntax
^^^^^^^^^^

.. code-block:: xml

    <Font>font</Font>

Input value
^^^^^^^^^^^

* **font**: an object of type Font.

Result
^^^^^^

"font-family", "font-size", "font-weight", "font-style" and "text-decoration" attribute of text object are assigned value.

Note that "text-decoration" attribute is only supported for HTML objects. So it is impossible to set "text-decoration" to SVG Text object.

Example
^^^^^^^

.. code-block:: xml

    <Font>Font.fromString("Helvetica|normal|normal|14px")</Font>
    <Property name="font" type="Font" displayName="Default Font">Helvetica|normal|normal|14px</Property>
    ...
    <Font>$font</Font>

D
-

This behaviour is used to set "d" attribute of an SVG path object. The values are put into D behaviour will be listed in the input value.

Target object
^^^^^^^^^^^^^

Only path object.

XML Syntax
^^^^^^^^^^

.. code-block:: xml

    <D>[...]</D>

Input value
^^^^^^^^^^^

* **[...]**: an array of drawing instruction functions. Pencil supports drawing functions that are equivalent to popular SVG path data instructions:
* **M(x,y)**: set point.
* **L(x,y)**: draw a line from a point to x,y.

      Example: <D>[M(0, 0), L(10,10)]</D>

* **C(x1, y1, x2, y2, x, y)**: the same as C in SVG.
* **c(x1, y1, x2, y2, x, y)**: the same as c in SVG.
* **S(x2, y2, x, y)**: the same as S in SVG.
* **s(x2, y2, x, y)**: the same as s in SVG.
* **Q(x1, y1, x, y)**: the same as Q in SVG.
* **q(x1, y1, x, y)**: the same as q in SVG.
* **z**: the same as z in SVG.

    And two Pencil-specific instructions for drawing sketchy lines:

* **sk(x1, y1, x2, y2)**: move to x1, y1 and draw a sketchy line to x2, y2
* **skTo(x, y)**: draw a sketchy line from the current position to x, y

Result
^^^^^^

"d" attribute of the path object is assigned value each function is converted to correstpodent SVG drawing operation. Pencil-specificc instructions are converted to also standard SVG drawing operations but in a special algorithm to make the line sketchy.

Example
^^^^^^^

.. code-block:: xml

      <D>[M(0, 0), L($box.w, 0), L($box.w, $box.h), L(0, $box.h), z]</D>

Transform
---------

This behaviour is used to control the "transform" attribute of SVG target objects. The provided array of transformation functions is converted to SVG transformation functions.

Target object
^^^^^^^^^^^^^

All SVG objects.

XML Syntax
^^^^^^^^^^

.. code-block:: xml

    <Transform>[...]</Transform>

Input value
^^^^^^^^^^^

**[...]**: an array of instruction functions. The functions are similar to the SVG transformation functions:

    * rotate(x)
    * translate(x, y)
    * scale(x, y)
    * skewX(a)
    * skewY(a)

Result
^^^^^^

"transform" attribute of the SVG target object is assigned value.

Example
^^^^^^^

.. code-block:: xml

      <Transform>[scale($box.w.120, $box.h/100), transform(50, 70)]</Transform>

Scale
-----

This behaviour is used to assigned to "scale" function of "transform" attribute of SVG object. This behaviour is equivalent to a Transform with just one scale()

Target object
^^^^^^^^^^^^^

All SVG objects.

XML Syntax
^^^^^^^^^^

.. code-block:: xml

      <Scale>width_ratio, height_ratio</Scale>

Input value
^^^^^^^^^^^

* **width_ratio**: number - the horizontal scale ratio
* **height_ratio**: number - the vertical scale ratio

Result
^^^^^^

The SVG object width and height will be changed based on the ratio. Note that using this behaviour will empty the current value of the transform attribute.

Example
^^^^^^^

.. code-block:: xml

    <Scale>
        <Arg>$box.w/120</Arg>
        <Arg>$box.h/100</Arg>
    </Scale>

TextContent
-----------

This behaviour is used to control the content of the target text object.

Note: this behaviour does not support text wrapping for PlainText content in SVG elements. To have the PlainText content wrapped in side an SVG text element in a specific aligmnent, please use the PlainTextContent behaviour.

Target object
^^^^^^^^^^^^^

SVG text object and HTML objects.

XML Syntax
^^^^^^^^^^

.. code-block:: xml

    <TextContent>text</TextContent>

Input value
^^^^^^^^^^^

* **text**: a PlainText or RichText value.

Result
^^^^^^

The target object text content is changed.

Example
^^^^^^^

.. code-block:: xml

    <TextContent>new PlainText("text here...")</TextContent>
    <Property name="content"
              displayName="HTML Content" type="RichText">text here...</Property>
    ....
    <TextContent>$label</TextContent>

PlainTextContent
----------------

This behaviour is used to control the wrapped text inside an SVG text element. This is the recommended way to implement wrapped plain-text content instead of using HTML wrapping. This behaviour produces compliant SVG output and the resulted drawing can be used in other SVG editors like Inkscape.

Target object
^^^^^^^^^^^^^

SVG text elements.

XML Syntax
^^^^^^^^^^

.. code-block:: xml

    <!--[CDATA[
    <PlainTextContent-->
        <arg>plainTextValue</arg>
        <arg>bound</arg>
        <arg>alignment</arg>


Input value
^^^^^^^^^^^

* **text**: an object of type PlainText.
* **bound**: an object of type Bound
* **alignment**: an object of type Alignment

Result
^^^^^^

Content of the text target object will be filled with <tspan> elements to create wrapped text content. transform attribute of this element may be used in for controlling the bounding.

Example
^^^^^^^

.. code-block:: xml

    <Property name="content"
        displayName="Text Content"
        type="PlainText">text here...
    ...
    <plaintextcontent>
        <arg>$content</arg>
        <arg>Bound.fromBox($box, 10)</arg>
        <arg>new Alignment(1, 1)</arg>
    </plaintextcontent>

DomContent
----------

This behaviour populate child DOM nodes into the target object.

Target object
^^^^^^^^^^^^^

All objects

XML Syntax
^^^^^^^^^^

.. code-block:: xml

    <DomContent>domContent</DomContent>

Input value
^^^^^^^^^^^

* **domContent**: a DOM element of a DOM fragment.

Please refer the associated tutorial on Dynamic DOM Content for more information.

Image
-----

This behaviour is used to control the xlink:href, width and height attribute of an SVG <image> element.

XML Syntax
^^^^^^^^^^

.. code-block:: xml

    <Image>imageData</Image>

Input value
^^^^^^^^^^^

* **imageData**: an object of type ImageData

Result
^^^^^^

xlink:href, width and height attributes of the target <image> element are changed to be in sync with the provided imageData input value.

Example
^^^^^^^

.. code-block:: xml

    <Property name="icon"
        displayName="Icon"
        type="ImageData"><![CDATA[10,15,data:image/png;base64,iVBOR...]]></Property>

    ...

    <Image>$icon</Image>

EllipseFit
----------

This behaviour is used control an ellipse element so that it fits into the provided bound.

Target object
^^^^^^^^^^^^^

SVG ellipse elements.

XML Syntax
^^^^^^^^^^

.. code-block:: xml

    <EllipseFit>box</EllipseFit>

Input value
^^^^^^^^^^^

* **box**: an object of type Dimension.

Result
^^^^^^

The "cx", "cy", "rx", "ry" attribute values are changed.

Example
^^^^^^^

.. code-block:: xml

    <EllipseFit>$box</EllipseFit>


Width
-----

This behaviour is used to assign "width" attribute of the target object.

Target object
^^^^^^^^^^^^^

All SVG objects that have "width" attribute

XML Syntax
^^^^^^^^^^

    <Width>width</Width>

Input value
^^^^^^^^^^^

* **width**: a number

Result
^^^^^^

"width" attribute of the target object is assigned value.

Example
^^^^^^^

.. code-block:: xml

    <Width>$box.w</Width>

Height
------

This behaviour is used to assign "height" attribute of the target object.

Target object
^^^^^^^^^^^^^

All SVG objects that have "height" attribute

XML Syntax
^^^^^^^^^^

.. code-block:: xml

    <Height>height</Height>

Input value
^^^^^^^^^^^

* **height**: a number

Result
^^^^^^

The "height" attribute of the target object is assigned value.

Example
^^^^^^^

.. code-block:: xml

    <Height>$box.h</Height>

NPatchDomContent
----------------

This behaviour is used to fill the target <g> SVG element with <image> elements provided in the Nine-Patch with correct scaling to the provided dimension.

Target object
^^^^^^^^^^^^^

SVG <g> elements.

XML Syntax
^^^^^^^^^^

.. code-block:: xml

    <NPatchDomContent>
        <arg>ninePatch</arg>
        <arg>dimension</arg>
    </NPatchDomContent>

Input value
^^^^^^^^^^^

* **ninePatch**: a Nine-Patch data structure.
* **dimension**: an object of type Dimension.

Result
^^^^^^

The Nine-Patch data structure is used together with the dimension to calculate scaling for patches and <image> elements are generated and filled into the target <g> element.

Example
^^^^^^^

For more information on how to use this behaviour, please refer the associated tutorial on Using Nine-Patch.

InnerText
---------

This behaviour is used to fill the content of the target object with a DOM text node.

Target object
^^^^^^^^^^^^^

All objects

XML Syntax
^^^^^^^^^^

.. code-block:: xml

    <InnerText>value</InnerText>

Input value
^^^^^^^^^^^

* **value**: a string.

Result
^^^^^^

A new DOM text node is generated with provided value and filled into the target object.

Example
^^^^^^^

.. code-block:: xml

      <InnerText>"put content here..."</InnerText>
