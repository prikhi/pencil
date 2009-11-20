
window.onerror = function (message, url, code) {
    //Console.dumpError(message);
    error("SYSTEM ERROR!\n\t* " + message + "\n\t* at: " + url + ":" + code);
    return false;
};

var Pencil = {};

Pencil.editorClasses = [];
Pencil.registerEditor = function (editorClass) {
    Pencil.editorClasses.push(editorClass);
};

Pencil.sharedEditors = [];
Pencil.registerSharedEditor = function (sharedEditor) {
    Pencil.sharedEditors.push(sharedEditor);
}

Pencil.xferHelperClasses = [];
Pencil.registerXferHelper = function (helperClass) {
    Pencil.xferHelperClasses.push(helperClass);
};

Pencil.behaviors = {};

Pencil.documentExporters = [];
Pencil.defaultDocumentExporter = null;
Pencil.registerDocumentExporter = function (exporter, defaultExporter) {
    Pencil.documentExporters.push(exporter);
    if (defaultExporter) Pencil.defaultDocumentExporter = exporter;
};
Pencil.getDocumentExporterById = function (id) {
    for (var i = 0; i < Pencil.documentExporters.length; i ++) {
        if (Pencil.documentExporters[i].id == id) {
            return Pencil.documentExporters[i];
        }
    }
    return null;
};

Pencil.toggleHeartBeat = function () {
    if (Pencil.window.hasAttribute("class")) {
        Pencil.window.removeAttribute("class");
    } else {
        Pencil.window.setAttribute("class", "Beat");
    }
    window.setTimeout(Pencil.toggleHeartBeat, 200);
};

Pencil.installEditors = function (canvas) {
    for (factory in Pencil.editorClasses) {
        var constructorFunction = Pencil.editorClasses[factory];
        var editor = new constructorFunction();
        editor.install(canvas);
    }
};
Pencil.installXferHelpers = function (canvas) {
    for (factory in Pencil.xferHelperClasses) {
        var constructorFunction = Pencil.xferHelperClasses[factory];
        var helper = new constructorFunction(canvas);
        canvas.xferHelpers.push(helper);
    }
};
Pencil.fixUI = function () {
    Dom.workOn(".//xul:*[@image]", Pencil.window, function (node) {
        var image = node.getAttribute("image");
        if (image.match(/^moz\-icon:\/\/([^\?]+)\?size=([a-z]+)$/)) {
            var src = "Icons/MozIcons/" + RegExp.$1 + "-" + RegExp.$2 + ".png";
            node.setAttribute("image", src);
        }
    });
};
Pencil.boot = function (event) {
    try {
        if (Pencil.booted) return;
        Pencil.booted = true;
        Pencil.window = document.documentElement;
        var win = Dom.getSingle("/xul:window", document);

        //fix icons on other platform
        if (navigator.platform.indexOf("Linux") < 0) {
            Pencil.fixUI();
        }

        Pencil.collectionPane = document.getElementById("collectionPane");
        Pencil.controller = new Controller(win);
        Pencil.rasterizer = new Rasterizer("image/png");
        CollectionManager.loadStencils();
        ExportTemplateManager.loadTemplates();

        Pencil.setTitle("(No document)");
        Pencil.activeCanvas = null;
        Pencil.setupCommands();

        //booting shared editors
        for (var i in Pencil.sharedEditors) {
            try {
                Pencil.sharedEditors[i].setup();
            } catch (e) {
                Console.dumpError(e, "stdout");
            }
        }

        document.documentElement.addEventListener("p:CanvasChanged", Pencil.handleCanvasChange, false);
        document.documentElement.addEventListener("p:TargetChanged", Pencil.handleTargetChange, false);

        document.documentElement.addEventListener("p:ContentModified", Pencil._setupUndoRedoCommand, false);

        Pencil.postBoot();
        /*
        window.setTimeout(function() {
            Pencil.controller.newDocument();
        }, 500);
        */
    } catch (e) {
        Console.dumpError(e, "stdout");
    }
};
Pencil.setTitle = function (s) {
    document.title = s + " - %name%";
};

Pencil.handleCanvasChange = function (event) {
    Pencil.activeCanvas = event.canvas;
    Pencil.setupCommands();
    Pencil.invalidateSharedEditor();
};
Pencil.handleTargetChange = function (event) {
    Pencil.setupCommands();
    Pencil.invalidateSharedEditor();
};
Pencil.invalidateSharedEditor = function() {
    var canvas = Pencil.activeCanvas;
    var target = canvas ? canvas.currentController : null;

    if (!target) {
        for (var i in Pencil.sharedEditors) {
            try {
                Pencil.sharedEditors[i].detach();
            } catch (e) {
                Console.dumpError(e, "stdout");
            }
        }
        return;
    }
    for (var i in Pencil.sharedEditors) {
        try {
            Pencil.sharedEditors[i].attach(target);
        } catch (e) {
            Console.dumpError(e, "stdout");
        }
    }
};
Pencil.setupCommands = function () {
    var canvas = Pencil.activeCanvas;
    var target = canvas ? canvas.currentController : null;

    Pencil._enableCommand("newPageCommand", Pencil.controller.hasDoc());
    Pencil._enableCommand("duplicatePageCommand", Pencil.controller.hasDoc());
    Pencil._enableCommand("saveDocumentCommand", Pencil.controller.hasDoc());
    Pencil._enableCommand("saveDocumentAsCommand", Pencil.controller.hasDoc());
    Pencil._enableCommand("rasterizeSelectionCommand", target && target.getGeometry);
    Pencil._enableCommand("rasterizeCommand", canvas != null);

    Pencil._enableCommand("zoomInCommand", canvas != null);
    Pencil._enableCommand("zoom1Command", canvas != null);
    Pencil._enableCommand("zoomOutCommand", canvas != null);

    Pencil._enableCommand("moveLeftCommand", canvas != null);
    Pencil._enableCommand("moveRightCommand", canvas != null);

    Pencil._enableCommand("makeSameHorizontalSpaceCommand", target && target.makeSameHorizontalSpace);
    Pencil._enableCommand("makeSameVerticalSpaceCommand", target && target.makeSameVerticalSpace);

    Pencil._enableCommand("alignLeftCommand", target && target.alignLeft);
    Pencil._enableCommand("alignCenterCommand", target && target.alignCenter);
    Pencil._enableCommand("alignRightCommand", target && target.alignRight);
    Pencil._enableCommand("alignTopCommand", target && target.alignTop);
    Pencil._enableCommand("alignMiddleCommand", target && target.alignMiddle);
    Pencil._enableCommand("alignBottomCommand", target && target.alignBottom);

    Pencil._enableCommand("makeSameWidthCommand", target && target.makeSameWidth);
    Pencil._enableCommand("makeSameHeightCommand", target && target.makeSameHeight);
    Pencil._enableCommand("makeSameMinWidthCommand", target && target.makeSameMinWidth);
    Pencil._enableCommand("makeSameMinHeightCommand", target && target.makeSameMinHeight);

    Pencil._enableCommand("bringToFrontCommand", target && target.bringToFront);
    Pencil._enableCommand("bringForwardCommand", target && target.bringForward);
    Pencil._enableCommand("sendBackwardCommand", target && target.sendBackward);
    Pencil._enableCommand("sendToBackCommand", target && target.sendToBack);

    Pencil._enableCommand("copyCommand", canvas && canvas.doCopy && target);
    Pencil._enableCommand("cutCommand", canvas && canvas.doCopy && target);
    Pencil._enableCommand("pasteCommand", canvas && canvas.doPaste);

    Pencil._enableCommand("groupCommand", target && target.constructor == TargetSet);
    Pencil._enableCommand("unGroupCommand", target && target.constructor == Group);

    Pencil._setupUndoRedoCommand();
};
Pencil._setupUndoRedoCommand = function () {
    var canvas = Pencil.activeCanvas;

    Pencil._enableCommand("undoCommand", canvas && canvas.careTaker && canvas.careTaker.canUndo());
    Pencil._enableCommand("redoCommand", canvas && canvas.careTaker && canvas.careTaker.canRedo());
};
Pencil._enableCommand = function (name, condition) {
    var command = document.getElementById(name);
    if (command) {
        if (condition) {
            command.removeAttribute("disabled");
        } else {
            command.setAttribute("disabled", true);
        }
    }
};



Pencil.getGridSize = function () {
    var size = Config.get("edit.gridSize", 5);
    return {w: size, h: size};
};

Pencil.getCurrentTarget = function () {
    var canvas = Pencil.activeCanvas;
    return canvas ? canvas.currentController : null;
};

window.addEventListener("load", Pencil.boot, false);
window.addEventListener("keypress", function(event) {
    if (event.keyCode == event.DOM_VK_F5) {
        CollectionManager.loadStencils();
    }
}, false);

window.addEventListener("close", function (event) {
    if (Pencil.controller.modified) {
        if (!Pencil.controller._confirmAndSaveDocument()) {
            event.preventDefault();
            return;
        }
    }
    Pencil.rasterizer.cleanup();
}, false);













