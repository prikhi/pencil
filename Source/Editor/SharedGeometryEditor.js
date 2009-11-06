function SharedGeomtryEditor() {
    this.target = null;
}
SharedGeomtryEditor.PROPERTY_NAME = "box";

SharedGeomtryEditor.prototype.setup = function () {
    //grab control references
    this.shapeXTextBox = document.getElementById("shapeXTextBox");
    this.shapeYTextBox = document.getElementById("shapeYTextBox");
    this.shapeWidthTextBox = document.getElementById("shapeWidthTextBox");
    this.shapeHeightTextBox = document.getElementById("shapeHeightTextBox");
    this.shapeAngleTextBox = document.getElementById("shapeAngleTextBox");
    this.geometryToolbar = document.getElementById("geometryToolbar");

    this.shapeXTextBox.disabled = true;
    this.shapeYTextBox.disabled = true;
    this.shapeWidthTextBox.disabled = true;
    this.shapeHeightTextBox.disabled = true;
    this.shapeAngleTextBox.disabled = true;

    var thiz = this;
    /*
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
    */

    var thiz = this;
    this.geometryToolbar.addEventListener("command", function (event) {
            thiz.handleCommandEvent();
        }, false);
    this.geometryToolbar.addEventListener("change", function (event) {
            thiz.handleCommandEvent();
        }, false);

    this.geometryToolbar.addEventListener("keypressx", function (event) {
            debug(event.keyCode);
            if (event.keyCode == KeyEvent.DOM_VK_RETURN) {
                thiz.handleCommandEvent();
            }
        }, false);
};
SharedGeomtryEditor.prototype.handleCommandEvent = function () {
    debug("xxx");

    var currentGeo = this.targetObject.getGeometry();
    var dx = this.shapeXTextBox.value - currentGeo.ctm.e;
    var dy = this.shapeYTextBox.value - currentGeo.ctm.f;

    var a = Svg.getAngle(currentGeo.ctm.a, currentGeo.ctm.b);
    var da = this.shapeAngleTextBox.value - a;

    Pencil.activeCanvas.run(function () {
        this.targetObject.setPositionSnapshot();
        this.targetObject.moveFromSnapshot(dx, dy);

        var box = this.targetObject.getProperty(SharedGeomtryEditor.PROPERTY_NAME);
        if (box) {
            box.w = this.shapeWidthTextBox.value;
            box.h = this.shapeHeightTextBox.value;

            this.targetObject.setProperty(SharedGeomtryEditor.PROPERTY_NAME, box, "nested, dont add to undo stack");
        }

        var point = Svg.getScreenLocation(this.targetObject.svg);

        var center = { x: currentGeo.dim.w * 0.5, y: currentGeo.dim.h * 0.5};

        var rm = Svg.rotateMatrix(da, center, this.targetObject.svg);
        var geo = Pencil.activeCanvas.getZoomedGeo(this.targetObject);

        var newGeo = new Geometry();
        newGeo.ctm = geo.ctm.multiply(rm);
        newGeo.dim = geo.dim;
        newGeo.loc = null;

        Pencil.activeCanvas.setZoomedGeo(this.targetObject, newGeo);
    }, this);

    Pencil.activeCanvas.invalidateEditors(this);
};

SharedGeomtryEditor.prototype.isDisabled = function () {
    return this.geometryToolbar.getAttribute("disabled") == "true";
};

SharedGeomtryEditor.prototype._applyValue = function () {
    var thiz = this;
    Pencil.activeCanvas.run(function() {
        return;
        this.setProperty(SharedGeomtryEditor.PROPERTY_NAME, thiz.font);
        debug("applied: " + thiz.font);
    }, this.target)
};
SharedGeomtryEditor.prototype.attach = function (targetObject) {
    if (this.isDisabled()) return;
    if (targetObject.constructor == TargetSet) {
        this.detach();
        return;
    }

    this.targetObject = targetObject;

    var geo = this.targetObject.getGeometry();

    this.shapeXTextBox.value = Math.round(geo.ctm.e);
    this.shapeYTextBox.value = Math.round(geo.ctm.f);

    this.shapeWidthTextBox.value = Math.round(geo.dim.w);
    this.shapeHeightTextBox.value = Math.round(geo.dim.h);
    this.shapeAngleTextBox.value = Svg.getAngle(geo.ctm.a, geo.ctm.b);

    this.shapeXTextBox.disabled = false;
    this.shapeYTextBox.disabled = false;
    this.shapeAngleTextBox.disabled = false;

    var box = this.targetObject.getProperty(SharedGeomtryEditor.PROPERTY_NAME);

    this.shapeWidthTextBox.disabled = box ? false : true;
    this.shapeHeightTextBox.disabled = box ? false : true;
};
SharedGeomtryEditor.prototype.detach = function () {
    this.shapeXTextBox.disabled = true;
    this.shapeYTextBox.disabled = true;
    this.shapeWidthTextBox.disabled = true;
    this.shapeHeightTextBox.disabled = true;
    this.shapeAngleTextBox.disabled = true;
};
SharedGeomtryEditor.prototype.invalidate = function () {
    if (!this.target) {
        this.detach();
    } else {
        this.attach(this.target);
    }
}


Pencil.registerSharedEditor(new SharedGeomtryEditor());
