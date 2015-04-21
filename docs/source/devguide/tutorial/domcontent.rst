.. _Dynamic DOM Content:

Dynamic DOM Content
===================

In some special cases, a shape's content is composed of a dynamic element
structure. Pencil provides the :ref:`DomContent` behavior so that the DOM
content of an element can be changed dynamically. The value provided to this
behavior is a DOM node that will be inserted as a child of the target element.
Together with providing this behavior, Pencil also provides utility functions
for quickly building DOM nodes and fragments from the spec, defined as
JavaScript objects.

.. code-block:: xml

    <Shape id="list" displayName="List" icon="Icons/list.png">
        <Properties>
            <PropertyGroup>
                <Property name="box" displayName="Box" type="Dimension">191,235</Property>
            </PropertyGroup>
            <PropertyGroup name="Item Text">
                <Property name="contentText" displayName="Text Content" type="PlainText" p:editInfo="({targetName: 'content', bound: Bound.fromBox($box, 0, 52), font: $itemFont, align: new Alignment(0, 0), multi: true})">
                    MenuItem MenuItem MenuItem
                </Property>
                <Property name="itemFont" displayName="Text Font" type="Font">
                    <E>$$defaultTextFont</E>
                </Property>
                <Property name="itemColor" displayName="Text Color" type="Color">#000000ff</Property>
            </PropertyGroup>
        </Properties>
        <Behaviors>
            <For ref="content">
                <Bound>Bound.fromBox($box, 0, 54)</Bound>
                <Font>$itemFont</Font>
                <DomContent>
                    var items = $contentText.value.split(/[\r\n]+/);
                    var specs = [];
                    for (var i = 0; i &lt; items.length; i ++) {
                        var css = new CSS();

                        var title = items[i];

                        if(title.match(/\S/) != null) {
                            var lineHeight = (i + 1) * (30 + $itemFont.getPixelHeight());

                            var css = new CSS();
                            css.set("font-size",$itemFont.size);
                            css.set("font-family",$itemFont.family);
                            css.set("font-style",$itemFont.style);
                            css.set("font-weight",$itemFont.weight);
                            css.set("font-decor",$itemFont.decor);
                            css.set("fill", $itemColor.toRGBString());

                            specs.push({
                                _name: "text",
                                _uri: "http://www.w3.org/2000/svg",
                                x: 10,
                                y: lineHeight,
                                _text : title,
                                style: css
                                },{
                                    _name: "path",
                                    _uri: "http://www.w3.org/2000/svg",
                                    d: "m 10,"+ (lineHeight+10) + " "+($box.w - 20)+",0" ,
                                    style : "stroke-width:1;stroke:#c9c9c9"
                            });
                        }
                    }
                    Dom.newDOMFragment(specs);
                </DomContent>
            </For>
        </Behaviors>
        <p:Content xmlns:p="http://www.evolus.vn/Namespace/Pencil"
                   xmlns="http://www.w3.org/2000/svg">
            <g id="content" />
        </p:Content>
    </Shape>

In this example, the text content entered by the user is supposed to be split
across multiple lines. The code inside the behavior splits the text content
and creates a ``text`` element for each line, containing that line and a
``path`` element as the footer of the ``text``.

The utility method ``Dom.newDOMFragment(specs);`` is used here to create DOM
fragments from the object specs.
