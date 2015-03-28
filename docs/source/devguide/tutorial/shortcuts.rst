Using Shortcuts
===============

A stencil contains many properties. When the shape is dragged in canvas, each property have a default value. Sometimes the stencil may want to be used with other different properties default value, so Pencil supports creating shortcuts from an original stencil by changing the properties default value. This is very useful when you want to create multiple stencils that share a common behaviours. The way to do it is to define a generic stencil and then providing different shortcuts to it, each with a different set of default values to its properties.

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

From a normal text stencil, by changing the shadow property default value, a new stencil is created: the text with shadow. All properties can be changed using this method. The to attribute refers to the target shape id.

A shortcut may refer to a stencil from another collection. In case, the to property needs to be in the form of collectionid:shapeId.

.. code-block:: xml

    <Shortcut displayName="name" icon="" to="collectionId:shapeId">
        ...
    </Shortcut>


Please note that there is a limitation in Pencil is that the referenced collection need to be loaded first otherwise, the shortcut will not work.
