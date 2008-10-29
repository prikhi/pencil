function Controller(win) {
    this.window = win;
    this.doc = null;
    this.modified = false;
    
    this.mainView = this.window.ownerDocument.getElementById("mainView");
    this.mainViewHeader = this.window.ownerDocument.getElementById("mainViewHeader");
    this.mainViewPanel = this.window.ownerDocument.getElementById("mainViewPanel");
    this.pagePropertiesMenuItem = this.window.ownerDocument.getElementById("pagePropertiesMenuItem");
    this.deletePageMenuItem = this.window.ownerDocument.getElementById("deletePageMenuItem");
    this.pageMoveLeftMenuItem = this.window.ownerDocument.getElementById("pageMoveLeftMenuItem");
    this.pageMoveRightMenuItem = this.window.ownerDocument.getElementById("pageMoveRightMenuItem");
    this.gotoTabMenu = this.window.ownerDocument.getElementById("gotoTabMenu");
    var tabScrollBox = this.window.ownerDocument.getElementById("tabScrollBox");
    this.tabScrollBox = tabScrollBox;
    
    var thiz = this;
    this.mainViewHeader.addEventListener("select", function (event) {
        var currentPage = thiz.getCurrentPage();
        var canvas = currentPage._view.canvas;
        try {
            currentPage.ensureBackground();
        } catch (e) {
        }
        if (!canvas) return;
        Dom.emitEvent("p:CanvasChanged", thiz.mainViewHeader, {canvas: canvas});
    }, false);
    this.mainViewHeader.addEventListener("dblclick", function (event) {
        var page = thiz.getCurrentPage();
        if (!page) return;
        thiz.editPageProperties(page);
    }, false);
    this.mainView.addEventListener("p:ContentModified", function (event) {
        thiz.markDocumentModified();
    }, false);
    
    tabScrollBox.addEventListener("contextmenu", function (event) {
        thiz._handleContextMenuShow(event);
    }, false);
    this.pagePropertiesMenuItem.addEventListener("command", function (event) {
        if (thiz._pageToEdit) {
            thiz.editPageProperties(thiz._pageToEdit);
        }
    }, false);
    this.gotoTabMenu.addEventListener("command", function (event) {
        var item = Dom.findUpward(event.originalTarget, function(node) {
            return node._page;
        });
        if (!item) return;
        thiz.gotoPage(item._page);
    }, false);
    this.deletePageMenuItem.addEventListener("command", function (event) {
        if (thiz._pageToEdit) {
            if (confirm("Are you sure you want to delete this page?")) {
                try {
                    thiz._deletePage(thiz._pageToEdit);
                } catch (e) {
                    Console.dumpError(e);
                }
                thiz._pageToEdit = null;
            }
        }
    }, false);
}
Controller.prototype.pageMoveRight = function () {
        if(!this.doc.pages[this.mainView.selectedIndex+1]){
            return
        }
        try {
            var i = this.mainView.selectedIndex;
            var right = this.doc.pages[i+1];
            //moving tabpanel
            var tabpanels =this.mainViewPanel.getElementsByTagName("tabpanel")
            var pcanvas =this.mainViewPanel.getElementsByTagName("pcanvas")
            var right_nodes = []
            while (pcanvas[i+1].drawingLayer.hasChildNodes())
                right_nodes.push(pcanvas[i+1].drawingLayer.removeChild(pcanvas[i+1].drawingLayer.firstChild));
            while (pcanvas[i].drawingLayer.hasChildNodes()) 
                    pcanvas[i+1].drawingLayer.appendChild(pcanvas[i].drawingLayer.firstChild);
            while (right_nodes.length){
                    pcanvas[i].drawingLayer.appendChild(right_nodes.shift());
            }
            //moving tab
            var tabs =this.mainViewHeader.getElementsByTagName("tab")
            var nextTab =  tabs[i+1].getAttribute("label");
            tabs[i+1].setAttribute("label",tabs[i].getAttribute("label"));
            tabs[i].setAttribute("label",nextTab);
            //moving page
            this.doc.pages[i+1] = this.doc.pages[i];
            this.doc.pages[i] = right;
            //update tab
            tabs[i+1]._page = this.doc.pages[i+1];
            tabs[i]._page = this.doc.pages[i];
            //update view
            this.doc.pages[i+1]._view = {header: tabs[i+1], body: tabpanels[i+1], canvas: pcanvas[i+1]};
            this.doc.pages[i]._view = {header: tabs[i], body: tabpanels[i], canvas: pcanvas[i]};
            //update tabpanel
            tabpanels[i+1]._canvas = pcanvas[i+1];
            tabpanels[i]._canvas = pcanvas[i];
            
            this._setSelectedPageIndex(i+1);
            this.markDocumentModified();
            this._ensureAllBackgrounds();
        } catch (e) {
            Console.dumpError(e);
        }
}
Controller.prototype.pageMoveLeft = function (i) {
        if(!this.doc.pages[this.mainView.selectedIndex-1]){
            return
        }
        try {
            var i = this.mainView.selectedIndex;
            var left = this.doc.pages[i-1];
            //moving tabpanel
            var tabpanels =this.mainViewPanel.getElementsByTagName("tabpanel")
            var pcanvas =this.mainViewPanel.getElementsByTagName("pcanvas")
            
            var left_nodes = []
            while (pcanvas[i-1].drawingLayer.hasChildNodes())
                left_nodes.push(pcanvas[i-1].drawingLayer.removeChild(pcanvas[i-1].drawingLayer.firstChild));
            while (pcanvas[i].drawingLayer.hasChildNodes()) 
                    pcanvas[i-1].drawingLayer.appendChild(pcanvas[i].drawingLayer.firstChild);
            while (left_nodes.length){
                    pcanvas[i].drawingLayer.appendChild(left_nodes.shift());
            }
            //moving tab
            var tabs =this.mainViewHeader.getElementsByTagName("tab")
            var previousTab =  tabs[i-1].getAttribute("label");
            tabs[i-1].setAttribute("label",tabs[i].getAttribute("label"));
            tabs[i].setAttribute("label",previousTab);
            //moving page
            this.doc.pages[i-1] = this.doc.pages[i];
            this.doc.pages[i] = left;
            //update tab
            tabs[i-1]._page = this.doc.pages[i-1];
            tabs[i]._page = this.doc.pages[i];
            //update view
            this.doc.pages[i-1]._view = {header: tabs[i-1], body: tabpanels[i-1], canvas: pcanvas[i-1]};
            this.doc.pages[i]._view = {header: tabs[i], body: tabpanels[i], canvas: pcanvas[i]};
            //update tabpanel
            tabpanels[i-1]._canvas = pcanvas[i-1];
            tabpanels[i]._canvas = pcanvas[i];
            
            this._setSelectedPageIndex(i-1);
            this.markDocumentModified();
            this._ensureAllBackgrounds();
        } catch (e) {
            Console.dumpError(e);
        }
}
Controller.prototype.gotoPage = function (page) {
    var tab = page._view.header;
    this.mainView.selectedTab = tab;
    this.tabScrollBox.ensureElementIsVisible(tab);
}
Controller.prototype.markDocumentModified = function () {
    this.modified = true;
    this._setupTitle();
}
Controller.prototype.markDocumentSaved = function () {
    this.modified = false;
    this._setupTitle();
}
Controller.prototype._setupTitle = function () {
    var path = this.filePath ? this.filePath : "Untitled Document";
    var title = this.modified ? (path + "*") : path;
    
    Pencil.setTitle(title);
};
Controller.prototype.hasDoc = function () {
    return this.doc ? true : false;
};
Controller.prototype.getCurrentPage = function () {
    if (!this.doc) throw "No active document";
    
    return this.doc.pages[this.mainView.selectedIndex];
};
Controller.prototype.isBoundToFile = function () {
    if (!this.doc) throw "No document is attached to this controller";
    
    return this.filePath != null;
};
var SIZE_RE = /^([0-9]+)x([0-9]+)$/;
Controller.prototype.parseSizeText = function (text) {
    if (!text.match(SIZE_RE)) {
        return null;
    }
    return {
        width: parseInt(RegExp.$1, 10),
        height: parseInt(RegExp.$2, 10)
    };
};
Controller.prototype.newDocument = function () {
    if (this.modified) {
        if (!this._confirmAndSaveDocument()) return;
    }
    this._clearView();
    
    //TODO: asking for params
    this.doc = new PencilDocument();
    
    var size = this.parseSizeText(Pencil.getBestFitSize());
    var lastSize = Config.get("lastSize");
    if (lastSize) {
        size = this.parseSizeText(lastSize);
    }
    
    this._addPage("Untitled Page", this._generateId(), size.width, size.height);
    this._setSelectedPageIndex(0);
    this.filePath = null;
    this.modified = false;
    this._setupTitle();
};
Controller.prototype.duplicatePage = function () {
 
    var page = this.getCurrentPage();
    
    var name = page.properties.name;
    var width = page.properties.width;
    var height = page.properties.height;
    var background = page.properties.background;
    var dimBackground = page.properties.dimBackground;

    var id = this._generateId();
    
    this._addPage(name, id, width, height, background, dimBackground);
    this._setSelectedPageIndex(this.doc.pages.length - 1);
    
    this.markDocumentModified();
    this.doc.pages[this.doc.pages.length-1].contentNode = page._view.canvas.drawingLayer;
};
Controller.prototype.newPage = function () {
    var returnValueHolder = {};
    var dialog = window.openDialog("PageDetailDialog.xul", "pageDetailDialog", "modal,centerscreen", 
                                    null,
                                    this.doc.pages,
                                    returnValueHolder);
    
    if (!returnValueHolder.ok)  return;
    
    var name = returnValueHolder.data.title;
    var width = returnValueHolder.data.width;
    var height = returnValueHolder.data.height;
    var background = returnValueHolder.data.background ? returnValueHolder.data.background : null;
    var dimBackground = returnValueHolder.data.dimBackground ? true : false;
    
    var id = this._generateId();
    
    this._addPage(name, id, width, height, background, dimBackground);
    this._setSelectedPageIndex(this.doc.pages.length - 1);
    this.markDocumentModified();    
};
Controller.prototype.saveDocumentAs = function () {
    this.filePath = null;
    this.saveDocument();
}
Controller.prototype.saveDocument = function () {
    var currentPath = this.filePath ? this.filePath : null;
    try {
        this._updatePageFromView();
        
        if (!this.isBoundToFile()) {
            var nsIFilePicker = Components.interfaces.nsIFilePicker;
            var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
            fp.init(window, "Save Document As", nsIFilePicker.modeSave);
            fp.appendFilter("Pencil Documents (*.ep; *.epz)", "*.ep; *.epz");
            fp.appendFilter("All Files", "*");
            
            if (fp.show() == nsIFilePicker.returnCancel) return false;
            
            this.filePath = fp.file.path;
            if (!this.filePath.match(/\.ep[z]?$/)) {
                this.filePath += ".ep";
                
                //FIXME: check existing once again
            }
            try {
                //new file was saved, update recent file list
                var files = Config.get("recent-documents");
                if (!files) {
                    files = [this.filePath];
                } else {
                    for (var i = 0; i < files.length; i ++) {
                        if (files[i] == this.filePath) {
                            //remove it
                            files.splice(i, 1);
                            break;
                        }
                    }
                    files.unshift(this.filePath);
                    if (files.length > 10) {
                        files.splice(files.length - 1, 1);
                    }
                }
                
                Config.set("recent-documents", files);
                Pencil.buildRecentFileMenu();
            } catch (e) {
                Console.dumpError(e, true);
            }
        }
        
        XMLDocumentPersister.save(this.doc, this.filePath);
        Pencil.setTitle(this.filePath);
        
        this.markDocumentSaved();
    } catch (e) {
        Util.info("Error saving file", "" + e);
        this.filePath = currentPath;
        return false;
    }
    
    return true;
};
Controller.prototype.loadDocument = function (uri) {
    if (this.modified) {
        if (!this._confirmAndSaveDocument()) return;
    }
    var file = null;
    if (!uri) {
        var nsIFilePicker = Components.interfaces.nsIFilePicker;
        var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
        fp.init(window, "Open Document", nsIFilePicker.modeOpen);
        fp.appendFilter("Pencil Documents (*.ep; *.epz)", "*.ep; *.epz");
        fp.appendFilter("All Files", "*");
        
        if (fp.show() != nsIFilePicker.returnOK) return;
        
        file = fp.file;
    } else {
        try {
            //assume uri is a nsILocalFile
            //don't know when use ?
            file = uri.QueryInterface(Components.interfaces.nsILocalFile);
        } catch (e1) {
            try {//MRU OR double clic on explorer
                //assume uri is an absolute path
                file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
                file.initWithPath("" + uri);
            } catch (e){
                //case drag'n drop ep file
                //assume uri is a real uri
                file = fileHandler.getFileFromURLSpec(uri).QueryInterface(Components.interfaces.nsILocalFile);
            }
        }
        if (!file.exists()) {
            alert("The file '" + file.path + "' does not exist");
            return;
        }
    }
    var path = file.path;
    
    try {
        //new file was loaded, update recent file list
        var files = Config.get("recent-documents");
        if (!files) {
            files = [path];
        } else {
            for (var i = 0; i < files.length; i ++) {
                if (files[i] == path) {
                    //remove it
                    files.splice(i, 1);
                    break;
                }
            }
            files.unshift(path);
            if (files.length > 10) {
                files.splice(files.length - 1, 1);
            }
        }
        
        Config.set("recent-documents", files);
        Pencil.buildRecentFileMenu();
    } catch (e) {
        Console.dumpError(e, true);
    }
    
    this._clearView();
    document.documentElement.setAttribute("wait-cursor", true);

    try {    
        this.doc = XMLDocumentPersister.load(file);
    } catch (e) {
        Console.dumpError(e);
        throw e;
    }
    this._pageSetupCount = 0;
    var thiz = this;
    for (p in this.doc.pages) {
        this._createPageView(this.doc.pages[p], function () {
            thiz._pageSetupCount ++;
            if (thiz._pageSetupCount == thiz.doc.pages.length) {
                //alert("all page loaded");
                thiz._ensureAllBackgrounds(function () {
                    thiz._setSelectedPageIndex(0);
                    
                    thiz.filePath = path;
                    Pencil.setTitle(thiz.filePath);
                    
                    thiz.markDocumentSaved();
                    document.documentElement.removeAttribute("wait-cursor");
                });
            }
        });
    }
}
//---------------------- privates -----
Controller.prototype._ensureAllBackgrounds = function (callback) {
    this._ensureBackground(0, callback);
};
Controller.prototype._ensureBackground = function (index, callback) {
    if (index >= this.doc.pages.length) {
        if (callback) callback();
        return;
    }
    var page = this.doc.pages[index];
    var thiz = this;
    page.ensureBackground(function () {
        thiz._ensureBackground(index + 1, callback);
    });
}
Controller.prototype._updatePageFromView = function () {
    if (!this.doc) throw "No active document";
    
    for (p in this.doc.pages) {
        var page = this.doc.pages[p];
        var drawingLayer = page._view.canvas.drawingLayer;
        
        page.contentNode = drawingLayer;        
    }
}
Controller.prototype._generateId = function () {
    return (new Date().getTime()) + "_" + Math.round(Math.random() * 10000);
};
Controller.prototype._addPage = function (name, id, width, height, background, dimBackground) {
    var page = new Page(this.doc);
    page.properties.name = name;
    page.properties.id = id;
    page.properties.width = width;
    page.properties.height = height;
    page.properties.dimBackground = false;
    if (background) {
        page.properties.background = background;
        page.properties.dimBackground = dimBackground;
    }
    
    this.doc.addPage(page);
    page._doc = this.doc;
    
    this._createPageView(page, function () {
        page.ensureBackground();
    });
};
Controller.prototype._createPageView = function (page, callback) {
    var tab = this.window.ownerDocument.createElementNS(PencilNamespaces.xul, "tab");
    this.mainViewHeader.appendChild(tab);
    tab._page = page;
    
    tab.setAttribute("label", page.properties.name);
    
    var tabpanel = this.window.ownerDocument.createElementNS(PencilNamespaces.xul, "tabpanel");
    this.mainViewPanel.appendChild(tabpanel);
    var vbox = this.window.ownerDocument.createElementNS(PencilNamespaces.xul, "vbox");
    tabpanel.appendChild(vbox);
    
    var canvas = this.window.ownerDocument.createElementNS(PencilNamespaces.xul, "pcanvas");
    canvas.setAttribute("flex", 1);
    canvas.setAttribute("width", parseInt(page.properties.width, 10));
    canvas.setAttribute("height", parseInt(page.properties.height, 10));
    vbox.appendChild(canvas);
    
    var view = {header: tab, body: tabpanel, canvas: canvas};
    page._view = view;
    tabpanel._canvas = canvas;
    
    window.setTimeout(function () {
        Pencil.installEditors(canvas);
        Pencil.installXferHelpers(canvas);
        Pencil.installDragObservers(canvas);
        if (page.contentNode) {
            for (var i = 0; i < page.contentNode.childNodes.length; i ++) {
                var node = page.contentNode.childNodes[i];
                canvas.drawingLayer.appendChild(canvas.ownerDocument.importNode(node, true));
            }
        }
        canvas.careTaker.reset();
        
        canvas.addEventListener("p:ContentModified", function (event) {
            page.rasterizeDataCache = null;
        }, false);
        
        if (callback) callback();
    }, 200);
};
Controller.prototype._setSelectedPageIndex = function (index) {
    this.mainView.selectedIndex = index;
};
Controller.prototype._clearView = function () {
    if (this.doc) {
        for (p in this.doc.pages) {
            var page = this.doc.pages[p];
            page._view.canvas.passivateEditors();
        }
    }
    Dom.empty(this.mainViewHeader);
    Dom.empty(this.mainViewPanel);
};
Controller.prototype._handleContextMenuShow = function (event) {
    var tab = Dom.findTop(event.originalTarget, function (node) {
        return node.localName == "tab";
    });
    if (tab) {
        this.pagePropertiesMenuItem.style.display = "";
        this.deletePageMenuItem.style.display = "";
        this._pageToEdit = tab._page;
    } else {
        this.pagePropertiesMenuItem.style.display = "none";
        this.deletePageMenuItem.style.display = "none";
        this._pageToEdit = null;
    }
    
    //setup goto tab menu
    var popup = this.gotoTabMenu.firstChild;
    Dom.empty(popup);
    if (this.doc.pages.length < 2) {
        this.gotoTabMenu.disabled = true;
    } else {
        this.gotoTabMenu.disabled = false;
        for (var i = 0; i < this.doc.pages.length; i ++) {
            var page = this.doc.pages[i];
            var item = popup.ownerDocument.createElementNS(PencilNamespaces.xul, "menuitem");
            item.setAttribute("label", page.properties.name);
            item._page = page;
            popup.appendChild(item);
        }
    }
};
Controller.prototype._modifyPageProperties = function (page, data) {
    if (!page._view) return;
    
    page.properties.name = data.title;
    page.properties.width = data.width;
    page.properties.height = data.height;
    page.properties.dimBackground = data.dimBackground;
    
    if (data.background) {
        page.properties.background = data.background;
    } else {
        try {
            delete page.properties.background;
        } catch (e) {}
    }
    
    page._view.header.setAttribute("label", data.title);
    
    try {
        this.mainViewPanel.setAttributeNS(PencilNamespaces.p, "p:resizing", "true");
        page._view.canvas.setSize(data.width, data.height);
        
        this.mainViewPanel.removeAttributeNS(PencilNamespaces.p, "resizing");
        
    } catch (e) {
        Console.dumpError(e, "sasd");
    }
    page.rasterizeDataCache = null;
};
Controller.prototype._deletePage = function (page) {
    //find page in the list
    var currentIndex = this.mainView.selectedIndex;
    var index = -1;
    for (var i = 0; i < this.doc.pages.length; i ++) {
        if (this.doc.pages[i].properties.id == page.properties.id) {
            index = i;
            break;
        }
    }
    if (index < 0) return;
    
    //remove UI
    page._view.header.parentNode.removeChild(page._view.header);
    page._view.body.parentNode.removeChild(page._view.body);
    
    //remove the page
    delete this.doc.pages[index];
    for (var i = index; i < this.doc.pages.length - 1; i ++) {
        this.doc.pages[i] = this.doc.pages[i + 1];
    }
    this.doc.pages.length --;
    for (var i in this.doc.pages) {
        var page = this.doc.pages[i];
        if (page.properties.background && !page.getBackgroundPage()) {
            delete page.properties.background;
        }
    }
    this._ensureAllBackgrounds();
    
    if (index == currentIndex && this.doc.pages.length > 0) {
        this._setSelectedPageIndex(Math.min(index, this.doc.pages.length - 1));
    } else if (index < currentIndex) {
        this._setSelectedPageIndex(currentIndex - 1);
    }
    
};
Controller.prototype._confirmAndSaveDocument = function () {
    var result = Util.confirmExtra("Save changes to document before closing?",
                                    "If you don't save changes will be permanently lost.",
                                    "Save", "Discard Changes", "Cancel");
    if (result.extra) return true;
    if (result.cancel) return false;
    
    return this.saveDocument();
    
};
Controller.prototype.editPageProperties = function (page) {
    var returnValueHolder = {};
    var possibleBackgroundPages = [];
    for (var i in this.doc.pages) {
        var bgPage = this.doc.pages[i];
        if (page.canSetBackgroundTo(bgPage)) {
            possibleBackgroundPages.push(bgPage);
        }
    }
    var currentData = {title: page.properties.name,
                         id: page.properties.id,
                         width: page.properties.width,
                         height: page.properties.height,
                         background: page.properties.background ? page.properties.background : null,
                         dimBackground: page.properties.dimBackground};
    var dialog = window.openDialog("PageDetailDialog.xul", 
                                    "pageDetailDialog" + Util.getInstanceToken(),
                                    "modal,centerscreen",
                                    currentData, possibleBackgroundPages, returnValueHolder);
    
    if (!returnValueHolder.ok)  return;
    
    //change page now:
    try {
        this._modifyPageProperties(page, returnValueHolder.data);
        this._ensureAllBackgrounds(null);
    } catch (e) {
        Console.dumpError(e);
    }
};
Controller.prototype.rasterizeDocument = function () {
    try {
    var currentDir = null;
        if (this.isBoundToFile()) {
            var file = Components.classes["@mozilla.org/file/local;1"]
                                 .createInstance(Components.interfaces.nsILocalFile);
            file.initWithPath(this.filePath);
            
            currentDir = file.parent;
        }
        
        var nsIFilePicker = Components.interfaces.nsIFilePicker;
        var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
        if (currentDir) fp.displayDirectory = currentDir;
        fp.init(window, "Export all pages into", nsIFilePicker.modeGetFolder);
        fp.appendFilter("All Files", "*");
        
        if (fp.show() == nsIFilePicker.returnCancel) return false;
        
        var pageIndex = -1;
        var dir = fp.file;
        debug("Selected folder: " + dir.path);
        
        var thiz = this;
        var starter = function (listener) {
            var rasterizeNext = function () {
                try {
                    pageIndex ++;
                    if (pageIndex >= thiz.doc.pages.length) {
                        listener.onTaskDone();
                        Util.info("Document has been exported", "Location: " + dir.parent.path);
                        return;
                    }
                    var page = thiz.doc.pages[pageIndex];

                    if (Config.get("document.SaveWithPrefixNumber") == null){
                        Config.set("document.SaveWithPrefixNumber",false);
                    }
                    //signal progress
                    var withPrefix = Config.get("document.SaveWithPrefixNumber")
                    if(withPrefix)
                        var task = "Exporting page " + (pageIndex +1 )+ '_' + page.properties.name + "...";
                    else
                        var task = "Exporting page " + page.properties.name + "...";
                    
                    listener.onProgressUpdated(task, pageIndex + 1, thiz.doc.pages.length);
                        
                    if (pageIndex > 0) dir = dir.parent;
                    if(withPrefix)
                        var fileName = (pageIndex +1 )+ '_' + page.properties.name.replace(/[\/!\\'"]/g, "_");
                    else
                        var fileName = page.properties.name.replace(/[\/!\\'"]/g, "_");
                        
                    dir.append(fileName + ".png");
                    
                    var pagePath = dir.path;
                    debug("File path: " + pagePath);
                    
                    thiz._rasterizePage(page, pagePath, function() {
                        window.setTimeout(rasterizeNext, 100);
                    });
                } catch (e2) {
                    Console.dumpError(e2, "stdout");
                }
            };
            rasterizeNext();
        }
        
        //take a shower, doit together!!!
        Util.beginProgressJob("Export document", starter);
    } catch (e) {
        Console.dumpError(e, "stdout");
    }
};
Controller.prototype.rasterizeCurrentPage = function () {
    var page = this.getCurrentPage();
    if (!page) return;
    
    var fileName = page.properties.name + ".png";
    
    var currentDir = null;
    if (this.isBoundToFile()) {
        var file = Components.classes["@mozilla.org/file/local;1"]
                             .createInstance(Components.interfaces.nsILocalFile);
        file.initWithPath(this.filePath);
        
        currentDir = file.parent;
    }
    
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.defaultString = fileName;
    if (currentDir) fp.displayDirectory = currentDir;
    fp.init(window, "Export Page As", nsIFilePicker.modeSave);
    fp.appendFilter("PNG Image (*.png)", "*.png");
    fp.appendFilter("All Files", "*");
    
    if (fp.show() == nsIFilePicker.returnCancel) return false;
    try {
        this._rasterizePage(page, fp.file.path, function () {
                Util.info("Page '" + page.properties.name + "' has been exported", "Location: " + fp.file.path);
            });
    } catch (e) {
        Console.dumpError(e);
    }
    
};
Controller.prototype._rasterizePage = function (page, path, callback) {
    //create a new svg document
    var svg = document.createElementNS(PencilNamespaces.svg, "svg");
    svg.setAttribute("width", "" + page.properties.width  + "px");
    svg.setAttribute("height", "" + page.properties.height  + "px");

    if (page._view.canvas.hasBackgroundImage) {
        var bgImage = page._view.canvas.backgroundImage.cloneNode(true);
        bgImage.removeAttribute("transform");
        bgImage.removeAttribute("id");
        svg.appendChild(bgImage);
    }
        
    var drawingLayer = page._view.canvas.drawingLayer.cloneNode(true);
    drawingLayer.removeAttribute("transform");
    drawingLayer.removeAttribute("id");
    svg.appendChild(drawingLayer);
    
    Pencil.rasterizer.rasterizeDOM(svg, path, callback);
    
};
Controller.prototype.sizeToContent = function (passedPage, askForPadding) {
    var page = passedPage ? passedPage : this.getCurrentPage();
    var canvas = page._view.canvas;
    if (!canvas) return;
    
    var padding = 0;
    if (askForPadding) {
        var paddingString = window.prompt("Please enter the padding:", "0");
        if (!paddingString) return null;
        var padding = parseInt(paddingString, 10);
        if (!padding) padding = 0;
    }

    var newSize = canvas.sizeToContent(padding, padding);
    if (newSize) {
        page.properties.width = newSize.width;
        page.properties.height = newSize.height;
    }
};







