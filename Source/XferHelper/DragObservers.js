Pencil.dragObserverClasses = [];
Pencil.registerDragObserver = function (observerClass) {
    Pencil.dragObserverClasses.push(observerClass);
};
Pencil.installDragObservers = function (canvas) {
    for (factory in Pencil.dragObserverClasses) {
        var constructorFunction = Pencil.dragObserverClasses[factory];
        var observer = new constructorFunction(canvas);
        canvas.dragObservers.push(observer);
    }
};

function ShapeDefDragObserver(canvas) {
    this.canvas = canvas;
}
ShapeDefDragObserver.prototype = {
    getSupportedFlavours : function () {
        var flavours = new FlavourSet();
        
        flavours.appendFlavour("pencil/def");
        
        return flavours;
    },
    onDragOver: function (evt, flavour, session){},
    onDrop: function (evt, transferData, session) {
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        var defId = transferData.data;
        var def = CollectionManager.shapeDefinition.locateDefinition(defId);
        
        var loc = this.canvas.getEventLocation(evt);
        
        if (loc.x <0 || loc.y < 0) return;
        
        this.canvas.insertShape(def, new Bound(loc.x, loc.y, null, null));
    }
};

Pencil.registerDragObserver(ShapeDefDragObserver);

//====================================================================================

function RichTextDragObserver(canvas) {
    this.canvas = canvas;
}
RichTextDragObserver.prototype = {
    getSupportedFlavours : function () {
        var flavours = new FlavourSet();
        
        flavours.appendFlavour("text/html");
        
        return flavours;
    },
    onDragOver: function (evt, flavour, session){},
    onDrop: function (evt, transferData, session) {
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        var html = transferData.data;
        
        try {
            var xhtml = Dom.toXhtml(html);
            
            var textPaneDef = CollectionManager.shapeDefinition.locateDefinition(RichTextXferHelper.SHAPE_DEF_ID);
            if (!textPaneDef) return;
            
            this.canvas.insertShape(textPaneDef, null);
            if (this.canvas.currentController) {
                this.canvas.currentController.setProperty(RichTextXferHelper.SHAPE_CONTENT_PROP_NAME, new RichText(xhtml));
            }
        } catch (e) {
            throw e;
        }
        
    }
};

Pencil.registerDragObserver(RichTextDragObserver);

//====================================================================================

function FileDragObserver(canvas) {
    this.canvas = canvas;
}
FileDragObserver.prototype = {
    getSupportedFlavours : function () {
        var flavours = new FlavourSet();
        
        flavours.appendFlavour("text/x-moz-url");
        
        return flavours;
    },
    onDragOver: function (evt, flavour, session){},
    onDrop: function (evt, transferData, session) {
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        var url = transferData.data;
        if (!url.match(/^file:\/\/.*\.([a-zA-Z0-9]+)/)) return;
        var fileType = RegExp.$1.toLowerCase();
        
        var loc = this.canvas.getEventLocation(evt);

        if (FileDragObserver.fileTypeHandler[fileType]) {
            FileDragObserver.fileTypeHandler[fileType](this.canvas, url, loc);
        }
    }
};
FileDragObserver.SVG_SHAPE_DEF_ID = "Evolus.Common:SVGImage";

FileDragObserver.fileTypeHandler = {
    _handleImageFile: function (canvas, url, loc, transparent) {
        try {
            var def = CollectionManager.shapeDefinition.locateDefinition(PNGImageXferHelper.SHAPE_DEF_ID);
            if (!def) return;
            
            if (Config.get("document.EmbedImages") == null){
                Config.set("document.EmbedImages", false);
            }
            var embedImages = Config.get("document.EmbedImages")
            
            canvas.insertShape(def, new Bound(loc.x, loc.y, null, null));
            if (!canvas.currentController) return;
            
            var controller = canvas.currentController;
            
            var handler = function (imageData) {
                debug("handler called: " + imageData);
                var dim = new Dimension(imageData.w, imageData.h);
                controller.setProperty("imageData", imageData);
                controller.setProperty("box", dim);
                if (transparent) {
                    controller.setProperty("fillColor", Color.fromString("#ffffff00"));
                }
            };
            
            if (!embedImages) {
                debug([embedImages, url]);
                ImageData.fromUrl(url, handler);
            } else {
                ImageData.fromUrlEmbedded(url, handler);
            }
            canvas.invalidateEditors();
        } catch (e) {
            Console.dumpError(e);
        }
    },
    png: function (canvas, url, loc) {
        debug(url);
        this._handleImageFile(canvas, url, loc, "transparent");
    },
    jpg: function (canvas, url, loc) {
        this._handleImageFile(canvas, url, loc);
    },
    gif: function (canvas, url, loc) {
        this._handleImageFile(canvas, url, loc, "transparent");
    },
    svg: function (canvas, url, loc) {
        var file = fileHandler.getFileFromURLSpec(url).QueryInterface(Components.interfaces.nsILocalFile);
        var fileContents = FileIO.read(file, XMLDocumentPersister.CHARSET);
        var domParser = new DOMParser();
        
        var dom = domParser.parseFromString(fileContents, "text/xml");
        try {
            var width = parseInt(Dom.getSingle("/svg:svg/@width", dom).nodeValue, 10);
            var height = parseInt(Dom.getSingle("/svg:svg/@height", dom).nodeValue, 10);
            
            var g = dom.createElementNS(PencilNamespaces.svg, "g");
            while (dom.documentElement.childNodes.length > 0) {
                var firstChild = dom.documentElement.firstChild;
                dom.documentElement.removeChild(firstChild);
                g.appendChild(firstChild);
            }
            dom.replaceChild(g, dom.documentElement);
            
            var def = CollectionManager.shapeDefinition.locateDefinition(FileDragObserver.SVG_SHAPE_DEF_ID);
            if (!def) return;
            
            canvas.insertShape(def, new Bound(loc.x, loc.y, null, null));
            if (canvas.currentController) {
                var controller = canvas.currentController;
                var dim = new Dimension(width, height);
                controller.setProperty("svgXML", new PlainText(Dom.serializeNode(dom.documentElement)));
                controller.setProperty("box", dim);
                controller.setProperty("originalDim", dim);
            }

        } catch (e) {
            Console.dumpError(e);
        }
    },
    ep: function (canvas, url) {
        Pencil.controller.loadDocument(url);
    }
};

Pencil.registerDragObserver(FileDragObserver);



