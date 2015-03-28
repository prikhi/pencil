Tips and Tricks
===============

Visibility and Transform
------------------------

There are two universal behaviours in Pencil that can be applied to any type of objects::

    <Visibility>...</Visibility>
    <Transform>...</Transform>


Forced dependencies
-------------------

Upon changes of a specific property, all elements that has at least one behaviour refers to that property will be invalidated and the behaviour code will be executed. In some special case, you may want a specific behaviour to be executed when a specific property changes even when that property is not explicitly referenced. In this case, adding a comment in the syntax of //depends $propertyName will help.

.. code-block:: xml

    <For ref="text">
        <TextContent>new PlainText("Hello World")</TextContent>
        <Fill>Color.fromString("#000000ff")</Fill>
        <Font>new Font()</Font>
        <BoxFit>
            <Arg>new Bound(0, 0, 100, 12) //depends $textColor</Arg>
            <Arg>new Alignment(0, 1)</Arg>
        </BoxFit>
    </For>
