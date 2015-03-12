# Version 1.1 #
[r58](https://code.google.com/p/evoluspencil/source/detail?r=58)
  * **New Feature**: Export Selection to png
[r65](https://code.google.com/p/evoluspencil/source/detail?r=65)
  * **New Feature**: Drag'n Drop. You can now drag **SVG file** into Pencil, as you can drag png file, a copy of the file is created then, not a link to the SVG file
  * **New Feature**:Drag'n Drop. You can drag **png file** into Pencil, the file is always embed, the PNG background will be fill with a full transparent white,
[r67](https://code.google.com/p/evoluspencil/source/detail?r=67)
  * **New Feature**: **Stencil Generator** : this feature allowed to create as a snap a collection of image that you can use as a gallery like for example : ExtJSicons.GUI.zip
    * in Tool > Stencil Generator : It will search for image (.png, .jpg, .bmp) into folder or subfolder and will create the stencil
[r68](https://code.google.com/p/evoluspencil/source/detail?r=68)
  * **New Feature**: (the best one ?) Clipart  Browser
    * in Tool > **Clipart Browser** : a window show off, type what you are looking for in the search field, clic on the magnifier or press enter then the results appears in the windows, drag the clipart you want in your page !
[r69](https://code.google.com/p/evoluspencil/source/detail?r=69)
  * New Stencil: _Basic Web Elements_
    * contains a very clever Table Element to the data are parse according the following syntax : one line of text per row, each cell are | separated; the property useHtmlContent will allowed you to write html content (try : <b>Test</b>) (improved in [r105](https://code.google.com/p/evoluspencil/source/detail?r=105) with support for column widths and checkboxes/radios macros)
  * **New Feature**: New Property type: _ShadowStyle_ (require XulRunner 1.9.1) see property of _Pane_ Shape of the _Basic Web Elements_, coded as 0|0|3 for dx, dy, blur, you can define the offset, the blur, the color of the shadow
  * **New Feature**: Lorem Ipsum generator : see action of _Plain Texts_ or _Rich Texts_ in _Common Shapes_
  * New Behavior: _CustomStyle_ take 2 arguments (style, value)
  * For developers: many functions to work easily with HTML in Pencil
  * New preferences: edit.snap.grid (default true) and edit.gridSize (default 5)
[r71](https://code.google.com/p/evoluspencil/source/detail?r=71)
  * **New Feature**: Because collection now has properties, you can configure default properties by right clicking on it and select "Collection settings...". You can try it at the moment on The "Basic Web Elements" which is now enhanced by allow user to configure the default font, some color setting...
  * Improvement: The properties dialog now has better UI response when showing up.
> For developpers
    * For developers: The default properties is called is the Definition.xml file like this :  ` <E>$$defaultTextFont</E> ` that is specify in properties section of the collection, see Definition.xml of "Basic Web Elements"
  * For developers: Collection can have script to define functions. This is still under development however, part of it now works to support complex calculation in the stencil code. But I don't know how to use it...:-/
[r72](https://code.google.com/p/evoluspencil/source/detail?r=72)
  * For developers: add constraint function on handle, should allowed to move the handle along a circle for example
[r74](https://code.google.com/p/evoluspencil/source/detail?r=74)
    * **New Feature**: The geometry toolbar is back !
[r76](https://code.google.com/p/evoluspencil/source/detail?r=76)
    * **New Feature**: Handles are move along the shape when resizing shape, ex: resizing Hollow box resize also the inner box
[r79](https://code.google.com/p/evoluspencil/source/detail?r=79)
  * For developers: More behaviors and common functions
[r80](https://code.google.com/p/evoluspencil/source/detail?r=80)
  * **New Feature**: You can now navigation from shape to shape with the tab key, select a shape then press tab, Yes !
[r83](https://code.google.com/p/evoluspencil/source/detail?r=83)
  * **New Feature**: Page Note, right click on tab header then Edit Page Notes ...
[r86](https://code.google.com/p/evoluspencil/source/detail?r=86)
  * **New Feature**: Support scaling and rotating for groups
[r87](https://code.google.com/p/evoluspencil/source/detail?r=87) and more
  * **New Feature**: **Export** to html, pdf, png, odt, doc note that the html export supports links between pages and notes.
  * To export goto Document menu
  * You will need to specify a template that will defined the look of you export, you can find template [here](http://code.google.com/p/evoluspencil/source/browse/#)
  * to link to a tab : right-click on a shape in Pencil
  * to link to a tab from the note editor :
There are many ways that you can specify a link to a specific page.

  1. Using page id: set the link href to #id:`<page_id>` or set the page-id attribute
> > This is not intended for users but for future UI tools that help users specifying a target page for a link when using the note editor.
  1. Using page friendly id: set the link href to #fid:`<page_friendly_id>` or set the page-fid attribute
> > This can be used for the time being. The page friendly id is generated from the page's name by removing all non-alphanumeric chars, replacing spaces with underscore and lowercasing the result. For example, if the page name is 'Register new user', the fid will be: 'register\_new\_user'. A trailing seeding number may be added to the fid when duplicated names are found.
  1. Using page name: set the link href to #name:`<page_name>` or set the page-name attribute
> > This is provided for convenience and the system will find the first page with the provided name and use it as the target page.
[r97](https://code.google.com/p/evoluspencil/source/detail?r=97)
  * For developers: localizable definition (I don't exactly the syntax for dtd file)
[r108](https://code.google.com/p/evoluspencil/source/detail?r=108)
  * **New Feature**: **Private collection** you can create your own private collection by righ clic on a shape or a groupe and add to your private collection
    * you can import/export/delete collections in you "My collections" tab
    * you can add/delete/edit shape in your private collections
[r116](https://code.google.com/p/evoluspencil/source/detail?r=116)
  * Improvement in provided collections
[r123](https://code.google.com/p/evoluspencil/source/detail?r=123)
  * Adding Native GUI Collection
[r140](https://code.google.com/p/evoluspencil/source/detail?r=140)
  * refresh of the about dialog