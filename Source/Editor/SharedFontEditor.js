function SharedFontEditor() {
    this.target = null;
    this.font = null;
}
SharedFontEditor.PROPERTY_NAME = "textFont";

SharedFontEditor.prototype.setup = function () {
    //grab control references
    this.richTextEditorToolbar = document.getElementById("richTextEditorToolbar");
    this.fontList = document.getElementById("fontList");
    this.pixelFontSize = document.getElementById("pixelFontSize");
    this.boldButton = document.getElementById("edBoldButton");
    this.italicButton = document.getElementById("edItalicButton");
    this.underlineButton = document.getElementById("edUnderlineButton");
    
    var thiz = this;
    this.fontList.addEventListener("command", function(event) {
        if (!thiz.target || !thiz.font || OnScreenTextEditor.isEditing) return;
        thiz.font.family = thiz.fontList.value;
        thiz._applyValue();
    }, false);

    this.pixelFontSize.addEventListener("command", function(event) {
        if (!thiz.target || !thiz.font || OnScreenTextEditor.isEditing) return;
        thiz.font.size = thiz.pixelFontSize.value + "px";
        thiz._applyValue();
    }, false);
    
    this.boldButton.addEventListener("command", function(event) {
        if (!thiz.target || !thiz.font || OnScreenTextEditor.isEditing) return;
        thiz.font.weight = thiz.boldButton.checked ? "bold" : "normal";
        thiz._applyValue();
    }, false);

    this.italicButton.addEventListener("command", function(event) {
        if (!thiz.target || !thiz.font || OnScreenTextEditor.isEditing) return;
        thiz.font.style = thiz.italicButton.checked ? "italic" : "normal";
        thiz._applyValue();
    }, false);
    
    this.underlineButton.addEventListener("command", function(event) {
        if (!thiz.target || !thiz.font || OnScreenTextEditor.isEditing) return;
        thiz.font.decor = thiz.underlineButton.checked ? "underline" : "none";
        thiz._applyValue();
    }, false);
};
SharedFontEditor.prototype._applyValue = function () {
    var thiz = this;
    Pencil.activeCanvas.run(function() {
        this.setProperty(SharedFontEditor.PROPERTY_NAME, thiz.font);
        debug("applied: " + thiz.font);
    }, this.target)
};
SharedFontEditor.prototype.attach = function (target) {
    this.target = target;
    this.font = target.getProperty(SharedFontEditor.PROPERTY_NAME, "any");
    if (!this.font)  {
        this.detach();
        return;
    }
    this.fontList.disabled = false;
    this.pixelFontSize.disabled = false;
    this.boldButton.disabled = false;
    this.italicButton.disabled = false;
    this.underlineButton.disabled = false;
    
    //set the value
    this.fontList.value = this.font.family;
    if (this.font.size.match(/^([0-9]+)[^0-9]*$/)) {
        this.pixelFontSize.value = RegExp.$1;
    }
    this.boldButton.checked = (this.font.weight == "bold");
    this.italicButton.checked = (this.font.style == "italic");
    this.underlineButton.checked = (this.font.decor == "underline");
};
SharedFontEditor.prototype.detach = function () {
    this.fontList.disabled = true;
    this.pixelFontSize.disabled = true;
    this.boldButton.disabled = true;
    this.italicButton.disabled = true;
    this.underlineButton.disabled = true;
    
    this.target = null;
    this.font = null;
};
SharedFontEditor.prototype.attach.invalidate = function () {
    if (!this.target) {
        this.detach();
    } else {
        this.attach(this.target);
    }
}


Pencil.registerSharedEditor(new SharedFontEditor());