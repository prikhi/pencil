Drawing Images
--------------

A Pencil shape may contain bitmap images. This tutorial will show how to embed an image in a stencil.

Suppose that we have a bitmap image of a hand and we would like to create a stencil of the hand image with an editable name text label.

.. image:: /images/tutorial_hand_image.png

The first thing you have to do is convert the image into BASE64 format which is supported by Pencil for embedding binary data. There are many ways of converting an image into BASE64; the method shown below is for developers on GNU/Linux systems::

  $ base64 --wrap=0 hand.png

After performing the conversion, you can copy the output and use it in the XML code, as shown below:

.. code-block:: xml

    <Shape id="image" displayName="Image" icon="Icons/image.png">
        <Properties>
            <PropertyGroup>
                <Property name="box" type="Dimension" p:lockRatio="true">36,45</Property>
            </PropertyGroup>
            <PropertyGroup name="Text">
                <Property name="name" displayName="Name" type="PlainText">Hello World</Property>
                <Property name="textColor" displayName="Color" type="Color">#000000ff</Property>
                <Property name="textFont" displayName="Font" type="Font">Arial|normal|normal|13px</Property>
            </PropertyGroup>
        </Properties>
        <Behaviors>
            <For ref="image">
                <Box>$box</Box>
            </For>
            <For ref="name">
                <TextContent>$name</TextContent>
                <Fill>$textColor</Fill>
                <Font>$textFont</Font>
                <BoxFit>
                    <Arg>new Bound(0, $box.h + 13, $box.w, 13)</Arg>
                    <Arg>new Alignment(1, 1)</Arg>
                </BoxFit>
            </For>
        </Behaviors>
        <p:Content xmlns:p="http://www.evolus.vn/Namespace/Pencil" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <image id="image" x="0" y="0" xlink:href="data:image/png;base64,iVBORw0KGgo... (BASE64 content of the image)" />
            <text id="name" />
        </p:Content>
    </Shape>

Note that the BASE64 content of the image is used here in the form of a `Data URL`_ in the ``xlink:href`` attribute of an SVG ``image`` element.

.. _Data URL: http://en.wikipedia.org/wiki/Data_URI_scheme
