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
