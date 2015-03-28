Object Snapping
===============

Pencil users know that Pencil have already provided the default snapping between objects. Object snapping is very useful for aligning objects so that drawing operations can be done quickly. There are 6 default snappings in Pencil:

.. figure:: ../../images/Main_html_1a7041.png

    Top-to-Top

.. figure:: ../../images/Main_html_7e0c8180.png

    Bottom-to-Bottom

.. figure:: ../../images/Main_html_m38479759.png

    Center-to-Center (horizontal)

.. figure:: ../../images/Main_html_m5ba0c02d.png

    Left-to-Left

.. figure:: ../../images/Main_html_m6a190f38.png

    Right-to-Right

.. figure:: ../../images/Main_html_7dd2ebdf.png

    Midle-to-Midle (vertical)


Sometimes the snapping needs to be customized for specific purpose. This tutorial will show how to create new custom snappings. These definitions are also put into an <Action></Action> and must have the exact id of getSnappingGuide.

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
        <p:Content xmlns:p="http://www.evolus.vn/Namespace/Pencil" xmlns="http://www.w3.org/2000/svg">
            <rect id="rrRect" x="0" y="0" />
        </p:Content>
    </Shape>

The getSnappingGuide action is expected to return an array of snapping hints. Each snapping hint is composed in an object of type SnappingData::

    new SnappingData(SnappingName, position, ToSnappingName, isHorizontalSnapping, this.id)

Where:

* **isHorizontalSnapping:** if true, the snapping will be through Horizontal direction.
* **SnappingName:** is the Snapping name of this object contains this snapping definition.
* **ToSnappingName:** is the Snapping name of other object that can be snapped to this object.
* **Position:** is the position in this shape when the snapping is defined (vertical or horizontal).

Built-in snapping data: by default, even if you don't provide snapping definitions, Pencil has the following snapping data defined for all objects::

    new SnappingData("Top", b.y, "Top", false, this.id),
    new SnappingData("Bottom", b.y + b.height, "Bottom", false, this.id),
    new SnappingData("HCenter", b.y + b.height / 2, "HCenter", false, this.id),
    new SnappingData("Left", b.x, "Left", true, this.id),
    new SnappingData("Right", b.x + b.width, "Right", true, this.id),
    new SnappingData("VCenter", b.x + b.width / 2, "VCenter", true, this.id),

where b is the object bounding, b.y is the object's top position, b.x is the object's left position, b.height is the object bound height, b.width is the object bound with.

In the above example of Rectangle, 4 default snappings are modified and a new snapping is created.

.. image:: ../../images/Main_html_maea559c.png

In the above example, A's Top snapping was modified by new SnappingData("Top", b.y + b.height, "Top", false, this.id),. So other object have Top snapping will be possible to snap to A's new Top. The logic for Bottom, Left, Right snappings are the same.

.. image:: ../../images/Main_html_669d32d5.png

Also in this example, a custom, new snapping data is introduced to defined a new snapping that are not standard to the general logic. This is good for special stencils that we would like to have very specific snappings defined::

    new SnappingData("FrameTop", b.y + b.height/2, "TabBottom", false, this.id)

Suppose that we have another stencil named B with the following custom snapping defined::

    new SnappingData("TabBottom", b.y, "FrameTop", false, this.id)

So, A have a new snapping FrameTop which allows other snapping of type TabBottom to be snapped to. Since B has that specific TabBottom snapping defined, it will be possible for B to snap to A at the expected position.

If other objects want to snap to A at FrameTop, it just needs to define a snapping with the name of TabBottom name like B.

As noted above, all objects in Pencil has a Top snapping data defined by default to its top position, so to have all objects to be able to snap to our A's special FrameTop snapping point, just modify the SnappingData definition to the following::

    new SnappingData("FrameTop", b.y + b.height/2, "Top", false, this.id)
