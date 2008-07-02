function PropertyPageEditor() {
}
PropertyPageEditor.typeEditorMap = [];
PropertyPageEditor.registerTypeEditor = function (type, tagName) {
    this.typeEditorMap[type.name] = tagName;
};
PropertyPageEditor.getTypeEditor = function (type) {
    var editor = this.typeEditorMap[type.name];
    if (!editor) return null;
    return editor;
};


PropertyPageEditor.registerTypeEditor(Color, "pcoloreditor");
PropertyPageEditor.registerTypeEditor(Font, "pfonteditor");
PropertyPageEditor.registerTypeEditor(Alignment, "paligneditor");
PropertyPageEditor.registerTypeEditor(StrokeStyle, "pstrokeeditor");
PropertyPageEditor.registerTypeEditor(PlainText, "pplaintexteditor");




PropertyPageEditor.prototype.install = function (canvas) {
    this.canvas = canvas;
    this.canvas.propertyPageEditor = this;
    this.dialogShown = false;
};
PropertyPageEditor.prototype.showAndAttach = function (targetObject) {
    if (!this.dialogShown) {
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        this.propertyWindow = window.open("PropertyDialog.xul", "propertyEditor" + Util.getInstanceToken(), "chrome,dialog,alwaysRaised,dependent");
        
        this.dialogShown = true;

        var thiz = this;
        window.setTimeout(function () { thiz.attach(targetObject); }, 500);
    } else {
        this.attach(targetObject);
    }
};
PropertyPageEditor.prototype.attach = function (targetObject) {
    if (!this.propertyWindow) return;
    try {
        this.dettach();
        this.targetObject = targetObject;
        this.invalidate();

    } catch (e) { alert(e); }
    
};
PropertyPageEditor.prototype.invalidateData = function (targetObject) {
    var definedGroups = this.targetObject.getPropertyGroups();
    
    var strippedGroups = [];
    for (var i in definedGroups) {
        var group = definedGroups[i];
        var strippedGroup = new PropertyGroup();
        for (var j in group.properties) {
            var property = group.properties[j];
            var editor = PropertyPageEditor.getTypeEditor(property.type);
            if (editor) {
                strippedGroup.properties.push(property);
            }
        }
        if (strippedGroup.properties.length > 0) {
            strippedGroup.name = group.name;
            strippedGroups.push(strippedGroup);
        }
    }

    this.groups = strippedGroups;
    this.properties = this.targetObject.getProperties();
    
    window._dialogArgument = this;
};
PropertyPageEditor.prototype.invalidate = function () {
    if (this.propertyWindow) {
        this.invalidateData(); 
        this.propertyWindow.setup();
    }
};
PropertyPageEditor.prototype.dettach = function () {
    try { this.targetObject = null; } catch (e) {}
    if (this.propertyWindow) {
        this.propertyWindow.clean();
    }
};



Pencil.registerEditor(PropertyPageEditor);
