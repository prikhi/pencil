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
F.elementSize = function (name) {
    var target = Pencil.findObjectByName(this._target, name);
    if (!target || target.namespaceURI != PencilNamespaces.html) return new Dimension(0, 0);

    var dim = new Dimension(target.offsetWidth, target.offsetHeight);
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
F.newDOMElement = function (spec) {
    var e = spec._uri ? this._target.ownerDocument.createElementNS(spec._uri, spec._name) : this._target.ownerDocument.createElement(spec._name);

    for (name in spec) {
        if (name.match(/^_/)) continue;
        e.setAttribute(name, spec[name]);
    }

    if (spec._text) {
        e.appendChild(e.ownerDocument.createTextNode(spec._text));
    }

    return e;
};
F.newDOMFragment = function (specs) {
    var f = this._target.ownerDocument.createDocumentFragment();

    for (var i in specs) {
        f.appendChild(this.newDOMElement(specs[i]));
    }
    return f;
};

F.thirdPoint = function(a, b, r, m) {
    var ab = Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
    if (ab == 0) return {x: 0, y: 0};

    var l = (m.match && m.match(/^([0-9\.]+)%$/)) ? (ab * parseFloat(RegExp.$1) * 0.01) : m;
    var d = l / ab;

    var c1 = {
        x: (a.x - b.x) * d,
        y: (a.y - b.y) * d
    };

    var c2 = {
        x: c1.x * Math.cos(r) - c1.y * Math.sin(r) + b.x,
        y: c1.x * Math.sin(r) + c1.y * Math.cos(r) + b.y
    };

    return c2;
};
F.lineLength = function(a, b) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
};
F.pieConstraintFunction = function(aa, bb, box) {
    var a = {
        x: aa.x, y: aa.y, toString: function() {
            return this.x + "," + this.y;
        }
    };
    var b = {
        x: bb.x, y: bb.y, toString: function() {
            return this.x + "," + this.y;
        }
    };

    /*debug(bb._fromApplyConstraintFunction);
    debug("lbox: " + F._lastBox);
    debug("box: " + box);

    debug("oldb: "+ F._lastB);
    if (aa._fromApplyConstraintFunction && bb._fromApplyConstraintFunction && F._lastBox && F._lastB) {
        if (F._lastBox.w != box.w || F._lastBox.h != box.h) {
            debug("xxx");
            b.x = F._lastB.x + box.w - F._lastBox.w;
            b.y = F._lastB.y + box.h - F._lastBox.h;
        }
    }
    debug("newb: "+ b);*/

    var r = Math.atan((box.h / 2 - a.y) / (box.w / 2 - a.x));

    //debug("R: "+ r);

    var rx = box.w / 2;
    var ry = box.h / 2;

    var alpha = Math.atan2(b.y - ry, b.x - rx);

    //debug("angle: " + [b.x, b.y, rx, ry, alpha * 180 / Math.PI]);

    var co = Math.cos(alpha);
    var si = Math.sin(alpha);

    var m = Math.sqrt(ry * ry * co * co + rx * rx * si * si);
    var r = rx * ry / m;

    var x = r * co + rx;
    var y = r * si + ry;

    //debug("X: " + x + ", Y: " + y);
    F._lastBox = box;
    F._lastB = b;

    return {
        x: x, y: y
    };
};
// get angle made by vector v1 and v2
F.angle = function(v1, v2) {
    var cosa = (v1.x*v2.x + v1.y*v2.y) / (Math.sqrt(v1.x*v1.x + v1.y*v1.y) * Math.sqrt(v2.x*v2.x + v2.y*v2.y));
    var r = Math.acos(cosa);
    return r;
};
F.reflect = function(x, o) {
    return {
        x: 2*o.x - x.x,
        y: 2*o.y - x.y
    };
};
F.debug = function(o) {
    debug(o);
};
