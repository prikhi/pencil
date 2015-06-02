Special Property Names
======================

There is no actual limitation on the way shape properties can be named. Stencil
developers can choose the names that best describe the purpose of each
property. There is however a list of special names that Pencil provides special
support for. The following list summarizes those special names together with
how they are handled in Pencil.

+---------------+-------------+----------------------------------------------+
| Property Name | Type        | Pencil Supports                              |
+===============+=============+==============================================+
| box           | Dimension   | Shapes with this special property are        |
|               |             | supposed to be resizeable. Pencil will       |
|               |             | support resizing the shape by showing        |
|               |             | scaling handles when it is focused on the    |
|               |             | drawing canvas. Moving those handles will    |
|               |             | change the box property value. The way the   |
|               |             | shape is scaled upon changes of this         |
|               |             | property is defined by the stencil developer |
|               |             | via the behavior definition.                 |
+---------------+-------------+----------------------------------------------+
| textFont      | Font        | Value of this property can be changed using  |
|               |             | the Font toolbar                             |
+---------------+-------------+----------------------------------------------+
| textColor     | Color       | Value of this property can be changed using  |
|               |             | the Text color toolbar button                |
+---------------+-------------+----------------------------------------------+
| fillColor     | Color       | Value of this property can be changed using  |
|               |             | the Background color toolbar button          |
+---------------+-------------+----------------------------------------------+
| strokeColor   | Color       | Value of this property can be changed using  |
|               |             | the Line color toolbar button                |
+---------------+-------------+----------------------------------------------+
| strokeStyle   | StrokeStyle | Value of this property can be changed using  |
|               |             | the Line style toolbar                       |
+---------------+-------------+----------------------------------------------+
