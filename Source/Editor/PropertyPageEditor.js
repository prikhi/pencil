function PropertyPageEditor() {
}

PropertyPageEditor.prototype.install = function (canvas) {
    this.canvas = canvas;
    this.canvas.propertyPageEditor = this;
    this.dialogShown = false;
};
PropertyPageEditor.prototype.onDialogShown = function () {
    this.dialogShown = true;
    this.attach(this._nextTargetObject);
};
PropertyPageEditor.prototype.showAndAttach = function (targetObject) {
    
    if (!this.dialogShown) {
        this._nextTargetObject = targetObject;
        this.propertyWindow = window.openDialog("PropertyDialog.xul", "propertyEditor" + Util.getInstanceToken(), "chrome,dialog,alwaysRaised,dependent", this);
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
        //var strippedGroup = new PropertyGroup();
        var properties = [];
        for (var j in group.properties) {
            var property = group.properties[j];
            var editor = TypeEditorRegistry.getTypeEditor(property.type);
            if (editor) {
                //strippedGroup.properties.push(property);
                properties.push(property);
            }
        }

        //if (strippedGroup.properties.length > 0) {
        if (properties.length > 0) {
            //strippedGroup.name = group.name;
            //strippedGroups.push(strippedGroup);
            for (var k = 0; k < properties.length; k+=3) {
                var strippedGroup = new PropertyGroup();
                strippedGroup.name = group.name;
                for (var l = k; l < k + 3; l++) {
                    if (l < properties.length) {
                        strippedGroup.properties.push(properties[l]);
                    }
                }
                strippedGroups.push(strippedGroup);
            }
        }
    }

    this.groups = strippedGroups;
    this.properties = this.targetObject.getProperties();
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


//@begin interface to PropertyDialog.js
PropertyPageEditor.prototype.getPropertyValue = function (name) {
    return this.targetObject.getProperty(name);
};
PropertyPageEditor.prototype.setPropertyValue = function (name, value) {
    this.targetObject.setProperty(name, value);
};

PropertyPageEditor.prototype.getTargetObjectName = function () {
    return this.targetObject.getName();
};
PropertyPageEditor.prototype.usingQuickMode = function () {
    return false;
};


Pencil.registerEditor(PropertyPageEditor);
