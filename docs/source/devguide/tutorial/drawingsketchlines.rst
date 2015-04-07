Drawing Sketchy Lines
=====================

Users may want to work with sketchy shapes to create draft notes. So Pencil supports drawing sketchy lines in addition to providing a stencil that contains many basic sketchy shapes.

.. image:: /images/tutorial_sketchy_shapes.png

This tutorial will show how to create a simple sketchy shape from sketchy lines.

.. code-block:: xml

    <Shape id="sketchyShape" displayName="Sketchy Shape" icon="Icons/sketchyShape.png">
        <Properties>
            ...
        </Properties>
        <Behaviors>
            <For ref="text">
                <TextContent>
                    new PlainText(Math.round($box.w) +" x "+Math.round($box.h))
                </TextContent>
                <Font>$textFont</Font>
                <Color>$textColor</Color>
                <BoxFit>
                    <Arg>Bound.fromBox($box)</Arg>
                    <Arg>$textAlign</Arg>
                </BoxFit>
            </For>
            <For ref="line1">
                <D>
                    [
                        sk(0, 0, $box.w, 0),
                        skTo($box.w, $box.h),
                        skTo(0, $box.h),
                        skTo(0, 0),
                        z,
                        sk(3, 3, $box.w - 3, $box.h - 3),
                        sk(3, $box.h - 3, $box.w - 3, 3),
                    ]
                </D>
                <Fill>$fillColor</Fill>
                <StrokeColor>$strokeColor</StrokeColor>
                <StrokeStyle>$strokeStyle</StrokeStyle>
            </For>
            <For ref="mask">
                <Fill>$fillColor</Fill>
                <D>
                    var length = $box.w - 5;
                    var height = $textFont.getPixelHeight();
                    [
                        M($box.w/2 - length / 2, $box.h/2 - height / 2),
                        L($box.w/2 + length / 2, $box.h/2 - height / 2),
                        L($box.w/2 + length / 2, $box.h/2 + height / 2),
                        L($box.w/2 - length / 2, $box.h/2 + height / 2),
                        z
                    ]
                </D>
            </For>
        </Behaviors>
        <p:Content xmlns:p="http://www.evolus.vn/Namespace/Pencil" xmlns="http://www.w3.org/2000/svg">
            <path id="line1" style="stroke-linejoin: round;" />
            <path id="mask" style="fill:white;stroke:none" />
            <text id="text" />
        </p:Content>
    </Shape>

In fact, drawing sketchy lines is the same as drawing normal lines. Simply use sk(x, y), skTo(x, y) instead of M(x, y), L(x, y) to create sketchy shapes.
