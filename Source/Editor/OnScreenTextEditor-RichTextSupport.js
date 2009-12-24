// onscreen richtext editing support functions (private)
OnScreenTextEditor.richTextEditor = null;
OnScreenTextEditor.richTextEditorPane = null;

OnScreenTextEditor._runEditorCommand = function(command, arg) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    try {
        if (typeof(arg) != "undefined") OnScreenTextEditor.richTextEditor.contentDocument.execCommand(command, false, arg);
        else OnScreenTextEditor.richTextEditor.contentDocument.execCommand(command, false, null);
    } catch (e) {
        Console.dumpError(e, "stdout");
    }
};

OnScreenTextEditor._runEditorCommandByList = function (command, list) {
    var v = list.value;
    if (!v) return;
    try {
        OnScreenTextEditor._runEditorCommand(command, v);
    } catch (e) { }
    //list.selectedIndex = 0;
};

OnScreenTextEditor._enableTextToolbar = function (enable) {
    var toolbar = document.getElementById("richTextEditorToolbar");
    Dom.workOn(".//*[local-name() = 'toolbarbutton' or local-name() = 'menulist']", toolbar, function (node) {
        node.disabled = !enable;
    });
    if (enable) {
        document.getElementById("textColorButton").removeAttribute("disabled");
        document.getElementById("hilightColorButton").removeAttribute("disabled");
    } else {
        document.getElementById("textColorButton").setAttribute("disabled", "true");
        document.getElementById("hilightColorButton").setAttribute("disabled", "true");
    }

    /*
        var fontEditor = document.getElementById("fontEditor");
        if (enable) {
            fontEditor.setAttribute("disabled", "true");
        }  else {
            fontEditor.removeAttribute("disabled");
        }
    */
};

OnScreenTextEditor._enableGlobalClipboardKeys = function (enable) {
    try {
        OnScreenTextEditor._enableGlobalKey("copyKey", enable);
        OnScreenTextEditor._enableGlobalKey("cutKey", enable);
        OnScreenTextEditor._enableGlobalKey("pasteKey", enable);
        OnScreenTextEditor._enableGlobalKey("undoKey", enable);
        OnScreenTextEditor._enableGlobalKey("redoKey", enable);
    } catch (e) {
        Console.dumpError(e, "stdout");
    }
};
OnScreenTextEditor._enableGlobalKey = function (id, enable) {
    var key = document.getElementById(id);
    if (enable) {
        key.removeAttribute("disabled");
    }  else {
        key.setAttribute("disabled", "true");
    }
}

OnScreenTextEditor._ensureSupportElements = function () {
    try {
        OnScreenTextEditor._ensureSupportElementsImpl();
    } catch (e) {
        Console.dumpError(e, "stdout");
    }
};

OnScreenTextEditor._ensureSupportElementsImpl = function() {
    if (!OnScreenTextEditor.richTextEditor) {
    
        //setup toolbar
        var fontPopup = document.getElementById("fontPopup");
        var localFonts = Local.getInstalledFonts();
        for (var i in localFonts) {
            var item = document.createElement("menuitem");
            item.setAttribute("label", localFonts[i]);
            item.setAttribute("value", localFonts[i]);
            fontPopup.appendChild(item);
        }
        OnScreenTextEditor._enableTextToolbar(false);
        
        OnScreenTextEditor.richTextEditor = document.getElementById("richTextEditor");
        OnScreenTextEditor.richTextEditorPane = document.getElementById("richTextEditorPane");
        
        OnScreenTextEditor.richTextEditor.contentDocument.designMode = "on";
        OnScreenTextEditor._runEditorCommand("styleWithCSS", true);
        
        OnScreenTextEditor.richTextEditorPane.style.visibility = "hidden";
        
        document.getElementById("mainToolbox").addEventListener("focus", function (event) {
                OnScreenTextEditor.shoudClose = false;
        }, true);
        
        OnScreenTextEditor.richTextEditor.contentWindow.addEventListener("blur", function (event) {
            
            OnScreenTextEditor.shoudClose = true;
            
            window.setTimeout(function() {
                if (!OnScreenTextEditor.shoudClose) {
                    return;
                }
                if (!OnScreenTextEditor.currentInstance) {
                    OnScreenTextEditor._hide();
                    return;
                }
                OnScreenTextEditor.currentInstance.applyChanges();
                OnScreenTextEditor._hide();
            }, 20)
            
        }, false);
        OnScreenTextEditor.richTextEditorPane.addEventListener("keypress", function (event) {
            if (event.keyCode == event.DOM_VK_ESCAPE) {
                OnScreenTextEditor._hide();
            } else if (event.keyCode == event.DOM_VK_RETURN && !event.shiftKey) {
                OnScreenTextEditor.currentInstance.applyChanges();
                OnScreenTextEditor._hide();
                Dom.cancelEvent(event);
            }
        }, false);
        var selectListener = function (event) {
            var temp = OnScreenTextEditor.isEditing;
            OnScreenTextEditor.isEditing = false;
            
            OnScreenTextEditor._updateListByCommandValue("formatblock", "blockList");
            OnScreenTextEditor._updateListByCommandValue("fontsize", "edSizeList");
            OnScreenTextEditor._updateListByCommandValue("fontname", "fontList");

            OnScreenTextEditor._updateColorButtonByCommandValue("forecolor", "textColorButton");
            OnScreenTextEditor._updateColorButtonByCommandValue("hilitecolor", "hilightColorButton");

            OnScreenTextEditor._updateButtonByCommandState("bold", "edBoldButton");
            OnScreenTextEditor._updateButtonByCommandState("italic", "edItalicButton");
            OnScreenTextEditor._updateButtonByCommandState("underline", "edUnderlineButton");
            OnScreenTextEditor._updateButtonByCommandState("strikethrough", "edStrikeButton");
            
            OnScreenTextEditor.isEditing = temp;
        };
        OnScreenTextEditor.richTextEditor.contentDocument.body.addEventListener("mouseup", selectListener, false);
        OnScreenTextEditor.richTextEditor.contentDocument.body.addEventListener("keypress", selectListener, false);
        
        //editor command handlers
        OnScreenTextEditor._installListCommandHandler("blockList", "formatblock");
        OnScreenTextEditor._installListCommandHandler("edSizeList", "fontsize");
        OnScreenTextEditor._installListCommandHandler("fontList", "fontname");
        
        OnScreenTextEditor._installColorCommandHandler("textColorButton", "forecolor");
        OnScreenTextEditor._installColorCommandHandler("hilightColorButton", "hilitecolor");
        
        OnScreenTextEditor._installSimpleCommandHandler("edBoldButton", "bold");
        OnScreenTextEditor._installSimpleCommandHandler("edItalicButton", "italic");
        OnScreenTextEditor._installSimpleCommandHandler("edUnderlineButton", "underline");
        OnScreenTextEditor._installSimpleCommandHandler("edStrikeButton", "strikethrough");
        OnScreenTextEditor._installSimpleCommandHandler("edBulletedListButton", "insertunorderedlist");
        OnScreenTextEditor._installSimpleCommandHandler("edNumberedListButton", "insertorderedlist");
        OnScreenTextEditor._installSimpleCommandHandler("edIndentButton", "indent");
        OnScreenTextEditor._installSimpleCommandHandler("edOutdentButton", "outdent");
        OnScreenTextEditor._installSimpleCommandHandler("clearButton", "removeformat");
        OnScreenTextEditor._installSimpleCommandHandler("insertLinkButton", "createlink", "#");
    }
};
OnScreenTextEditor._installListCommandHandler = function (id, commandName) {
    var doc = OnScreenTextEditor.richTextEditor.ownerDocument;
    doc.getElementById(id).addEventListener("command", function (event) {
        if (!OnScreenTextEditor.isEditing) return;
        OnScreenTextEditor._runEditorCommandByList(commandName, event.originalTarget);
    }, false);
};
OnScreenTextEditor._installSimpleCommandHandler = function (id, commandName, value) {
    var doc = OnScreenTextEditor.richTextEditor.ownerDocument;
    doc.getElementById(id).addEventListener("command", function (event) {
        if (!OnScreenTextEditor.isEditing) return;
        if (value) {
        OnScreenTextEditor._runEditorCommand(commandName, event.originalTarget);
        } else {
            OnScreenTextEditor._runEditorCommand(commandName);
        }
    }, false);
};
OnScreenTextEditor._installColorCommandHandler = function (id, commandName) {
    var doc = OnScreenTextEditor.richTextEditor.ownerDocument;
    var picker = doc.getElementById(id);
    picker.addEventListener("change", function (event) {
        if (!OnScreenTextEditor.isEditing) return;
        OnScreenTextEditor._runEditorCommand(commandName, picker.color.toRGBString());
    }, false);
};

OnScreenTextEditor._updateListByCommandValue = function (commandName, controlId) {
    var value = null;
    try {
        value = OnScreenTextEditor.richTextEditor.contentDocument.queryCommandValue(commandName);
    } catch (e) {
        Console.dumpError(e, "stdout");
    }
    
    
    var control = document.getElementById(controlId);
    if (control.localName == "menulist") {
        if (value == null) return;
        control.value = value;
    }
}
OnScreenTextEditor._updateColorButtonByCommandValue = function (commandName, controlId) {
    var value = null;
    try {
        value = OnScreenTextEditor.richTextEditor.contentDocument.queryCommandValue(commandName);
    } catch (e) {
        Console.dumpError(e, "stdout");
    }
    
    var control = document.getElementById(controlId);
    if (control.localName == "pcolorbutton") {
        if (value == null) return;
        control.color = Color.fromString(value);
    }
}
OnScreenTextEditor._updateButtonByCommandState = function (commandName, controlId) {
    var value = null;
    try {
        value = OnScreenTextEditor.richTextEditor.contentDocument.queryCommandState(commandName);
    } catch (e) {
        Console.dumpError(e, "stdout");
    }
    
    
    var control = document.getElementById(controlId);
    if (control.localName == "toolbarbutton") {
        control.checked = value ? true : false;
    }
}
OnScreenTextEditor._hide = function () {
    if (!OnScreenTextEditor.isEditing) return;
    OnScreenTextEditor.isEditing = false;
    OnScreenTextEditor._enableGlobalClipboardKeys(true);
    OnScreenTextEditor._enableTextToolbar(false);
    OnScreenTextEditor.richTextEditorPane.style.visibility = "hidden";
    
    try {
        if (OnScreenTextEditor.currentInstance) OnScreenTextEditor.currentInstance.canvas.focusableBox.focus();
    } catch (e) {
        Console.dumpError(e, "stdout");
    }
    OnScreenTextEditor.currentInstance = null;
    
    if (OnScreenTextEditor.backedupTarget) {
        for (var i in Pencil.sharedEditors) {
            try {
                var editor = Pencil.sharedEditors[i];
                editor.attach(OnScreenTextEditor.backedupTarget);
            } catch (e) {
                Console.dumpError(e, "stdout");
            }
        }
        OnScreenTextEditor.backedupTarget = null;
    }
};
OnScreenTextEditor.prototype.applyChanges = function () {
    Dom.workOn(".//html:script", OnScreenTextEditor.richTextEditor.contentDocument.body, function (node) {
        node.parentNode.removeChild(node);
    });
    var html = Dom.serializeNode(OnScreenTextEditor.richTextEditor.contentDocument.body);
    html = html.replace(/<[\/A-Z0-9]+[ \t\r\n>]/g, function (zero) {
        return zero.toLowerCase();
    });
    if (html.match(/^<body[^>]*>([^\0]*)<\/body>$/)) {
        html = RegExp.$1;
    }
    
    this.currentTarget.setProperty(this.textEditingInfo.prop.name, RichText.fromString(html));
};

OnScreenTextEditor.prototype._setupRichTextEditor = function () {
    for (var i in Pencil.sharedEditors) {
        try {
            Pencil.sharedEditors[i].detach();
        } catch (e) {
            Console.dumpError(e, "stdout");
        }
    }
    
    OnScreenTextEditor.richTextEditor.contentDocument.body.innerHTML = "";
    OnScreenTextEditor.richTextEditor.contentDocument.body.innerHTML = this.textEditingInfo.value;
    
    if (this.textEditingInfo.font) {
        var font = this.textEditingInfo.font;
        var body = OnScreenTextEditor.richTextEditor.contentDocument.body;
        body.style.fontFamily = font.family;
        body.style.fontSize = font.size;
        body.style.fontWeight = font.weight;
        body.style.fontStyle = font.style;
    }
    var ctm = this.textEditingInfo.target.getScreenCTM();
    var svgCTM = this.canvas.svg.getScreenCTM();
    
    //tricky dx, dy: screenCTM of SVG and screen location of its parent is not the same.
    var dx = this.canvas.svg.parentNode.boxObject.screenX - svgCTM.e;
    var dy = this.canvas.svg.parentNode.boxObject.screenY - svgCTM.f;
    
    var boxObject = OnScreenTextEditor.richTextEditorPane.parentNode.boxObject;
    
    var x = ctm.e - boxObject.screenX + dx;
    var y = ctm.f - boxObject.screenY + dy;
    var bbox = this.textEditingInfo.target.getBBox();
    
    var width = Math.max(bbox.width, 100);
    var height = Math.min(Math.max(bbox.height + 2, 50), 500);
    
    
    var svgContainer = this.canvas.svg.parentNode;
    var geo = this.canvas.getZoomedGeo(this.currentTarget);
    
    if (this.textEditingInfo.bound) {
        x += this.textEditingInfo.bound.x - 1;
        y += this.textEditingInfo.bound.y - 1;
        width = this.textEditingInfo.bound.w + 4;
        height = this.textEditingInfo.bound.h + 4;
    }
    
    if (x < 0) {
        width += x;
        x = 0;
    }
    if (y < 0) {
        height += y;
        y = 0;
    }
    
    if (width + x > boxObject.width) {
        width = boxObject.width - x;
    }
    if (height + y > boxObject.height) {
        height = boxObject.height - y;
    }
    
    OnScreenTextEditor.richTextEditorPane.setAttribute("left", x);
    OnScreenTextEditor.richTextEditorPane.setAttribute("top", y);
    OnScreenTextEditor.richTextEditorPane.setAttribute("width", width);
    OnScreenTextEditor.richTextEditorPane.setAttribute("height", height);
    
    OnScreenTextEditor._enableGlobalClipboardKeys(false);
    OnScreenTextEditor._enableTextToolbar(true);
    OnScreenTextEditor.richTextEditorPane.style.visibility = "visible";

    OnScreenTextEditor.richTextEditor.contentWindow.focus();
    OnScreenTextEditor.richTextEditor.contentWindow.scrollTo(0, 0);
    OnScreenTextEditor._runEditorCommand("selectall");
    
    var canvas = Pencil.activeCanvas;
    var target = canvas.currentController;
    OnScreenTextEditor.backedupTarget = target;
    OnScreenTextEditor.isEditing = true;
    
};
