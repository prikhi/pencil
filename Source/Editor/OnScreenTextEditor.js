function OnScreenTextEditor() {
    this.svgElement = null;
    this.canvas = null;
}
OnScreenTextEditor.configDoc = Dom.loadSystemXml("OnScreenTextEditor.config.xml");



OnScreenTextEditor.prototype.install = function (canvas) {
    OnScreenTextEditor._ensureSupportElements();

    this.canvas = canvas;
    this.canvas.onScreenEditors.push(this);
    this.svgElement = canvas.ownerDocument.importNode(Dom.getSingle("/p:Config/svg:g", OnScreenTextEditor.configDoc), true);

    this.svgElement.style.visibility = "hidden";
    canvas.installControlSVGElement(this.svgElement);


    //register event
    var thiz = this;

    this.foPane = Dom.getSingle("./svg:foreignObject[@p:name='FOPane']", this.svgElement);
    this.singleTextEditor = Dom.getSingle(".//*[@p:name='TextEditor']", this.foPane);
    this.multiTextEditor = Dom.getSingle(".//*[@p:name='MultiLineTextEditor']", this.foPane);

    this.addEditorEvent("keypress", function (event) {
        event.cancelBubble = true;
        thiz.handleKeyPress(event);
    });
    this.addEditorEvent("dblclick", function (event) {
        event.cancelBubble = true;
    });
    this.addEditorEvent("blur", function (event) {
        thiz.handleTextBlur(event);
    });
    this.canvas.addEventListener("p:ShapeDoubleClicked", function (ev) {
        if (thiz.passivated) {
            thiz.canvas.removeEventListener("p:ShapeDoubleClicked", arguments.callee, false);
            return;
        }
        thiz.handleShapeDoubleClicked(ev);
    }, false);
    this.canvas.addEventListener("p:TextEditingRequested", function (ev) {
        if (thiz.passivated) {
            thiz.canvas.removeEventListener("p:TextEditingRequested", arguments.callee, false);
            return;
        }
        thiz.handleShapeDoubleClicked(ev);
    }, false);
};
OnScreenTextEditor.prototype.addEditorEvent = function (name, handler) {
    this.singleTextEditor.addEventListener(name, handler, false);
    this.multiTextEditor.addEventListener(name, handler, false);
};
OnScreenTextEditor.prototype.attach = function (targetObject) {
};
OnScreenTextEditor.prototype.invalidate = function () {
};
OnScreenTextEditor.prototype.nextTool = function () {
    //just ignore this, since this editor implements only one tool set
};

OnScreenTextEditor.prototype.dettach = function () {
};

OnScreenTextEditor.prototype.handleShapeDoubleClicked = function (event) {
    this.currentTarget = event.controller;
    if (!this.currentTarget || !this.currentTarget.getTextEditingInfo) return;

    this.textEditingInfo = this.currentTarget.getTextEditingInfo();
    if (this.textEditingInfo) {
        if (this.textEditingInfo.type == PlainText) {
            //setup
            this._setupEditor();
        } else if (this.textEditingInfo.type == RichText) {
            OnScreenTextEditor.currentInstance = this;
            this._setupRichTextEditor();
            /*
            var returnValueHolder = {};
            var dialog = window.openDialog("RichTextDialog.xul", "richTextEditor" + Util.getInstanceToken(), "modal,centerscreen", this.textEditingInfo, returnValueHolder);

            if (returnValueHolder.ok) {
                this.currentTarget.setProperty(this.textEditingInfo.prop.name, RichText.fromString(returnValueHolder.html));
            } else {
            }
            */
        }
    } else {
        //do nothing
    }
};
OnScreenTextEditor.prototype._setupEditor = function () {
    var geo = this.canvas.getZoomedGeo(this.currentTarget);
    Svg.ensureCTM(this.svgElement, geo.ctm);
    this.geo = geo;

    this.textEditor = this.textEditingInfo.multi ? this.multiTextEditor : this.singleTextEditor;
    this.foPane.setAttributeNS(PencilNamespaces.p, "p:mode", this.textEditingInfo.multi ? "Multi" : "Single");

    var bound = this.textEditingInfo.bound;
    var bbox = this.textEditingInfo.target.getBBox();
    var font = this.textEditingInfo.font;
    var align = this.textEditingInfo.align;

    var size = {
        h: this.textEditingInfo.multi ? (Math.max(bound.h, bbox.height) + 2) : Math.floor(font.getPixelHeight() * 1.2 + 2),
        w: Math.max(bound.w, bbox.width) + 2
    };
    var x = Math.round(((bound.w - size.w) * align.h) / 2 + bound.x);
    var y = Math.round(((bound.h - size.h) * align.v) / 2 + bound.y);

    var dx = Math.round(geo.ctm.e);
    var dy = Math.round(geo.ctm.f);

    //console.log([dx, dy]);

    Svg.setX(this.foPane, x - dx);
    Svg.setY(this.foPane, y - dy);
    Svg.setWidth(this.foPane, size.w + dx);
    Svg.setHeight(this.foPane, size.h + dy + 5);

    this.foPane.setAttribute("transform", "scale(" + this.canvas.zoom + ")");

    //setup font
    this.textEditor.style.marginLeft = "" + dx + "px";
    this.textEditor.style.marginTop = "" + dy + "px";
    this.textEditor.style.width = "" + size.w + "px";

    Svg.setStyle(this.textEditor, "height", this.textEditingInfo.multi ? (size.h + "px") : null);

    this.textEditor.style.fontFamily = this.textEditingInfo.font.family;
    this.textEditor.style.fontSize = this.textEditingInfo.font.size;
    this.textEditor.style.lineHeight = this.textEditingInfo.font.size;
    this.textEditor.style.fontWeight = this.textEditingInfo.font.weight;
    this.textEditor.style.fontStyle = this.textEditingInfo.font.style;
    this.textEditor.style.textAlign = ["left", "center", "right"][align.h];

    this.textEditor.value = this.textEditingInfo.value.value;   //PlainText.value


    this._cachedVisibility = this.textEditingInfo.target.style.visibility;
    //this.textEditingInfo.target.style.visibility = "hidden";
    this.svgElement.style.visibility = "visible";
    this.textEditor.focus();
    this.textEditor.select();
};
OnScreenTextEditor.prototype.handleTextBlur = function (event) {
    this.commitChange();
};
OnScreenTextEditor.prototype.handleKeyPress = function (event) {
    if (event.keyCode == event.DOM_VK_RETURN && !event.shiftKey && !event.accelKey && !event.ctrlKey) {
        this.commitChange();
    } else if (event.keyCode == event.DOM_VK_ESCAPE) {
        this.cancelChange();
    }
};
OnScreenTextEditor.prototype.commitChange = function () {
    if (!this.currentTarget || !this.textEditingInfo) return;
    this.textEditingInfo.target.style.visibility = this._cachedVisibility;
    try {
        var plainText = new PlainText(this.textEditor.value);
        this.currentTarget.setProperty(this.textEditingInfo.prop.name, plainText);
        this.canvas.invalidateEditors(this);
    } finally {
        this.svgElement.style.visibility = "hidden";
        this.textEditingInfo = null;
        this.canvas.focus();
    }
};
OnScreenTextEditor.prototype.cancelChange = function () {
    this.svgElement.style.visibility = "hidden";
    this.textEditingInfo.target.style.visibility = this._cachedVisibility;
    this.textEditingInfo = null;
    this.canvas.focus();
};
Pencil.registerEditor(OnScreenTextEditor);


























