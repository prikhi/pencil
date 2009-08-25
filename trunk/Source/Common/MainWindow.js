Pencil.buildRecentFileMenu = function (files) {
    var menu = document.getElementById("recentDocumentMenu");
    Dom.empty(menu);
    if (!files) {
        files = Config.get("recent-documents");
        if (!files) {
            menu.setAttribute("disabled", true);
            return;
        }
    }
    menu.removeAttribute("disabled");
    
    for (var i = 0; i < files.length; i ++) {
        var path = files[i];
        var menuItem = document.createElementNS(PencilNamespaces.xul, "menuitem");
        var localFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
        localFile.initWithPath(path);
        menuItem.setAttribute("label", localFile.leafName);
        menuItem.setAttribute("tooltiptext", path);
        menuItem._path = path;
        menu.appendChild(menuItem);
    }
};
Pencil.postBoot = function() {
    var menu = document.getElementById("recentDocumentMenu");
    menu.addEventListener("command", function (event) {
        var path = event.originalTarget._path;
        if (path) {
            Pencil.controller.loadDocument(path);
        }
    }, false);
    
    Pencil.buildRecentFileMenu();
    
    if (window.arguments) {
        var cmdLine = window.arguments[0];
        if (cmdLine) {
            cmdLine = cmdLine.QueryInterface(Components.interfaces.nsICommandLine);
            
            var filePath = ""
            var i = 0;
            while (true) {
                try {
                    var part = cmdLine.getArgument(i);
                    if (!part) break;
                    if (filePath.length > 0) filePath += " ";
                    if (part.indexOf("application.ini") == -1)
                        filePath += part;
                    i ++;
                } catch (e) { break; }
            }
            if (filePath) {
                window.setTimeout(function () {
                    Pencil.controller.loadDocument(filePath);
                }, 100);
            } else {
                window.setTimeout(function() {
                        Pencil.controller.newDocument();
                }, 100);
            }
        }
    }
    
    var hideHeavyElementsMenuItem = document.getElementById("hideHeavyElementsMenuItem");
    var showHeavyElements = Config.get("view.showHeavyElements");
    if (showHeavyElements == null) showHeavyElements = true;
    
    if (showHeavyElements) {
        hideHeavyElementsMenuItem.removeAttribute("checked");
    } else {
        hideHeavyElementsMenuItem.setAttribute("checked", true);
    }
    
    Pencil.setShowHeavyElements(showHeavyElements, false);
};
Pencil.getBestFitSize = function () {
    var mainViewPanel = document.getElementById("mainViewPanel");
    return [mainViewPanel.boxObject.width - 50, mainViewPanel.boxObject.height - 50].join("x");
};
Pencil.setShowHeavyElements = function (show, updateConfig) {
    document.documentElement.setAttributeNS(PencilNamespaces.p, 'p:hide-heavy', show ? "false" : "true");
    if (updateConfig) {
        Config.set("view.showHeavyElements", show);
    }
};
Pencil.insertPNGImage = function (url, w, h, x, y) {
    var imageData = new ImageData(w, h, url);
    var def = CollectionManager.shapeDefinition.locateDefinition(PNGImageXferHelper.SHAPE_DEF_ID);
    if (!def) return;
    
    var canvas = Pencil.activeCanvas;
    if (!canvas) return;
    
    canvas.insertShape(def, new Bound(x, y, null, null));
    if (canvas.currentController) {
        var dim = new Dimension(imageData.w, imageData.h);
        canvas.currentController.setProperty("imageData", imageData);
        canvas.currentController.setProperty("box", dim);
        canvas.currentController.setProperty("fillColor", Color.fromString("#ffffff00"));
        canvas.invalidateEditors();
        window.setTimeout(function() {
            canvas.currentController.setProperty("box", dim);
        }, 10);
    }
};