function SimpleTextEditor() {
}
SimpleTextEditor.prototype.install = function (canvas) {
    this.canvas = canvas;
    
    var thiz = this;
    this.canvas.drawingLayer.addEventListener("dblclick", function (event) {
        thiz.handleClick(event);
    }, false);
};

SimpleTextEditor.prototype.handleClick = function (event) {
    var editableText = Dom.findUpward(event.originalTarget, function (node) {
        return node.getAttributeNS(PencilNamespaces.p, "editable") == "true";
    });
    
    if (!editableText) return;
    
    event.preventDefault();
    event.cancelBubble = true;
    
    alert(editableText.textContent);
};

//Pencil.registerEditor(SimpleTextEditor);
