Collection Properties
=====================

Shapes in a collection tend to have the same style such as the same font, color
and stroke style. To be convenient for stencil authors in this situation,
Pencil supports grouping styles common to several shapes to collection
properties. These collection properties can be used as the default value for
stencil properties. Then, if the collection style is changed, the default
property values for shapes will be changed accordingly.


Have a look at this example. Collection properties are defined and then used in
shape properties.

.. code-block:: xml

    <Shapes>
        <Properties>
            <PropertyGroup name="Text">
                <Property name="defaultTextFont" type="Font" displayName="Default Font">Arial|normal|normal|13px</Property>
                <Property name="defaultTextColor" type="Color"    displayName="Default Text Color">#000000ff</Property>
            </PropertyGroup>
        </Properties>
        <Shape id="helloworld" displayName="Hello World" icon="Icons/plain-text.png">
            <Properties>
                <PropertyGroup name="Text">
                    <Property name="label" displayName="Label"   type="PlainText">Hello World</Property>
                    <Property name="textColor" displayName="Color"    type="Color"><E>$$defaultTextColor</E></Property>
                    <Property name="textFont" displayName="Font"    type="Font"><E>$$defaultTextFont</E></Property>
                </PropertyGroup>
            </Properties>

            <Behaviors>
                ...
            </Behaviors>

            <p:Content xmlns:p="http://www.evolus.vn/Namespace/Pencil" xmlns="http://www.w3.org/2000/svg">
                <text id="text" />
            </p:Content>
        </Shape>
    </Shapes>

Text content inside the ``<Property>`` tag of a stencil is the literal
presentation of the initial value for that property. In this example you will
notice that the content inside that tag is a ``<E></E>`` instead. This is the
notation to indicate that the initial value should be obtained by evaluating
the 'expression' inside the ``<E>`` tag. To reference a specific collection
property inside this expression, the ``$$`` syntax is used.
