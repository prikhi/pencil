F = {};
Pencil.findObjectByName = function (ref, name) {
    var shape = Dom.findTop(ref, function (node) {
                    return node.getAttributeNS && node.getAttributeNS(PencilNamespaces.p, "type") == "Shape";
                });
                
    var target = Dom.getSingle(".//*[@p:name='" + name + "']", shape);
    
    return target;
};
F.textSize = function (name) {
    var target = Pencil.findObjectByName(this._target, name);
    if (!target) return new Dimension(0, 0);
    
    var bbox = target.getBBox();
    var dim = new Dimension(bbox.width, bbox.height);
    return dim;
};

F.getRelativeLocation = function (handle, box) {
    if (box.w == 0) return "top";
    
    var y1 = (box.h * handle.x) / box.w;    //y value at the y = h*x/w line
    var y2 = box.h - (box.h * handle.x / box.w); //y value the y = h - h*x/w line
    
    if (handle.y < y1) {
        return handle.y < y2 ? "top" : "right";
    } else {
        return handle.y < y2 ? "left" : "bottom";
    }
};
