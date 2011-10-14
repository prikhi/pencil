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
    try {
        var menu = document.getElementById("recentDocumentMenu");
        menu.addEventListener("command", function (event) {
            var path = event.originalTarget._path;
            if (path) {
                Pencil.controller.loadDocument(path);
            }
        }, false);

        Pencil.buildRecentFileMenu();

        var loaded = false;
        if (window.arguments) {
            var cmdLine = window.arguments[0];
            if (cmdLine) {
                cmdLine = cmdLine.QueryInterface(Components.interfaces.nsICommandLine);

                var filePath = ""
                var i = 0;
                while (true && i < cmdLine.length) {
                    try {
                        var part = cmdLine.getArgument(i);
                        if (!part) break;
                        if (filePath.length > 0) filePath += " ";
                        if (part.indexOf("application.ini") == -1)
                            filePath += part;
                        i ++;
                    } catch (e) { Console.dumpError(e); break; }
                }
                if (filePath && filePath.indexOf("-") != 0) {
                    window.setTimeout(function () {
                        Pencil.controller.loadDocument(filePath);
                    }, 100);
                } else {
                    window.setTimeout(function() {
                        Pencil.controller.newDocument();
                    }, 100);
                }

                loaded = true;
            }
        }
        if (!loaded) {
            window.setTimeout(function() {
                Pencil.controller.newDocument();
            }, 100);
        }
        Pencil.updateGUIForHeavyElementVisibility();
    } catch (e) {
        Console.dumpError(e);
    }
};
function czInitComponent() {
	try {
		const cid = "@iosart.com/Utils/ColorZilla;1";
		gCZComponent = Components.classes[cid].createInstance();
		gCZComponent = gCZComponent.QueryInterface(Components.interfaces.mozIColorZilla);
	} catch (err) {
		dump("Couldn't get object: " + err + "\n");
		return;
	}
}

function czGetScreenColor(x, y) {
	var col = gCZComponent.GetPixel(x, y);
	return col;
}

Pencil.getBestFitSize = function () {
    var mainViewPanel = document.getElementById("mainViewPanel");
    return [mainViewPanel.boxObject.width - 50, mainViewPanel.boxObject.height - 50].join("x");
};
Pencil.toggleShowHeavyElements = function () {
    var show = Config.get("view.showHeavyElements", false);

    Config.set("view.showHeavyElements", !show);

    Pencil.updateGUIForHeavyElementVisibility();
};
Pencil.updateGUIForHeavyElementVisibility = function () {
    var hideHeavyElementsMenuItem = document.getElementById("hideHeavyElementsMenuItem");
    var showHeavyElements = Config.get("view.showHeavyElements", false);

    if (showHeavyElements) {
        hideHeavyElementsMenuItem.removeAttribute("checked");
    } else {
        hideHeavyElementsMenuItem.setAttribute("checked", true);
    }

    document.documentElement.setAttributeNS(PencilNamespaces.p, "p:hide-heavy", showHeavyElements ? "false" : "true");
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
