function Group(canvas, svg) {
    this.svg = svg;
    this.canvas = canvas;
    
    this.targets = [];
    var thiz = this;
    Dom.workOn("./svg:g[@p:type]", this.svg, function (node) {
        var controller = thiz.canvas.createControllerFor(node);
        thiz.targets.push(controller);
    });

    var propertyGroup = new PropertyGroup();
    propertyGroup.name = "Properties";
    
    var firstGroups = this.targets[0].getPropertyGroups();
    
    for (g in firstGroups) {
        for (p in firstGroups[g].properties) {
            var propDef = firstGroups[g].properties[p];
            
            var ok = true;
            for (var i = 1; i < this.targets.length; i++) {
                var target = this.targets[i];
                var propGroups = target.getPropertyGroups();
                
                var found = false;
                for (g1 in propGroups) {
                    for (p1 in propGroups[g1].properties) {
                        var def = propGroups[g1].properties[p1];
                        
                        if (propDef.isSimilarTo(def)) {
                            found = true;
                            break;
                        }
                    }
                    if (found) break;
                }
                
                if (!found) {
                    ok = false;
                    break;
                }
            }
            if (!ok) continue;
            
            propertyGroup.properties.push(propDef);
        }
    }
    
    this.propertyGroup = propertyGroup;
    
}
Group.prototype.getName = function () {
    return "Group";
};
Group.prototype.isFor = function (svg) {
    return this.svg == svg;
};
Group.prototype.getProperties = function () {
    var properties = {};
    for (var p in this.propertyGroup.properties) {
        var name = this.propertyGroup.properties[p].name;
        properties[name] = this.getProperty(name);
    }
    
    return properties;
};
Group.prototype.getPropertyGroups = function () {
    return [this.propertyGroup];
};
Group.prototype.setProperty = function (name, value) {
    for (t in this.targets) {
        this.targets[t].setProperty(name, value);
    }
};
Group.prototype.getProperty = function (name) {
    if (name == "box") return null;
    var firstValue = this.targets[0].getProperty(name);
    if (!firstValue) return null;
    var same = true;
    for (var i = 1; i < this.targets.length; i ++) {
        var target = this.targets[i];
        var value = target.getProperty(name);
        
        if (value == null) return null;
        if (firstValue.toString() != value.toString()) {
            same = false;
            break;
        }
    }
    
    return same ? firstValue : null;
};
Group.TRANSLATE_REGEX = /^translate\(([\-0-9]+)\,([\-0-9]+)\)$/
Group.prototype.getGeometry = function () {
    var bound = this.getBoundingRect();
    var geo = new Geometry();
    geo.ctm = this.svg.ownerSVGElement.createSVGMatrix();
    geo.ctm.e = bound.x / this.canvas.zoom;
    geo.ctm.f = bound.y / this.canvas.zoom;
    
    geo.dim = {};
    geo.dim.w = bound.width / this.canvas.zoom;
    geo.dim.h = bound.height / this.canvas.zoom;
    
    return geo;
};
Group.prototype.getBoundingRect = function () {
    var rect = null;
    var thiz = this;
    for (t in this.targets) {
        var childRect = this.targets[t].getBoundingRect();
        rect = rect ? Svg.joinRect(rect, childRect) : childRect;
    }
    
    return rect;
};
Group.prototype.setGeometry = function (geo) {
    var thiz = this;
    for (t in this.targets) {
        var childRect = this.targets[t].getBoundingRect();
        //TODO: impl. this
    }
};

Group.prototype.moveBy = function (x, y, zoomAware) {
    var thiz = this;
    for (t in this.targets) {
        this.targets[t].moveBy(x, y, zoomAware ? true : false);
    }
};

Group.prototype.setPositionSnapshot = function () {
    for (i in this.targets) this.targets[i].setPositionSnapshot();
};
Group.prototype.moveFromSnapshot = function (dx, dy) {
    for (i in this.targets) this.targets[i].moveFromSnapshot(dx, dy, "dontNormalize");
};
Group.prototype.clearPositionSnapshot = function () {
    for (i in this.targets) this.targets[i].clearPositionSnapshot();
};


Group.prototype.deleteTarget = function () {
    this.svg.parentNode.removeChild(this.svg);
};
Group.prototype.bringForward = function () {
    try {
        var next = this.svg.nextSibling;
        if (next) {
            var parentNode = this.svg.parentNode;
            parentNode.removeChild(this.svg);
            var next2 = next.nextSibling;
            if (next2) {
                parentNode.insertBefore(this.svg, next2);
            } else {
                parentNode.appendChild(this.svg);
            }
        }
    } catch (e) { alert(e); }
};
Group.prototype.bringToFront = function () {
    try {
        var next = this.svg.nextSibling;
        if (next) {
            var parentNode = this.svg.parentNode;
            parentNode.removeChild(this.svg);
            parentNode.appendChild(this.svg);
        }
    } catch (e) { alert(e); }
};
Group.prototype.sendBackward = function () {
    try {
        var previous = this.svg.previousSibling;
        if (previous) {
            var parentNode = this.svg.parentNode;
            parentNode.removeChild(this.svg);
            parentNode.insertBefore(this.svg, previous);
        }
    } catch (e) { alert(e); }
};
Group.prototype.sendToBack = function () {
    try {
        var previous = this.svg.previousSibling;
        if (previous) {
            var parentNode = this.svg.parentNode;
            parentNode.removeChild(this.svg);
            parentNode.insertBefore(this.svg, parentNode.firstChild);
        }
    } catch (e) { alert(e); }
};

Group.prototype.getTextEditingInfo = function () {
    var info = null;
    return info;
};

Group.prototype.createTransferableData = function () {
    return {type: ShapeXferHelper.MIME_TYPE,
            isSVG: true,
            dataNode: this.svg.cloneNode(true)
           };
};
Group.prototype.lock = function () {
    this.svg.setAttributeNS(PencilNamespaces.p, "p:locked", "true");
};

Group.prototype.markAsMoving = function (moving) {
    Svg.optimizeSpeed(this.svg, moving);
};




