function OnMenuEditor() {
}
OnMenuEditor.typeEditorMap = [];
OnMenuEditor.registerTypeEditor = function (type, editorClass) {
    OnMenuEditor.typeEditorMap[type.name] = editorClass;
};
OnMenuEditor.getTypeEditor = function (type) {
    var editorClass = OnMenuEditor.typeEditorMap[type.name];
    if (!editorClass) return null;
    return editorClass;
};




OnMenuEditor.prototype.install = function (canvas) {
    this.canvas = canvas;
    this.canvas.contextMenuEditor = this;
};
OnMenuEditor.prototype.attach = function (targetObject) {
    this.targetObject = targetObject;

    var definedGroups = this.targetObject.getPropertyGroups();
    
    for (var i in definedGroups) {
        var group = definedGroups[i];
        for (var j in group.properties) {
            var property = group.properties[j];
            var editorClass = OnMenuEditor.getTypeEditor(property.type);
            if (!editorClass) continue;
            
            var editor = new editorClass(property, this.targetObject.getProperty(property.name), this.targetObject);
            var menuitem = editor.createMenuItem(this.canvas.ownerDocument);
            
            this.canvas.insertEditorContextMenuItem(menuitem);
        }
    }
    //actions
    var thiz = this;
    if (targetObject.def && targetObject.performAction) {
        var doc = this.canvas.ownerDocument;
        var menu = doc.createElementNS(PencilNamespaces.xul, "menu");
        menu.setAttribute("label", "Actions");
        
        var popup = doc.createElementNS(PencilNamespaces.xul, "menupopup");
        menu.appendChild(popup);
        var hasAction = false;
        for (var i in targetObject.def.actions) {
            hasAction = true;
            var action = targetObject.def.actions[i];
            var item = doc.createElementNS(PencilNamespaces.xul, "menuitem");
            item.setAttribute("label", action.displayName);
            item._actionId = action.id;
            
            popup.appendChild(item);
        }
        if (hasAction) {
            this.canvas.insertEditorContextMenuItem(menu);
            
            menu.addEventListener("command", function (event) {
                if (event.originalTarget._actionId) {
                    targetObject.performAction(event.originalTarget._actionId);
                    thiz.canvas.invalidateEditors();
                }
            }, false);
        }
    }
};
OnMenuEditor.prototype.invalidate = function () {
};
OnMenuEditor.prototype.dettach = function () {
};


Pencil.registerEditor(OnMenuEditor);
