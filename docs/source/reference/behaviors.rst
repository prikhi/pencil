Behavior Reference
==================

To help Stencil developers define how the content in shapes should be changed
to be reflect a shape's properties, Pencil provides the Behavior concept. With
behaviors, attributes or content of the target object can be changed based on
the Behavior's input values. The target object can be an SVG object or an HTML
object in the <Content> section of the shape.

This document lists all supported behaviors in Pencil, each with XML syntax
and examples.

Behaviors applied to an object within the shape are defined as below:::

    <For ref="target_object_id">
        <Behavior_1>....</Behavior_1>
        <Behavior_2>....</Behavior_2>
        .......
        <Behavior_n>....</Behavior_n>
    </For>

For the ease of understanding the examples used in this document, let's assume
that we have a box property of type ``Dimension`` defined for the shape::

    <Property name="box" type="Dimension">150,150</Property>

CustomStyle
-----------

This behavior is used to assign a value to a specific CSS attribute of the
target object. Value and name are specified in the input arguments of the
behavior.

Target object
^^^^^^^^^^^^^

Any object.

XML Syntax
^^^^^^^^^^

.. code-block:: xml

    <CustomStyle>
        <Arg>propertyName</Arg>
        <Arg>value</Arg>
    </CustomStyle>

Input value
^^^^^^^^^^^

* **propertyName**: name of CSS property.
* **value**: value to assign to propertyName.

Result
^^^^^^

The the CSS property "propertyName" of the target object is assigned the
provided value.

Example
^^^^^^^

.. code-block:: xml

    <CustomStyle>
        <Arg>"width"</Arg>
        <Arg>$box.w + "px"</Arg>
    </CustomStyle>


.. _Attr:

Attr
----

This behavior is used to assign a value to a specific XML attribute of the
target object. Value and name (and optional namespace URI) are specified in the
input arguments of the behavior.

Target object
^^^^^^^^^^^^^

Any object.

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
* **value**: value to assign to propertyName.
* **namespace**: namespace URI that this attribute is in. If the attribute has
  no namespace, the namespace argument can be omitted.

Result
^^^^^^

The "attributeName" attribute of the target object is assigned the provided
value.

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

If the namespace was defined in a parent node, the namespace argument could be
omitted.

.. code-block:: xml

    <Attr>
      <Arg>"xlink:href"</Arg>
      <Arg>value</Arg>
    </Attr>


.. _Box:

Box
---

This behavior is used to assign values to the width and height attributes of
the target object.

Target object
^^^^^^^^^^^^^

Any object that supports width and height attributes.

XML syntax
^^^^^^^^^^

.. code-block:: xml

    <Box>dimensionValue</Box>

Input value
^^^^^^^^^^^

* **dimensionValue**: an expression that returns a value of type Dimension.

Result
^^^^^^

The width and height attributes of the target object are set to the values
represented by the dimensionValue object.

Example
^^^^^^^

.. code-block:: xml

    <Box>$box</Box>

Or directly

.. code-block:: xml

      <Box>new Dimension(50,50)</Box>

Bound
-----

This behavior is used to assign values to the width and height attributes and
set the position of the target object.

Target object
^^^^^^^^^^^^^

Any object that supports width and height attributes.

XML syntax
^^^^^^^^^^

.. code-block:: xml

      <Bound>bound</Bound>

Input value
^^^^^^^^^^^

* **bound**: an object of type Bound

Example
^^^^^^^

.. figure:: /images/behaviors_bound_new.png

.. code-block:: xml

    <Bound>new Bound(x, y, width, height)</Bound>


.. figure:: /images/behaviors_bound_frombox.png

.. code-block:: xml

    <Bound>Bound.fromBox(Box, paddingX, paddingY)</Bound>

.. figure:: /images/behaviors_bound_frombox_dimension.png

.. code-block:: xml

      <Bound>Bound.fromBox(new Dimension(width, height), paddingX, paddingY)</Bound>


.. _Radius:

Radius
------

This behavior sets the "rx" and "ry" attributes of the target SVG objects that
support corner radius (including Rectangle and Ellipse).

Target object
^^^^^^^^^^^^^

A rectangle or ellipse SVG element.

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

The target object's (Rectangle, Ellipse) "rx" and "ry" attributes are set to
the given values.

Example
^^^^^^^

.. code-block:: xml

    <Radius>
        <Arg>5</Arg>
        <Arg>5</Arg>
    </Radius>


.. _Fill:

Fill
----

This behavior sets the "fill" and "fill-opacity" attributes of the target SVG
objects that can be filled with color.

Target object
^^^^^^^^^^^^^

Any SVG object that can be filled with color.

XML syntax
^^^^^^^^^^

.. code-block:: xml

    <Fill>color</Fill>

Input value
^^^^^^^^^^^

* **color**: The color to fill the target with - an object of type Color.

Result
^^^^^^

The target object's color and opacity are set.

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

This behavior sets the "color" and "opacity" attributes of the target HTML
object.

Target object
^^^^^^^^^^^^^

Any HTML object.

XML syntax
^^^^^^^^^^

.. code-block:: xml

    <Color>color</Color>

Input value
^^^^^^^^^^^

* **color**: The desired text color for the target - an object of type Color.

Result
^^^^^^

The target object's color and opacity CSS properties are set.

Example
^^^^^^^

.. code-block:: xml

    <Color>Color.fromString("#ffffffff")</Color>

**Or:**

.. code-block:: xml

      <Property name="color" displayName="fColor" type="Color">#000000ff</Property>
      ....
      <Color>$color</Color>


.. _StrokeColor:

StrokeColor
-----------

This behavior sets the "stroke" and "stroke-opacity" attributes of the SVG
target objects that have stroke.

Target object
^^^^^^^^^^^^^

Any Object that can be given a stroke.

XML syntax
^^^^^^^^^^

.. code-block:: xml

    <StrokeColor>color</StrokeColor>

Input value
^^^^^^^^^^^

* **color**: Color of the stroke - an object of type Color.

Result
^^^^^^

The target object's stroke color and stroke opacity are set.

Example
^^^^^^^

.. code-block:: xml

    <StrokeColor>Color.fromString("#ffffffff")</StrokeColor>

**Or:**

.. code-block:: xml

      <Property name="color" displayName="fColor" type="Color">#000000ff</Property>
      ...
      <StrokeColor>$color</StrokeColor>


.. _StrokeStyle:

StrokeStyle
-----------

This behavior is used to set the "stroke-width" and "stroke-dasharray"
attributes of the target object.

Target object
^^^^^^^^^^^^^

Any Object that has a stroke.

XML syntax
^^^^^^^^^^

.. code-block:: xml

    <StrokeStyle>strokeStyle</StrokeStyle>

Input value
^^^^^^^^^^^

* **strokeStyle**: an object of type StrokeStyle.

Result
^^^^^^

The stroke of the target object is assigned the given value.

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


.. _Visibility:

Visibility
----------

This behavior is used to assign value to the "visibility" and "display"
attributes of the target object.

Target object
^^^^^^^^^^^^^

Any object.

XML Syntax
^^^^^^^^^^

.. code-block:: xml

    <Visibility>value</Visibility>

Input value
^^^^^^^^^^^

* **value**: Whether the object should be visible/displayed. Either Pencil's
  Bool data object or a JavaScript boolean value.

Result
^^^^^^

"visibility" and "display" attributes of the target object are changed
according to the input value.

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

This behavior is used to set text bounds and alignment.

Target object
^^^^^^^^^^^^^

An SVG text object.

XML syntax
^^^^^^^^^^

.. code-block:: xml

    <BoxFit>
        <Arg>bound</Arg>
        <Arg>alignment</Arg>
    </BoxFit>

Input value
^^^^^^^^^^^

* **bound**: an object of type Bound.
* **alignment**: an object of type Alignment.

Result
^^^^^^

The text content of the element is changed to fit the provided bound and given
the provided alignment.

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

This behavior is used to set the target object's text font. With this
behavior, a set of font-related attributes are changed.

Target object
^^^^^^^^^^^^^

An SVG Text object or any HTML object.

XML Syntax
^^^^^^^^^^

.. code-block:: xml

    <Font>font</Font>

Input value
^^^^^^^^^^^

* **font**: an object of type Font.

Result
^^^^^^

"font-family", "font-size", "font-weight", "font-style" and "text-decoration"
attributes of the object are assigned values derived from the given Font
object.

Note that the "text-decoration" attribute is only supported for HTML objects.
It is impossible to set "text-decoration" on SVG Text objects.

Example
^^^^^^^

.. code-block:: xml

    <Font>Font.fromString("Helvetica|normal|normal|14px")</Font>
    <Property name="font" type="Font" displayName="Default Font">Helvetica|normal|normal|14px</Property>
    ...
    <Font>$font</Font>


.. _Behavior D:

D
--

This behavior is used to set the "d" attribute of an SVG path object. The
provided array of drawing functions is converted to SVG drawing operations.

Target object
^^^^^^^^^^^^^

A path object.

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

Each function in the input array is converted to its corresponding SVG drawing
operation. Pencil-specific instructions are also converted to standard SVG
drawing operations but using a special algorithm to make the lines sketchy. The
resulting value is assigned to the "d" attribute of the path object.

Example
^^^^^^^

.. code-block:: xml

      <D>[M(0, 0), L($box.w, 0), L($box.w, $box.h), L(0, $box.h), z]</D>


.. _Transform:

Transform
---------

This behavior is used to control the "transform" attribute of SVG target
objects. The provided array of transformation functions is converted to SVG
transformation functions.

Target object
^^^^^^^^^^^^^

Any SVG object.

XML Syntax
^^^^^^^^^^

.. code-block:: xml

    <Transform>[...]</Transform>

Input value
^^^^^^^^^^^

**[...]**: an array of instruction functions. The functions are similar to the
SVG transformation functions:

    * rotate(x)
    * translate(x, y)
    * scale(x, y)
    * skewX(a)
    * skewY(a)

Result
^^^^^^

The "transform" attribute of the SVG target object is assigned a value based on
the input functions.

Example
^^^^^^^

.. code-block:: xml

      <Transform>[scale($box.w.120, $box.h/100), transform(50, 70)]</Transform>

Scale
-----

This behavior is used to assigned to the "scale" function in the "transform"
attribute of an SVG object. This behavior is equivalent to the Transform
behavior with just one scale().

Target object
^^^^^^^^^^^^^

Any SVG object.

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

The SVG object will be given a ``transform`` attribute containing a scale
function with the given ratios. Note that using this behavior will empty the
current value of the transform attribute.

Example
^^^^^^^

.. code-block:: xml

    <Scale>
        <Arg>$box.w/120</Arg>
        <Arg>$box.h/100</Arg>
    </Scale>


.. _TextContent:

TextContent
-----------

This behavior is used to control the content of the target text object.

Note: this behavior does not support text wrapping for PlainText content in
SVG elements. To have the PlainText content wrapped inside an SVG text element
with a specific aligmnent, please use the PlainTextContent behavior.

Target object
^^^^^^^^^^^^^

An SVG text object or any HTML object.

XML Syntax
^^^^^^^^^^

.. code-block:: xml

    <TextContent>text</TextContent>

Input value
^^^^^^^^^^^

* **text**: a PlainText or RichText value.

Result
^^^^^^

The target object's text content is changed.

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

This behavior is used to control the wrapped text inside an SVG text element.
This is the recommended way to implement wrapped plain-text content instead of
using HTML wrapping. This behavior produces compliant SVG output and the
resultant drawing can be used in other SVG editors like Inkscape.

Target object
^^^^^^^^^^^^^

An SVG text element.

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
* **bound**: an object of type Bound.
* **alignment**: an object of type Alignment.

Result
^^^^^^

Content of the target object will be filled with <tspan> elements to create
wrapped text content. The transform attribute of this element may be used in
for controlling the bounding.

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


.. _DomContent:

DomContent
----------

This behavior populates the target object with a child DOM node.

Target object
^^^^^^^^^^^^^

Any object.

XML Syntax
^^^^^^^^^^

.. code-block:: xml

    <DomContent>domContent</DomContent>

Input value
^^^^^^^^^^^

* **domContent**: a DOM element or a DOM fragment to add as a child of the
  target object.

Please refer the associated tutorial on Dynamic DOM Content for more
information.

Image
-----

This behavior is used to control the xlink:href, width and height attributes
of an SVG <image> element.

XML Syntax
^^^^^^^^^^

.. code-block:: xml

    <Image>imageData</Image>

Input value
^^^^^^^^^^^

* **imageData**: an object of type ImageData

Result
^^^^^^

xlink:href, width and height attributes of the target <image> element are
changed to be in sync with the provided imageData input value.

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

This behavior is used control an ellipse element so that it fits into the
provided bound.

Target object
^^^^^^^^^^^^^

An SVG ellipse object.

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

.. figure:: /images/behaviors_ellipsefit.png

.. code-block:: xml

    <EllipseFit>$box</EllipseFit>


Width
-----

This behavior is used to assign the "width" attribute of the target object.

Target object
^^^^^^^^^^^^^

Any SVG object that supports the "width" attribute.

XML Syntax
^^^^^^^^^^

    <Width>width</Width>

Input value
^^^^^^^^^^^

* **width**: a number.

Result
^^^^^^

The "width" attribute of the target object is assigned the given value.

Example
^^^^^^^

.. code-block:: xml

    <Width>$box.w</Width>

Height
------

This behavior is used to assign the "height" attribute of the target object.

Target object
^^^^^^^^^^^^^

Any SVG object that supports the "height" attribute.

XML Syntax
^^^^^^^^^^

.. code-block:: xml

    <Height>height</Height>

Input value
^^^^^^^^^^^

* **height**: a number.

Result
^^^^^^

The "height" attribute of the target object is assigned the given value.

Example
^^^^^^^

.. code-block:: xml

    <Height>$box.h</Height>


.. _NPatchDomContent:

NPatchDomContent
----------------

This behavior is used to fill the target ``<g>`` SVG element with ``<image>``
elements provided in the Nine-Patch with correct scaling for the provided
dimensions.

Target object
^^^^^^^^^^^^^

An SVG ``<g>`` element.

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

The Nine-Patch data structure is used together with the dimension object to
calculate scaling for patches. ``<image>`` elements for the patches are
generated and added as children of the target <g> element.

Example
^^^^^^^

For more information on how to use this behavior, please refer the associated
tutorial on Using Nine-Patch.

InnerText
---------

This behavior is used to fill the content of the target object with a DOM text
node.

Target object
^^^^^^^^^^^^^

Any object.

XML Syntax
^^^^^^^^^^

.. code-block:: xml

    <InnerText>value</InnerText>

Input value
^^^^^^^^^^^

* **value**: a string.

Result
^^^^^^

A new DOM text node is generated with the provided value and added as a child
of the target object.

Example
^^^^^^^

.. code-block:: xml

      <InnerText>"put content here..."</InnerText>
