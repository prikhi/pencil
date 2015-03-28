Special Constraints for Dimension and Handle
============================================

Sometimes, shapes may have to be created with special features such as being scaled with a fixed ratio, having handles moved only on one direction or in a limited length. Pencil supports many constraints for Pencil properties.

Dimension
---------

.. code-block:: xml

    <Property name="box" type="Dimension" p:lockRatio="true">36,45</Property>

**p:lockRatio**
    $box size is scaled with a fixed ratio. So any objects have width & height properties is set <Box>$box</Box> behavior will be scaled with a fixed ratio, too.
**p:lockW**
    the box width cannot be scaled
**p:lockH**
    the box height cannot be scaled.


Handle
------

.. code-block:: xml

    <Property name="width" displayName="Width" type="Handle" p:lockY="true" p:minX="10" p:maxX="$box.w" p:disabled="true">100,0</Property>

**p:lockY**
    only move on horizontal direction
**p:lockX**
    only move on vertical direction
**p:minX**, **p:maxX**
    moving on horizontal direction only from mixX to maxX
**p:minY**, **p:maxY**
    moving on vertical direction only from mixY to maxY
**p:disabled**
    disable the handle.
