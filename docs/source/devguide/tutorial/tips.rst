Tips and Tricks
===============

Visibility and Transform
------------------------

There are two universal behaviours in Pencil that can be applied to any type of
object::

    <Visibility>...</Visibility>
    <Transform>...</Transform>


Forced dependencies
-------------------

Upon changes being made to a specific property, all elements that have at least
one behaviour referring to that property will be invalidated and the behaviour
code will be executed. In some special cases, you may want a specific behaviour
to be executed when a specific property changes even when that property is not
explicitly referenced. In this case, add a comment with the format ``//depends
$propertyName`` to the behaviour concerned.

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
