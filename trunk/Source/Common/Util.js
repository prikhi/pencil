// Copyright (c) Evolus Solutions. All rights reserved.
// License: GPL/MPL
// $Id$

/* class */ function Dom() {
}

/* static int */ Dom.workOn = function (xpath, node, worker) {
    var nodes = Dom.getList(xpath, node);

    for (var i = 0; i < nodes.length; i ++) {
        worker(nodes[i]);
    }
    return nodes.length;
};
/* static int */ Dom.getText = function (node) {
    return node.textContent;
};

/* static Node */ Dom.getSingle = function (xpath, node) {
    var doc = node.ownerDocument ? node.ownerDocument : node;
    var xpathResult = doc.evaluate(xpath, node, PencilNamespaces.resolve, XPathResult.ANY_TYPE, null);
    return xpathResult.iterateNext();
};
/* static Node[] */ Dom.getList = function (xpath, node) {
    var doc = node.ownerDocument ? node.ownerDocument : node;
    var xpathResult = doc.evaluate(xpath, node, PencilNamespaces.resolve, XPathResult.ANY_TYPE, null);
    var nodes = [];
    var next = xpathResult.iterateNext();
    while (next) {
        nodes.push(next);
        next = xpathResult.iterateNext();
    }

    return nodes;
}
/* public static XmlDocument */ Dom.getImplementation = function () {
    return document.implementation;
};
/* public static XmlDocument */ Dom.loadSystemXml = function (relPath) {
    var doc = Dom.getImplementation().createDocument("", "", null);
    doc.async = false;
    doc.load(relPath);

    return doc;
};

Dom.registerEvent = function (target, event, handler, capture) {
    var useCapture = false;
    if (capture) {
        useCapture = true;
    }
    target.addEventListener(event, handler, useCapture);
};

Dom.disableEvent = function (node, event) {
    Dom.registerEvent(node, event, function(ev) {Dom.cancelEvent(ev);}, true );
};

Dom.findUpward = function (node, evaluator) {
    try {
        if (node == null) {
            return null;
        }
        if (evaluator(node)) {
            return node;
        }
        return Dom.findUpward(node.parentNode, evaluator);
    } catch (e) { return null; }
};
Dom.doUpward = function (node, evaluator, worker) {
    if (node == null) {
        return;
    }
    if (evaluator(node)) {
        worker(node);
    }
    return Dom.doUpward(node.parentNode, evaluator, worker);
};
Dom.findTop = function (node, evaluator) {
    var top = null;
    try {
        Dom.doUpward(node, evaluator, function (node) {
            top = node;
        });
    } catch (e) {}

    return top;
};

Dom.emitEvent = function (name, target, data) {
    var event = target.ownerDocument.createEvent("Events");
    event.initEvent(name, true, false);
    if (data) {
        for (name in data) event[name] = data[name];
    }
    target.dispatchEvent(event);
};

Dom.empty = function (node) {
    if (!node || !node.hasChildNodes) return;
    while (node.hasChildNodes()) node.removeChild(node.firstChild);
};
Dom.parser = new DOMParser();
Dom.serializer = new XMLSerializer();
Dom.parseToNode = function (xml, dom) {
    var doc = Dom.parser.parseFromString(xml, "text/xml");
    if (!doc || !doc.documentElement
             || doc.documentElement.namespaceURI == "http://www.mozilla.org/newlayout/xml/parsererror.xml") {
        return null;
    }
    var node = doc.documentElement;
    if (dom) return dom.importNode(node, true);

    return node;
}
Dom.serializeNode = function (node) {
    return Dom.serializer.serializeToString(node);
};
Dom.serializeNodeToFile = function (node, file, additionalContentPrefixes) {
    var fos = Components.classes["@mozilla.org/network/file-output-stream;1"]
                             .createInstance(Components.interfaces.nsIFileOutputStream);
    fos.init(file, 0x02 | 0x08 | 0x20, 0666, 0);

    var os = Components.classes["@mozilla.org/intl/converter-output-stream;1"]
                       .createInstance(Components.interfaces.nsIConverterOutputStream);

    // This assumes that fos is the nsIOutputStream you want to write to
    os.init(fos, XMLDocumentPersister.CHARSET, 0, 0x0000);

    if (node.nodeType != Node.DOCUMENT_NODE) {
        os.writeString("<?xml version=\"1.0\"?>\n");
    }
    if (additionalContentPrefixes) {
        os.writeString(additionalContentPrefixes + "\n");
    }

    Dom.serializer.serializeToStream(node, fos, XMLDocumentPersister.CHARSET);

    fos.close();
};
Dom._buildHiddenFrame = function () {
    if (Dom._hiddenFrame) return;

    var iframe = document.createElementNS(PencilNamespaces.html, "html:iframe");

    var container = document.body;
    if (!container) container = document.documentElement;
    var box = document.createElement("box");
    box.setAttribute("style", "xvisibility: hidden");

    iframe.setAttribute("style", "border: none; width: 1px; height: 1px; xvisibility: hidden");
    iframe.setAttribute("src", "blank.html");

    box.appendChild(iframe);
    container.appendChild(box);

    box.style.MozBoxPack = "start";
    box.style.MozBoxAlign = "start";

    Dom._hiddenFrame = iframe.contentWindow;
    Dom._hiddenFrame.document.body.setAttribute("style", "padding: 0px; margin: 0px;")
};
Dom.toXhtml = function (html) {
    Dom._buildHiddenFrame();

    var body = Dom._hiddenFrame.document.body;

    body.innerHTML = "";

    var div = body.ownerDocument.createElementNS(PencilNamespaces.html, "div");
    body.appendChild(div);

    div.innerHTML = html;

    var xhtml = Dom.serializeNode(div);
    xhtml = xhtml.replace(/(<[^>]+) xmlns=""([^>]*>)/g, function (zero, one, two) {
        return one + two;
    });
    xhtml = xhtml.replace(/<[\/A-Z0-9]+[ \t\r\n>]/g, function (zero) {
        return zero.toLowerCase();
    });
    return xhtml;
};
Dom.htmlEncode = function (text) {
    Dom._buildHiddenFrame();

    var body = Dom._hiddenFrame.document.body;

    body.innerHTML = "";
    body.appendChild(body.ownerDocument.createTextNode(text));
    return body.innerHTML;
};
Dom.renewId = function (shape) {
    var seed = Math.round(Math.random() * 1000);
    Dom.workOn(".//*/@id", shape, function (node) {
        debug(" -> working on node.value = " + node.value + ", seed: " + seed);
        node.value = node.value + seed;
        debug(" -> working on node.value = " + node.value);
    });
    Dom.resolveIdRef(shape, seed);
};
Dom.resolveIdRef = function (shape, seed) {
    Dom.workOn(".//*/@p:filter | .//*/@style | .//*/@xlink:href | .//*/@clip-path | .//*/@marker-end | .//*/@marker-start | .//*/@mask", shape, function (node) {
        var value = node.value;
        if (value.substring(0, 1) == "#") {
            value += seed;
        } else {
            value = value.replace(/url\(#([^\)]+)\)/g, function (zero, one) {
                return "url(#" + one + seed + ")";
            });
        }
        node.value = value;
    });
};

Dom.handleAttributeChange = function(node, attributeName, handler) {
    node.addEventListener("DOMAttrModified", function(event) {
        if (event.attrName == attributeName) {
            handler(event.prevValue, event.newValue);
        }
    }, false);
};

Dom.appendAfter = function (fragment, node) {
    if (!node.parentNode) {
        return;
    }
    if (node.nextSibling) {
        node.parentNode.insertBefore(fragment, node.nextSibling);
    } else {
        node.parentNode.appendChild(fragment);
    }
};
Dom.swapNode = function (node1, node2) {
    var parentNode = node1.parentNode;

    var ref = node2.nextSibling;
    if (ref == node1) {
        debug("****, simple swap: " + [node1.label, node2.label]);
        parentNode.removeChild(node1);
        parentNode.insertBefore(node1, node2);

        return;
    }
    parentNode.removeChild(node2);
    parentNode.insertBefore(node2, node1);

    parentNode.removeChild(node1);
    parentNode.insertBefore(node1, ref);
};
Dom.parseFile = function (file) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalFileRead");

    var fileContents = FileIO.read(file, "UTF-8");
    var dom = Dom.parser.parseFromString(fileContents, "text/xml");

    return dom;
};

Dom.newDOMElement = function (spec, doc) {
    var ownerDocument = doc ? doc : document;
    var e = spec._uri ? ownerDocument.createElementNS(spec._uri, spec._name) : ownerDocument.createElement(spec._name);

    for (name in spec) {
        if (name.match(/^_/)) continue;
        e.setAttribute(name, spec[name]);
    }

    if (spec._text) {
        e.appendChild(e.ownerDocument.createTextNode(spec._text));
    }
    if (spec._children && spec._children.length > 0) {
        e.appendChild(Dom.newDOMFragment(spec._children, e.ownerDocument));
    }

    return e;
};
Dom.newDOMFragment = function (specs, doc) {
    var ownerDocument = doc ? doc : document;
    var f = ownerDocument.createDocumentFragment();

    for (var i in specs) {
        f.appendChild(Dom.newDOMElement(specs[i], ownerDocument));
    }
    return f;
};

var Svg = {};
Svg.setX = function (node, x) {
    node.x.baseVal.value = x;
};
Svg.setY = function (node, y) {
    node.y.baseVal.value = y;
};

Svg.setWidth = function (node, w) {
    node.width.baseVal.value = w;
};
Svg.setHeight = function (node, h) {
    node.height.baseVal.value = h;
};
Svg.setStyle = function (node, name, value) {
    if (value == null) {
        node.style.removeProperty(name);
        return;
    }
    node.style.setProperty(name, value, "");
};
Svg.getStyle = function (node, name) {
    return node.style.getPropertyValue(name, "");
};
Svg.removeStyle = function (node, name) {
    node.style.removeProperty(name);
};
Svg.toTransformText = function (matrix) {
    return "matrix(" + [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f].join(",") + ")";
};
Svg.ensureCTM = function (node, matrix) {
    //FIXME: this works when no parent transformation applied. fix this later

    var s = Svg.toTransformText(matrix);
    node.setAttribute("transform", s);
};
Svg.pointInCTM = function (x, y, ctm) {
    return {
        x: ctm.a * x + ctm.c * y + ctm.e,
        y: ctm.b * x + ctm.d * y + ctm.f
    };
};

Svg.vectorInCTM = function (point, userCTM, noTranslation) {
    var ctm = userCTM.inverse();

    var uPoint = new Point();
    uPoint.x = ctm.a * point.x + ctm.c * point.y + (noTranslation ? 0 : ctm.e);
    uPoint.y = ctm.b * point.x + ctm.d * point.y + (noTranslation ? 0 : ctm.f);

    return uPoint;
};
Svg.getCTM = function (target) {
    return target.getTransformToElement(target.ownerSVGElement);
};
Svg.rotateMatrix = function (angle, center, element) {
    var matrix = element.ownerSVGElement.createSVGTransform().matrix;
    matrix = matrix.translate(center.x, center.y);
    matrix = matrix.rotate(angle);
    matrix = matrix.translate(0 - center.x, 0 - center.y);

    return matrix;
};
Svg.getScreenLocation = function(element, point) {
    var sctm = element.getScreenCTM().inverse();
    return Svg.vectorInCTM(point ? point : new Point(0, 0), sctm);
};

Svg.getAngle = function (dx, dy) {
    return Math.atan2(dy, dx) * 180 / Math.PI;
};

Svg.getRelativeAngle = function (from, to, center) {
    var startAngle = Svg.getAngle(from.x - center.x, from.y - center.y);
    var endAngle = Svg.getAngle(to.x - center.x, to.y - center.y);

    return endAngle - startAngle;
};
Svg.ensureRectContains = function (rect, point) {
    rect.left = Math.min(rect.left, point.x);
    rect.right = Math.max(rect.right, point.x);
    rect.top = Math.min(rect.top, point.y);
    rect.bottom = Math.max(rect.bottom, point.y);
};
Svg.getBoundRectInCTM = function (box, ctm) {
    var p = Svg.vectorInCTM({x: box.x, y: box.y}, ctm);

    var rect = {left: p.x, right: p.x, top: p.y, bottom: p.y};


    p = Svg.vectorInCTM({x: box.x + box.width, y: box.y}, ctm);
    Svg.ensureRectContains(rect, p);

    p = Svg.vectorInCTM({x: box.x, y: box.y + box.height}, ctm);
    Svg.ensureRectContains(rect, p);

    p = Svg.vectorInCTM({x: box.x + box.width, y: box.y + box.height}, ctm);
    Svg.ensureRectContains(rect, p);

    return rect;
};
Svg.joinRect = function (rect1, rect2) {
    var minX = Math.min(rect1.x, rect2.x);
    var minY = Math.min(rect1.y, rect2.y);

    var maxX = Math.max(rect1.x + rect1.width, rect2.x + rect2.width);
    var maxY = Math.max(rect1.y + rect1.height, rect2.y + rect2.height);

    return {x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY};
};
Svg.expandRectTo = function (rect, p) {
    if (p.x < rect.x) {
        rect.width += rect.x - p.x;
        rect.x = p.x;
    } else if (p.x > rect.x + rect.width) {
        rect.width = p.x - rect.x;
    }
    
    if (p.y < rect.y) {
        rect.height += rect.y - p.y;
        rect.y = p.y;
    } else if (p.y > rect.y + rect.height) {
        rect.height = p.y - rect.y;
    }
};
Svg.contains = function (x, y, large) {
    return (large.x <= x && x <= large.x + large.width) &&
            (large.y <= y && y <= large.y + large.height);
};
Svg.isInside = function (small, large) {
    return Svg.contains(small.x, small.y, large) && Svg.contains(small.x + small.width, small.y + small.height, large);
};

Svg.optimizeSpeed = function(target, on) {
    return;
    if (on) {
        target.setAttributeNS(PencilNamespaces.p, "p:moving", true);
    } else {
        target.removeAttributeNS(PencilNamespaces.p, "moving");
    }
};


Local = {};
Local.getInstalledFonts = function () {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");

    var localFonts;
    var enumerator = Components.classes["@mozilla.org/gfx/fontenumerator;1"]
                             .getService(Components.interfaces.nsIFontEnumerator);
    var localFontCount = { value: 0 }
    localFonts = enumerator.EnumerateAllFonts(localFontCount);

    Local.cachedLocalFonts = localFonts;

    return localFonts;
};
Local.isFontExisting = function (font) {
    if (!Local.cachedLocalFonts) {
        Local.getInstalledFonts();
    }
    for (var i in Local.cachedLocalFonts) {
        if (Local.cachedLocalFonts[i] == font) return true;
    }

    return false;
};
Local.openExtenstionManager = function() {
    const EMTYPE = "Extension:Manager";
    var wm = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
    var theEM = wm.getMostRecentWindow(EMTYPE);
    if (theEM) {
        theEM.focus();
        return;
    }
    const EMURL = "chrome://mozapps/content/extensions/extensions.xul";
    const EMFEATURES = "chrome,menubar,extra-chrome,toolbar,dialog=no,resizable";
    window.openDialog(EMURL, "", EMFEATURES);
};
Local.newTempFile = function (prefix, ext) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var file = Components.classes["@mozilla.org/file/directory_service;1"].
                         getService(Components.interfaces.nsIProperties).
                         get("TmpD", Components.interfaces.nsIFile);
    var seed = Math.round(Math.random() * 1000000);

    file.append(prefix + "-" + seed + "." + ext);

    return file;
};

var Console = {};
Console.log = function (message) {
    //if (console && console.log) console.log(message);
};
Console.dumpError = function (exception, toConsole) {
    var s = [
        exception.message,
        "",
        "Location: " + exception.fileName + " (" + exception.lineNumber + ")",
        "Stacktrace:\n\t" + (exception.stack ? exception.stack.replace(/\n/g, "\n\t") : "<empty stack trace>")
    ].join("\n");

    if (true) {
        debug(s);
    } else {
        alert(s);
    }
};

var Util = {};
Util.instanceToken = "" + (new Date()).getTime();
Util.getInstanceToken = function () {
    return Util.instanceToken;
};

Util.gridNormalize = function (value, size) {
    var r = value % size;
    if (r == 0) return value;

    if (r > size / 2) {
        return value + size - r;
    } else {
        return value - r;
    }
};
Util.enumInterfaces = function (object) {
    var ifaces = [];
    for (name in Components.interfaces) {
        var iface = Components.interfaces[name];
        try {
            var o = object.QueryInterface(iface);
            if (o) ifaces.push(iface);
        } catch (e) {}
    }

    return ifaces;

};
Util.handleTempImageLoad = function () {
    if (Util.handleTempImageLoadImpl) Util.handleTempImageLoadImpl();
};
Util.ios = Components.classes["@mozilla.org/network/io-service;1"]
                        .getService(Components.interfaces.nsIIOService);

Util.getClipboardImage = function (clipData, length, handler) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");

    var dataStream = clipData.QueryInterface(Components.interfaces.nsIInputStream);

    var bStream = Components.classes["@mozilla.org/binaryinputstream;1"]
                            .createInstance(Components.interfaces.nsIBinaryInputStream);
    bStream.setInputStream(dataStream);
    var bytes = bStream.readBytes(bStream.available());

    //create a temp file to save
    var file = Components.classes["@mozilla.org/file/directory_service;1"]
                         .getService(Components.interfaces.nsIProperties)
                         .get("TmpD", Components.interfaces.nsIFile);
    file.append("pencil-clipboard-image.png");

    var fos = Components.classes["@mozilla.org/network/file-output-stream;1"]
                             .createInstance(Components.interfaces.nsIFileOutputStream);
    fos.init(file, 0x02 | 0x08 | 0x20, 0666, 0);

    fos.write(bytes, bytes.length);
    fos.close();

    if (!Util.ios) {
        Util.ios = Components.classes["@mozilla.org/network/io-service;1"]
                        .getService(Components.interfaces.nsIIOService);

    }
    var url = Util.ios.newFileURI(file).spec;

    url += "?t=" + (new Date()).getTime();

    ImageData.fromUrlEmbedded(url, function (imageData) {
        handler(imageData.w, imageData.h, imageData.data);
    });
};

Util.info = function(title, description, buttonLabel) {
    var message = {type: "info",
                    title: title,
                    description: description ? description : null,
                    acceptLabel: buttonLabel ? buttonLabel : null };

    var returnValueHolder = {};
    var dialog = window.openDialog("MessageDialog.xul", "pencilMessageDialog" + Util.getInstanceToken(), "modal,centerscreen", message, returnValueHolder);
}
Util.error = function(title, description, buttonLabel) {
    var message = {type: "error",
                    title: title,
                    description: description ? description : null,
                    acceptLabel: buttonLabel ? buttonLabel : null };

    var returnValueHolder = {};
    var dialog = window.openDialog("MessageDialog.xul", "pencilMessageDialog" + Util.getInstanceToken(), "modal,centerscreen", message, returnValueHolder);
}
Util.confirm = function(title, description, acceptLabel, cancelLabel) {
    var message = {type: "confirm",
                    title: title,
                    description: description ? description : null,
                    acceptLabel: acceptLabel ? acceptLabel : null,
                    cancelLabel: cancelLabel ? cancelLabel : null };

    var returnValueHolder = {};
    var dialog = window.openDialog("MessageDialog.xul", "pencilMessageDialog" + Util.getInstanceToken(), "modal,centerscreen", message, returnValueHolder);
    return returnValueHolder.button == "accept";
}
Util.confirmWithWarning = function(title, description, acceptLabel, cancelLabel) {
    var message = {type: "confirmWarned",
                    title: title,
                    description: description ? description : null,
                    acceptLabel: acceptLabel ? acceptLabel : null,
                    cancelLabel: cancelLabel ? cancelLabel : null };

    var returnValueHolder = {};
    var dialog = window.openDialog("MessageDialog.xul", "pencilMessageDialog" + Util.getInstanceToken(), "modal,centerscreen", message, returnValueHolder);
    return returnValueHolder.button == "accept";
}
Util.confirmExtra = function(title, description, acceptLabel, extraLabel, cancelLabel) {
    var message = {type: "confirm2",
                    title: title,
                    description: description ? description : null,
                    acceptLabel: acceptLabel ? acceptLabel : null,
                    extraLabel: extraLabel ? extraLabel : null,
                    cancelLabel: cancelLabel ? cancelLabel : null };

    var returnValueHolder = {};
    var dialog = window.openDialog("MessageDialog.xul", "pencilMessageDialog" + Util.getInstanceToken(), "modal,centerscreen", message, returnValueHolder);

    var result = {};
    result.accept = (returnValueHolder.button == "accept");
    result.cancel = (returnValueHolder.button == "cancel");
    result.extra = (returnValueHolder.button == "extra");

    return result;
}
Util.beginProgressJob = function(jobName, jobStarter) {
    var dialog = window.openDialog("ProgressDialog.xul", "pencilProgressDialog" + Util.getInstanceToken(), "centerscreen", jobName, jobStarter);
};
Util.setNodeMetadata = function (node, name, value) {
    node.setAttributeNS(PencilNamespaces.p, "p:" + name, value);
};
Util.getNodeMetadata = function (node, name) {
    return node.getAttributeNS(PencilNamespaces.p, name);
};
function debug(value) {
    dump("DEBUG: " + value + "\n");
}
function warn(value) {
    dump("WARN: " + value + "\n");
}
function info(value) {
    dump("INFO: " + value + "\n");
}
function error(value) {
    dump("ERROR: " + value + "\n");
}
var lastTick = (new Date()).getTime();
function tick(value) {
    return;
    var date = new Date();
    var newTick = date.getTime();
    var delta = newTick - lastTick;
    lastTick = newTick;

    var prefix = value ? (value + ": ").toUpperCase() : "TICK: ";
    dump(prefix + date.getSeconds() + "." + date.getMilliseconds() + " (" + delta + " ms)\n");
}







