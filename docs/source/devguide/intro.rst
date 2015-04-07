Introduction to Pencil Stencil
==============================

Overview
--------

Pencil controls shapes in its document by mean of stencils. Each stencil
(Rectangle, for example) is indeed a template to generate shapes. Each template
defines:

* **The look:** what the generated shape looks like, defined by means of SVG
  elements.

    *For example:* the Rectangle stencil defines a shape formed by a single SVG
    <rect> element.


* **The properties:** which properties the shape has plus optional extra
  constraints on them.

    *For example:* the Rectangle stencil has a 'box' property of type
    Dimension, a 'strokeStyle' property of type StrokeStyle and a 'fillColor'
    property of type Colour.


* **The behaviours:** how the shape's look is changed according to changes made
  to its properties.

    *For example:* the Rectangle <rect> element has its fill and fill-opacity
    change to the 'fillColor' property of the shape.


* **The actions:** which actions that external objects and users can ask the
  shape to do.

    *For example:* the Rectangle stencil defines a 'Remove border' action to
    allow users to set the 'strokeStyle' width property to 0px and hence makes
    the <rect> element's border disappeared.

Stencils are organized in collections. Each collection contains a set of
related stencils and can be installed into or uninstalled from Pencil using the
collection manager.

The Process of Creating Shapes from Stencils
--------------------------------------------

After being installed into Pencil, a stencil can be used to create shapes by
dragging it into the drawing pane of a page. When a stencil is dropped into a
page, the following actions will be taken by Pencil to create a shape for that
stencil:

1. Creating a shape as an SVG element containing all SVG elements defined in
   the content section of the stencil definition.

2. Putting the newly-created shape into the page content.

3. Setting initial values for all properties in the shape to the default values
   as defined in the stencil.

4. Applying all behaviours defined in the stencil to make the shape's look
   change according to these initial property values.

Manipulating Shapes in the Drawing Page
---------------------------------------

After being successfully inserted into a page, a shape begins its life in that
page. During its life, a shape may have its properties changed by the user.
Depending on the type, a property value can be changed in a specific way that
is easiest for the user.

.. Note::
    Pencil reserves the use of some special property names for pre-defined
    purposes. Please refer the Special Property Names document for detailed
    information on how these property names can be used in your stencil.

    An example of this is that the 'box' property of type 'Dimension' should
    always be used to determined the dimension of the outermost box surrounding
    the shape.
