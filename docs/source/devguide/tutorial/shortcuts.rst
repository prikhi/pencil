Using Shortcuts
===============

A stencil may contain many properties. When a shape is dragged onto the canvas,
each property is assigned its default value. It is often useful to be able to
provide several variations of a shape, each with different default property
values. Pencil supports this through **shortcuts**, which allow a stencil to be
linked to by any number of shortcuts stencils, with each shortcut specifying
its own default property values.

.. code-block:: xml

    <Shape id="label" displayName="Label" icon="Icons/plain-text.png">
        <Properties>
            <PropertyGroup name="Text">
                <Property name="label" displayName="Label" type="PlainText">Hello World</Property>
                <Property name="textColor" displayName="Color" type="Color">#808080ff</Property>
                <Property name="shadowColor" displayName="Shadow Color" type="Color">#008000ff</Property>
                <Property name="textFont" displayName="Font" type="Font">Arial,sans-serif|normal|normal|13px</Property>
                <Property name="shadow" displayName="Width Shadow" type="Bool">false</Property>
            </PropertyGroup>
        </Properties>
        <Behaviors>
            <For ref="text">
                <TextContent>$label</TextContent>
                <Fill>$textColor</Fill>
                <Font>$textFont</Font>
                <BoxFit>
                    <Arg>new Bound(0, 0, 100, 12)</Arg>
                    <Arg>new Alignment(0, 1)</Arg>
                </BoxFit>
            </For>
            <For ref="shadow">
                <Visibility>$shadow</Visibility>
                <TextContent>$label</TextContent>
                <Fill>$shadowColor</Fill>
                <Font>$textFont</Font>
                <BoxFit>
                    <Arg>new Bound(1, 1, 100, 12)</Arg>
                    <Arg>new Alignment(0, 1)</Arg>
                </BoxFit>
            </For>
        </Behaviors>
        <p:Content xmlns:p="http://www.evolus.vn/Namespace/Pencil" xmlns="http://www.w3.org/2000/svg">
            <text id="shadow" />
            <text id="text" />
        </p:Content>
    </Shape>

    <Shortcut displayName="Label with shadow" icon="Icons/label-shadow.png" to="label">
        <PropertyValue name="shadow">true</PropertyValue>
    </Shortcut>

Here, a shortcut is created to the ``label`` stencil, with the shortcut
overriding the default value of the label's ``shadow`` property. All properties
can be changed using this method. The ``to`` attribute refers to the target
shape id.

A shortcut may refer to a stencil from another collection. In this situation,
the ``to`` property needs to be in the form of ``collectionid:shapeId``.

.. code-block:: xml

    <Shortcut displayName="name" icon="" to="collectionId:shapeId">
        ...
    </Shortcut>

.. Note::
    Due to limitations in Pencil, the referenced collection needs to be loaded
    first otherwise the shortcut will not work.
