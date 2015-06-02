Actions
=======

There are cases where you may want to provide users with a way to quickly
change a shape's properties in a particular way. For example, changing the
width and height of a rectangle to the same value, changing the border color of
a shape to a color with the same hue as the background but darker, etc. The
traditional way is for users to do the calculation themselves and change each
of the properties to the desired value.

Pencil introduces the ``Action`` tag, in which stencil developers can define a
routine that performs calculations and makes changes to a shape's properties.

The following example show how an Action is defined to let users quickly change
the rectangle to a square:

.. code-block:: xml

    <Shape id="RoundedRect" displayName="Rectangle" icon="...">
        <Properties>
            ...
        </Properties>
        <Behaviors>
            ...
        </Behaviors>
        <Actions>
            <Action id="makeSquares" displayName="Make Squared">
                <Impl>
                    var box = this.getProperty("box");
                    box.w = Math.max(box.w, box.h);
                    box.h = box.w;
                    this.setProperty("box", box);
                </Impl>
            </Action>
        </Actions>
        <p:Content xmlns:p="http://www.evolus.vn/Namespace/Pencil"
            xmlns="http://www.w3.org/2000/svg">
            <rect id="rrRect" x="0" y="0" />
        </p:Content>
    </Shape>


In the ``<Action>``, the shape's properties are modified and will be applied
immediately to objects that refer to these properties. The above code is
simple: ``box.h`` is forced to equal ``box.w`` resulting in the rectangle
becoming a square.

.. Note::
    In the context of action execution, the keyword ``this`` is bound to the
    shape itself so that you can retrieve and set the property values via it.
