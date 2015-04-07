Special Constraints for Dimension and Handle
============================================

Sometimes, shapes may have to be created with special features such as scaling
with a fixed ratio, having handles move only in one direction or within a
limited range. Pencil supports many constraints for Pencil properties.

Dimension
---------

.. code-block:: xml

    <Property name="box" type="Dimension" p:lockRatio="true">36,45</Property>

**p:lockRatio**
    $box size is scaled with a fixed ratio. This means any objects that have
    their have width and height properties set based on $box will be scaled
    with a fixed ratio too.
**p:lockW**
    the box width cannot be scaled.
**p:lockH**
    the box height cannot be scaled.


Handle
------

.. code-block:: xml

    <Property name="width" displayName="Width" type="Handle" p:lockY="true" p:minX="10" p:maxX="$box.w" p:disabled="true">100,0</Property>

**p:lockY**
    only move in a horizontal direction.
**p:lockX**
    only move in a vertical direction.
**p:minX**, **p:maxX**
    Restrict the horizontal position to between mixX and maxX (inclusive).
**p:minY**, **p:maxY**
    Restrict the vertical position to between mixY and maxY (inclusive).
**p:disabled**
    disable the handle.
