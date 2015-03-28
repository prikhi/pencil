Actions
=======

There are cases that you may want your shape has a way user can quickly change its properties to a specific condition. For example changing the width and height of a rectangle to the same value, changing the border colour of a shape to a colour with the same HUE of the background but darker... The traditional way users must do is to do the calculation themselves and change each of the properties to desired value.

Pencil introduces the concept of Action in which stencil developers can define a routine to perform calculation and make changes to properties in a batch.

The following example show how an Action is define to allow users quickly change the rectangle to a square:

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


In Action, the shape properties are modified and will be applied immediately to objects refer to these properties. This above code is simple, box.h is forced to equal to box.w and then the rectangle becomes a square. Please note also that in the context of action execution, the keyword this is bound to the shape itself so that you can retrieve an set the property values via it.
