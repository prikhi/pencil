Pencil Data Types
=================

Pencil supports various data types for shape properties. Some of them are equivalent to data types in popular programming languages while the others are for convenience.

This document lists all supported data types in Pencil, with both JavaScript syntax and XML syntax for use in stencil coding. Most of the supported data types have at least one way end-users can modify the value from the GUI.


Alignment
---------

Data structure for storing two-dimension alignment.

.. class:: Alignment(h, v)

    :param number h: horizotal alignment. 0: left, 1: center, 2: right
    :param number v: vertical alignment. 0: top, 1: middle, 2: bottom

    .. function:: static Alignment.fromString(s)

        :param string s: string representation
        :returns: Alignment built from string representation

    .. function:: Alignment.toString()

        :returns: String representation of the Alignment

XML syntax
^^^^^^^^^^

.. code-block:: xml

    <Property name="test" displayName="Test" type="Alignment">h,v</Property>


Editor support
^^^^^^^^^^^^^^

Property page:

Properties of type Alignment can be edited in the shape property page.

.. image:: /images/alignment-prop-editor.png

Bool
----

Data type for storing boolean values.

.. class:: Bool(value)

    :param value: true or false

    .. function:: Bool.fromString(s)

        :param s: String representation
        :returns: Bool built from String representation

    .. function:: Bool.toString()

        :returns: String representation of this Bool

    .. function:: Bool.negative()

        :returns: negated Bool object

XML syntax
^^^^^^^^^^

.. code-block:: xml

    <Property name="sample" displayName="Sample" type="Bool">value</Property>


Editor support
^^^^^^^^^^^^^^

Context menu:

Properties of type Bool can be edited in the context menu of the shape using a checkbox item.

.. image:: /images/bool-menu-editor.png

Dimension
---------

Data structure for storing object size, a pair of width and height values

.. class:: Dimension(width, height)

    :param number width:
    :param number height:

    .. function:: Dimension.fromString(s)

        :param string s:
        :returns: Build a Dimension object from its string presentation.

    .. function:: Dimension.toString()

        :returns: String representation of the object

    .. function:: Dimension.narrowed(paddingX[, paddingY])

        :param number paddingX:
        :param number paddingY:
        :returns: Return a new Dimension object with is created by narrowing the callee by the provided paddings. If paddingY is omitted, paddingX will be used for both directions.

XML syntax
^^^^^^^^^^

.. code-block:: xml

    <Property name="box" displayName="Box" type="Dimension"
          p:lockRatio="true">width,height</Property>

.. note::

    **p:lockRatio**
        Meta constraint used in XML syntax to hint that the ratio of this object should be maintained when its width and height are changed.

Editor support
^^^^^^^^^^^^^^

On-canvas editor:

A Dimension property with the special name of box can be edited using the on-canvas geometry editor.

.. image:: /images/box-onscreen-editor.png

Toolbar editor:

And also via the geometry toolbar located on the top of the Pencil application window.

.. image:: /images/box-toolbar-editor.png

Bound
-----

Data structure for storing a bounding box which is a composite of a location and a size.

.. class:: Bound(left, top, width, height)

    :param number left:
    :param number top:
    :param number width:
    :param number height:


    .. function:: static Bound.fromBox(box, paddingX, paddingY)

        :param box:
        :param number paddingX:
        :param number paddingY:
        :returns:  a new Bound object from a Dimension object narrowed down on each sides using the provided paddings

        .. code-block:: js

            var b = Bound.fromBox(box, x, y);
            //equals to:
            var b = new Bound(x, y, box.w - 2 * x, box.h - 2 * y)


    .. function:: static Bound.fromString(s)

        :param String s:
        :reutrns: Build a Bound object from its string presentation


    .. function:: Bound.toString()

        :returns: string presentation

    .. function:: Bound.narrowed(paddingX, paddingY)

        :param number paddingX:
        :param number paddingY:
        :retruns: a new Bound object by using the callee and narrowing down each sides by the provided paddings

Color
-----

Data structure for storing object color with alpha blending

.. class:: Color()

    Default opaque black colour

    .. function:: static Color.fromString(String)

        :param String s: colour representation
        :returns: a colour object from string presentation in CSS numerical color syntax.

        .. code-block:: js

            Color.fromString("#ffffffff"); // solid white
            Color.fromString("#ffffff"); // also solid white
            Color.fromString("rgb(255, 0, 0)"); // solid red

            // semi-transparent blue:
            Color.fromString("rgba(0, 0, 255, 0.5)");

            Color.fromString("transparent"); //transparent

            //semi-transparent black:
            Color.fromString("#00000033");

    .. function:: Color.toString()

        :returns: the extended hexa string presentation of the color: #RRGGBBAA

    .. function:: Color.toRGBString()

        :returns: the CSS colour in the format of "rgb(red, green, blue)"

    .. function:: Color.toRGBAString()

        :returns: the CSS colour in the format of "rgba(red, green, blue, alpha)"

    .. function:: Color.shaded(percent)

        :param number percent:
        :returns: a darker version of a colour using the provided percent.

    .. function:: Color.hollowed(percent)

        :param number percent:
        :returns: a more transparent version of a colour by the provided percent.

    .. function:: Color.inverse()

        :returns: negative version of a colour

    .. function:: Color.transparent()

        :returns: a fully transparent version of a colour

XML syntax
^^^^^^^^^^

.. code-block:: xml

    <Property name="color" displayName="My Color" type="Color">#000000ff</Property>


Editor support
^^^^^^^^^^^^^^

Property page:

Properties of type Color can be edited in the property dialog with a color chooser that supports both simple and advanced mode.

.. image:: /images/color-prop-editor.png

Color properties with the following special names can be also edited with the Color toolbar: textColor, fillColor and strokeColor.

CSS
---

Provides a data object for styling SVG elements and HTML elements.

.. class:: CSS()


    .. function:: CSS.set(name, value)

        :param string name: CSS property to set
        :param string value: Value to set the property to
        :returns: CSS object with newly added property

        CSS Sets a CSS property value, overriding existing one if any and returns the object itself.


    .. function:: CSS.toString()

        :returns: a string containing all specified properties.

    .. function:: CSS.clear()

        :returns: empty CSS object

        Removes all properties contained in a CSS object and returns the object itself.

    .. function:: CSS.unset(name)

        :param string name: Removes a specific property from a CSS object if any
        :returns: the object itself.

    .. function:: CSS.get(name)

        :returns: the properties value.


    .. function:: CSS.contains(name)

        :returns: Check whether a CSS object contains the property.

    .. function:: CSS.setIfNot(name, value)

        Sets value to a property if it was not set, returns the object itself

    .. function:: static CSS.fromString(literal)

        Parses the CSS string and creates a CSS object containing all parsed property/value pairs.

    .. function:: CSS.importRaw(literal)

        Parses the CSS string and add all parsed property/value pairs to the object overriding any existing properties.

Enum
----

Data structure to store an option with the possibility to specify available options via XML metadata.

XML syntax
^^^^^^^^^^

.. code-block:: xml

    <Property name="type" displayName="Type" type="Enum"
                      p:enumValues="['one|One', 'two|Two']">two</Property>

* **value**: Member field storing the selected value.
* **p:enumValues**: An array literal containing all possible options. Each option is in the syntax of 'id|Display Name'.

Editor support
^^^^^^^^^^^^^^

Context menu:

.. image:: /images/enum-menu-editor.png

Properties of type Enum can be edited in the context menu of the shape.

Font
----

Data structure for manipulating font info.

.. class:: Font()

    .. function:: static Font.fromString(s)

        :param String s:
        :returns: a Font object from its string presentation.

    .. function:: Font.getPixelHeight()

        :returns: the font height in pixels;

    .. function:: Font.toString()

        :returns: a string representing the font object.

    .. function:: Font.toCSSFontString()

        :returns: the string presentation of the font object in CSS syntax.

    .. function:: Font.getFamilies()

        :returns: the families field of the font.


XML syntax
^^^^^^^^^^

.. code-block:: xml

    <Property name="textFont" displayName="Text Font"
          type="Font">{families}|{weight}|{style}|{size}[|{decor}]</Property>



Editor support
^^^^^^^^^^^^^^

Property page:

.. image:: /images/font-prop-editor.png

Properties of type Font can be edited in the property dialogue.

A Font property with the special name textFont is editable with the Font style toolbar.

Handle
------

Provides a special data object representing a 2D coordinate that can be modified on the drawing canvas by user operations.

.. code-block:: xml

    <Property name="a" displayName="Start Point" type="Handle">x,y</Property>

* **x**: Distance to the left border of the shape
* **y**: Distance to the top border of the shape
* **p:lockX**: The 'x' value should not be changed, horizontal movement is disabled. Default value: false
* **p:lockY**: The 'y' value should not be changed, vertical movement is disabled. Default value: false
* **p:minX**: Minimum value of 'x'. Movement of the handle should not pass this lower limit.
* **p:maxX**: Maximum value of 'x'. Movement of the handle should not pass this upper limit.
* **p:minY**: Minimum value of 't'. Movement of the handle should not pass this lower limit.
* **p:maxY**: Maximum value of 'y'. Movement of the handle should 0not pass this upper limit.
* **p:noScale**: Disable auto-scaling of Handle value when the object 'box' property is changed. Default value: false

Editor support
^^^^^^^^^^^^^^

On-canvas editor:

.. image:: /images/handle-onscreen-editor.png

Each property of type Handle is shown as a yellow bullet when the shape is focused. The property can be edited by moving the bullet.

ImageData
---------

Data structure that stores a binary bitmap image.

.. class:: ImageData(w, h, dataUrl)

    :param number w: The image width
    :param number h: The image height
    :param string dataUrl: The data URL of the image

    .. code-block:: xml

        var image = new ImageData(10, 15, "data:image/png;base64,iVBORw0KQmCC...");

    .. function:: static ImageData.fromString(s)

            :returns: an ImageData object from its string presentation.

    .. function:: ImageData.toString()

        :returns: the string presentation of the object.

XML syntax
^^^^^^^^^^

.. code-block:: xml

    <Property name="image" displayName="Image"
          type="ImageData"><![CDATA[w,h,url]]></Property>

PlainText
---------

Data object that represents a piece of plain text.

.. class::  PlainText(S)

    :param string s: The text string

    .. function:: static PlainText.fromString(s)

        :param string s:
        :returns: Create a PlainText object from given string

    .. function:: PlainText.toString()

        :returns: PlainText object as a String

    .. function:: PlainText.toUpper()

        :returns: uppercase version of this PlainText


XML syntax
^^^^^^^^^^

.. code-block:: xml

    <Property name="text" displayName="Text"
          type="PlainText"><![CDATA[Pugnabant totidemque vos nam]]></Property>


Editor support
^^^^^^^^^^^^^^

On-canvas editor:

.. image:: /images/plaintext-onscreen-editor.png

PlainText properties can be edited right on the canvas using a simple text input.

RichText
--------

Data structure for storing rich-text content in HTML format.

.. class:: RichText(String s)

    :param String s: Rich text string

    .. function:: static RichText.fromString(String s)

        :param String s: Rich text String
        :returns: a RichText object from the provided JS string

    .. function:: RichText.toString()

        :returns: The String representation of this object

XML syntax
^^^^^^^^^^

.. code-block:: xml

    <Property name="text" displayName="Text"
          type="RichText"><![CDATA[A <b>rich</b> text string]]></Property>


Editor support
^^^^^^^^^^^^^^

On-canvas editor:

.. image:: /images/richtext-onscreen-editor.png

RichText properties can be edited right on the canvas using a rich-text input.

StrokeStyle
-----------

Data structure for storing stroke styling information.

.. class:: StrokeStyle(width, dasharray)

    :param number width:
    :param array dasharray: The dasharray value is specified as a JavaScript array containing lengths of dashes and spaces. More information can be found in the `SVG Specification for Stroke dash array`_.

    .. code-block:: js

        // construct a 'dash-space-dot-space' stroke at 1px width
        var stroke = new StrokeStyle("1,[4,2,1,2]");

    .. function:: static StrokeStyle.fromString(s)

        :param String s:
        :returns: a StrokeStyle object from its string presentation.

    .. function:: StrokeStyle.toString()

        :returns: String representation of this object

    .. function:: StrokeStyle.condensed(ratio)

        :param number ratio:
        :returns: a new version of the callee by condensing the width by the provided ratio.

XML syntax
^^^^^^^^^^

.. code-block:: xml

    <Property name="stroke" type="StrokeStyle"
          displayName="Border Style">w|dasharray</Property>

When the dasharray is omitted, the stroke is considered solid.

.. code-block:: xml

    <Property name="stroke" type="StrokeStyle"
          displayName="Border Style">1|[4,2,1,2]</Property>

Editor support
^^^^^^^^^^^^^^

Property page editor:

.. image:: /images/strokestyle-prop-editor.png

StrokeStyle properties can be edited in the property page of the shape.

ShadowStyle
-----------

Data structure that stores shadow style information.

.. class:: ShadowStyle(dx, dy, size)

    :param number dx:
    :param number dy:
    :param number size:

    .. function:: static ShadowStyle.fromString(s)

        :param String s:
        :returns: a ShadowStyle object from its string presentation

        .. code-block:: js

            var style = ShadowStyle.fromString("3|3|10");

    .. function:: ShadowStyle.toString()

        :returns: The string representation of this object

    .. function:: ShadowStyle.toCSSString()

        :returns: the string representation in CSS syntax.

XML syntax
^^^^^^^^^^

.. code-block:: xml

    <Property name="shadow" type="ShadowStyle"
          displayName="Box Shadow">dx|dy|size</Property>

Editor support
^^^^^^^^^^^^^^

Property page editor:

.. image:: /images/shadowstyle-prop-editor.png

ShadowStyle properties can be edited in the property page of the shape.

.. _SVG Specification for Stroke dash array: http://www.w3.org/TR/SVG/painting.html#StrokeDasharrayProperty
