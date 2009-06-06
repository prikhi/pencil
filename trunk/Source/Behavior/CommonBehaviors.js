Pencil.behaviors.Attr = function (name, value, ns) {
    if (value != null) {
        if (ns) this.setAttributeNS(ns, name, value);
        else this.setAttribute(name, value);
    } else {
        if (ns) this.removeAttributeNS(ns, name);
        else this.removeAttribute(name);
    }
};
Pencil.behaviors.Box = function (box) {
    Svg.setWidth(this, box.w);
    Svg.setHeight(this, box.h);
};
Pencil.behaviors.Bound = function (bound) {
    this.setAttribute("x", bound.x);
    this.setAttribute("y", bound.y);
    this.setAttribute("width", bound.w);
    this.setAttribute("height", bound.h);
};
Pencil.behaviors.Radius = function (rx, ry) {
    this.setAttribute("rx", rx);
    this.setAttribute("ry", ry);
};
Pencil.behaviors.StopColor = function (color) {
    Svg.setStyle(this, "stop-color", color.toRGBString());
    Svg.setStyle(this, "stop-opacity", color.a);
};
Pencil.behaviors.Offset = function (offset) {
    this.setAttribute("offset", offset);
};
Pencil.behaviors.Fill = function (color) {
    Svg.setStyle(this, "fill", color.toRGBString());
    Svg.setStyle(this, "fill-opacity", color.a);
};
Pencil.behaviors.Color = function (color) {
    Svg.setStyle(this, "color", color.toRGBString());
    Svg.setStyle(this, "opacity", color.a);
};
Pencil.behaviors.StrokeColor = function (color) {
    Svg.setStyle(this, "stroke", color.toRGBString());
    Svg.setStyle(this, "stroke-opacity", color.a);
};
Pencil.behaviors.StrokeStyle = function (strokeStyle) {
    Svg.setStyle(this, "stroke-width", strokeStyle.w);
    if (strokeStyle.array) {
        Svg.setStyle(this, "stroke-dasharray", strokeStyle.array);
    } else {
        Svg.removeStyle(this, "stroke-dasharray");
    }
};
Pencil.behaviors.Visibility = function (bool) {
    var value = bool;
    if (bool && bool.constructor == Bool) value = bool.value;
    Svg.setStyle(this, "visibility", value ? "visible" : "hidden");
};
Pencil.behaviors.ApplyFilter = function (bool) {
    var value = bool;
    if (bool && bool.constructor == Bool) value = bool.value;
    if (value) {
        if (this.hasAttribute("filter")) return;
        if (!this.hasAttributeNS(PencilNamespaces.p, "filter")) return;
        
        var filter = this.getAttributeNS(PencilNamespaces.p, "filter");
        this.setAttribute("filter", filter);
    } else {
        this.removeAttribute("filter");
    }
};
Pencil.behaviors._createUnderline = function(text) {
    var id = text.getAttribute("id") + "_underline";
    var underline = text.ownerDocument.getElementById(id);
    if (!underline) {
        underline = text.ownerDocument.createElementNS(PencilNamespaces.svg, "path");
        underline.setAttribute("id", id);
        underline.setAttribute("style", "fill: none; stroke-width: 1px;");
        Dom.appendAfter(underline, text);
    }
    
    return underline;
};
Pencil.behaviors.AccelFor = function (textName, font, color, textContent) {
    try {
        var text = Pencil.findObjectByName(F._target, textName);
        var index = textContent.value.indexOf("&");
        if (index < 0 || textContent.value.charAt(index + 1) == '&') {
            Svg.setStyle(this, "visibility", "hidden");
            return;
        }
        Svg.setStyle(this, "visibility", "visible");
        
        Svg.setStyle(this, "stroke", color.toRGBString());
        Svg.setStyle(this, "stroke-opacity", color.a);

        var start = text.getStartPositionOfChar(index);
        var extend = text.getExtentOfChar(index);
        var bbox = text.getBBox();

        debug("extend.height: " + extend.height);
        var dLiteral = [M(start.x, bbox.y + bbox.height + 1.5), L(start.x + extend.width, bbox.y + bbox.height + 1.5)];
        this.setAttribute("d", dLiteral.join(" "));
        
    } catch (e) {
        Console.dumpError(e, "stdout");
    }
}
Pencil.behaviors.Font = function (font) {
    Svg.setStyle(this, "font-family", font.family);
    Svg.setStyle(this, "font-size", font.size);
    Svg.setStyle(this, "font-weight", font.weight);
    Svg.setStyle(this, "font-style", font.style);
    Svg.setStyle(this, "text-decoration", font.decor);
    
    //locate the path that makes the underline
    
    var underline = Pencil.behaviors._createUnderline(this);
    
    Svg.setStyle(underline, "visibility", font.isUnderlined() ? "visible" : "hidden");
    if (font.isUnderlined()) {
        var bbox = this.getBBox();
        var dLiteral = [M(bbox.x, bbox.y + bbox.height + 1.5), L(bbox.x + bbox.width, bbox.y + bbox.height + 1.5)];
        underline.setAttribute("d", dLiteral.join(" "));

        try {
            var color = Svg.getStyle(this, "fill");
            Svg.setStyle(underline, "stroke", color);
            Svg.setStyle(underline, "stroke-opacity", Svg.getStyle(this, "fill-opacity"));
        } catch (e) {
            Console.dumpError(e, "stdout");
        }
    }
};
Pencil.behaviors.BoxFit = function (bound, align) {
    try {
        var isText = (this.localName == "text");
        if (isText) {
            Svg.setStyle(this, "dominant-baseline", "auto");
            var bbox = this.getBBox();
            
            var x = Math.round(((bound.w - bbox.width) * align.h) / 2 + bound.x);
            
            var baseLineDiff = bbox.height / 2;
            
            if (this.hasAttribute("y")) {
                var realY = parseInt(this.getAttribute("y"), 10);
                baseLineDiff = realY - bbox.y;
            }
            var y = Math.round(((bound.h - bbox.height) * align.v) / 2 + bound.y + baseLineDiff);
            this.setAttribute("x", x);
            this.setAttribute("y", y);
        } else {
            Svg.setWidth(this, bound.w);
            Svg.setHeight(this, 500);
            var h = this.firstChild.scrollHeight;
            Svg.setHeight(this, h);
            
            Svg.setX(this, bound.x);
            var y = Math.round(((bound.h - h) * align.v) / 2 + bound.y);
            Svg.setY(this, y);
            
            Svg.setStyle(this, "text-align", ["left", "center", "right"][align.h]);
            
        }
    } catch (e) {
    }
};
Pencil.behaviors.D = function (dLiteral) {
    var s = typeof(dLiteral) == "string" ? dLiteral : (dLiteral.join ? dLiteral.join(" ") : "");
    this.setAttribute("d", s);
};
Pencil.behaviors.Scale = function (x, y) {
    this.setAttribute("transform", "scale(" + [x, y] + ")");
}
Pencil.behaviors.Transform = function (s) {
    var t = s.join ? s.join(" ") : s;
    this.setAttribute("transform", t);
}
//D objects
function M(x, y) {
    return "M " + x + " " + y;
}
function L(x, y) {
    return "L " + x + " " + y;
}
function C(x1, y1, x2, y2, x, y) {
    return "C " + x1 + " " + y1 + " " + x2 + " " + y2 + " " + x + " " + y;
}
function S(x2, y2, x, y) {
    return "S " + x2 + " " + y2 + " " + x + " " + y;
}
var z = "z";

function rotate(a) {
    return "rotate(" + a + ")";
}
function translate(x, y) {
    return "translate(" + [x, y] + ")";
}
function scale(x, y) {
    return "scale(" + [x, y] + ")";
}

Pencil.behaviors.TextContent = function (text, stripAccel) {
    Dom.empty(this);
    var isText = (this.localName == "text");
    
    if (isText) {
        this.appendChild(this.ownerDocument.createTextNode(text.value ? (stripAccel ? text.value.replace(/&/, "") : text.value) : " "));
    } else {
        //create an empty div containing the text
        var html = (text.constructor == RichText) ? text.html : text.value;
        var divHTML = "<div xmlns=\"" + PencilNamespaces.html + "\">" + html + "</div>";
        var div = Dom.parseToNode(divHTML, this.ownerDocument);
        
        if (div) this.appendChild(div);
        
    }
};
Pencil.behaviors.DomContent = function (xmlText) {
    Dom.empty(this);

    var domNode = Dom.parseToNode(xmlText.value, this.ownerDocument);
    
    if (domNode) this.appendChild(domNode);
};
Pencil.behaviors.RichTextFit = function (width) {
    Svg.setWidth(this, width);
    Svg.setHeight(this, 900);
    Svg.setHeight(this, Math.ceil(this.firstChild.scrollHeight));
};
Pencil.behaviors.Image = function (imageData) {
    this.setAttributeNS(PencilNamespaces.xlink, "xlink:href", imageData.data);
    Svg.setWidth(this, imageData.w);
    Svg.setHeight(this, imageData.h);
};
Pencil.behaviors.EllipseFit = function (box) {
    this.setAttribute("cx", box.w / 2);
    this.setAttribute("cy", box.h / 2);
    this.setAttribute("rx", box.w / 2);
    this.setAttribute("ry", box.h / 2);
};











