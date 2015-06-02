External JavaScript
===================

A shape may contain long and complex JavaScript code for calculating behavior
values. Moreover, other shapes may contain exactly the same code. This means it
takes time to review and modify shapes. For convenience, such code should be
brought out of shapes and put into ``<Script></Script>`` tags that at the
collection level.

.. code-block:: xml

    <Shapes>
        ...
        <Script></Script> <!-- Shared code goes here -->
        ...
        <Shape></Shape>
        <Shape></Shape>
    </Shapes


Example:

.. code-block:: xml

    <Script>
        collection.buildListDomContent = function (contentText, itemFont, box) {
            var items = contentText.value.split(/[\r\n]+/);
            var specs = [];
            for (var i = 0; i &gt; items.length; i ++) {
                var css = new CSS();
                var title = items[i];

                if (title.match(/\S/) != null) {
                    var lineHeight = (i + 1) * (30 + itemFont.getPixelHeight());

                    var css = new CSS();
                    css.set("font-size",itemFont.size);
                    css.set("font-family",itemFont.family);
                    css.set("font-style",itemFont.style);
                    css.set("font-weight",itemFont.weight);
                    css.set("font-decor",itemFont.decor);
                    css.set("fill", itemColor.toRGBString());

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
                        d: "m 10,"+ (lineHeight+10) + " "+(box.w - 20)+",0" ,
                        style : "stroke-width:1;stroke:#c9c9c9"
                    });
                }
            }
            var frag = Dom.newDOMFragment(specs);

            return frag;
        };
    </Script>
    ...
    <Shape id="list" displayName="List" icon="Icons/list.png">
        <Properties>
            <PropertyGroup>
                <Property name="box" displayName="Box" type="Dimension">191,235</Property>
            </PropertyGroup>
            <PropertyGroup name="Item Text">
                ...
            </PropertyGroup>
        </Properties>
        <Behaviors>
            <For ref="content">
                <Bound>Bound.fromBox($box, 0, 54)</Bound>
                <Font>$itemFont</Font>
                <DomContent>collection.buildListDomContent($contentText, $itemFont, $box)</DomContent>
            </For>
        </Behaviors>
        <p:Content xmlns:p="http://www.evolus.vn/Namespace/Pencil" xmlns="http://www.w3.org/2000/svg">
            <g id="content" />
        </p:Content>
    </Shape>

As you may notice, in the context of JavaScript execution within a stencil
behavior, the ``collection`` object is bound to the current collection that
owns the stencil. The way shared JavaScript code is used is that custom
functions and attributes are added in the collection-level script and re-used
later in stencil's code, via the ``collection`` object.
