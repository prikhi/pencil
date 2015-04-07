Object Snapping
===============

Pencil users will know that Pencil provides snapping between objects. Object
snapping is very useful for aligning objects so that drawing operations can be
done quickly. There are 6 default snappings in Pencil:

.. figure:: /images/tutorial_top_snapping.png

    Top-to-Top

.. figure:: /images/tutorial_bottom_snapping.png

    Bottom-to-Bottom

.. figure:: /images/tutorial_center_snapping.png

    Center-to-Center (horizontal)

.. figure:: /images/tutorial_left_snapping.png

    Left-to-Left

.. figure:: /images/tutorial_right_snapping.png

    Right-to-Right

.. figure:: /images/tutorial_middle_snapping.png

    Middle-to-Middle (vertical)


Sometimes the snapping needs to be customized for specific purposes. This
tutorial will show how to create new custom snappings. These definitions are
put into an ``<Action></Action>`` which must have the exact id of
``getSnappingGuide``.

.. code-block:: xml

    <Shape id="RoundedRect" displayName="Rectangle" icon="Icons/rectangle.png">
        <Properties>
            ...
        </Properties>
        <Behaviors>
            ...
        </Behaviors>
        <Actions>
            <Action id="getSnappingGuide">
                <Impl>
                    var b = this.getBounding();
                    return [
                        new SnappingData("FrameTop", b.y + b.height/2, "TabBottom", false, this.id),
                        new SnappingData("Top", b.y + b.height, "Top", false, this.id),
                        new SnappingData("Bottom", b.y, "Bottom", false, this.id),
                        new SnappingData("Left", b.x + b.width, "Left", true, this.id),
                        new SnappingData("Right", b.x, "Right", true, this.id)
                    ];
                </Impl>
            </Action>
        </Actions>
        <p:Content xmlns:p="http://www.evolus.vn/Namespace/Pencil"
                   xmlns="http://www.w3.org/2000/svg">
            <rect id="rrRect" x="0" y="0" />
        </p:Content>
    </Shape>

The ``getSnappingGuide`` action is expected to return an array of snapping
hints. Each snapping hint is composed of an object of type SnappingData::

    new SnappingData(snappingName, position, toSnappingName, isHorizontalSnapping, this.id)

Where:

* **snappingName:** is the name of this snapping hint.
* **position:** is the position in this shape when the snapping hint is defined
  (vertical or horizontal).
* **toSnappingName:** is the Snapping name of other hints that can be snapped
  to this hint.
* **isHorizontalSnapping:** if true, the snapping will be in the Horizontal
  direction.

**Built-in snapping data:** by default, even if you don't provide snapping
definitions, Pencil has the following snapping data defined for all objects::

    new SnappingData("Top", b.y, "Top", false, this.id),
    new SnappingData("Bottom", b.y + b.height, "Bottom", false, this.id),
    new SnappingData("HCenter", b.y + b.height / 2, "HCenter", false, this.id),
    new SnappingData("Left", b.x, "Left", true, this.id),
    new SnappingData("Right", b.x + b.width, "Right", true, this.id),
    new SnappingData("VCenter", b.x + b.width / 2, "VCenter", true, this.id),

where ``b`` is the object bounds, ``b.y`` is the object's top position, ``b.x``
is the object's left position, ``b.height`` is the object bound height,
``b.width`` is the object bound width.

In the above example for the ``Rectangle`` shape, four default snappings are
modified and a new snapping is created.

.. image:: /images/tutorial_top_bottom_snapping.png

In the above example, **A**'s ``Top`` snapping was modified by ``new
SnappingData("Top", b.y + b.height, "Top", false, this.id),``. So other objects
that have ``Top`` snapping will snap to **A**'s new Top. The logic for Bottom,
Left, Right snappings are the same.

Also in this example, a custom, new snapping hint is introduced. This is good
for special stencils where we would like to have very specific snappings
defined::

    new SnappingData("FrameTop", b.y + b.height/2, "TabBottom", false, this.id)

Suppose that we have another stencil named **B** with the following custom
snapping defined::

    new SnappingData("TabBottom", b.y, "FrameTop", false, this.id)

So, **A** has a new snapping, ``FrameTop``, which allows other snappings of
type ``TabBottom`` to be snapped to. Since **B** has a snapping hint called
``TabBottom`` defined, it will be possible for **B** to snap to **A** at the
expected position.

.. image:: /images/tutorial_top_middle_snapping.png

If other shapes want to snap to **A** at ``FrameTop``, they just need to define
a snapping with the name ``TabBottom`` like **B** does.

As noted above, all objects in Pencil have a ``Top`` snapping hint defined by
default as its top position, so to have all objects be able to snap to our
**A**'s special ``FrameTop`` snapping point, just modify the SnappingData
definition to the following::

    new SnappingData("FrameTop", b.y + b.height/2, "Top", false, this.id)
