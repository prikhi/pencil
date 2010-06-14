var ios = Components.classes["@mozilla.org/network/io-service;1"]
                    .getService(Components.interfaces.nsIIOService);

CollectionManager = {}
CollectionManager.shapeDefinition = {};
CollectionManager.shapeDefinition.collections = [];
CollectionManager.shapeDefinition.shapeDefMap = {};
CollectionManager.shapeDefinition.shortcutMap = {};

CollectionManager.addShapeDefCollection = function (collection) {
    if (!collection) return;
    CollectionManager.shapeDefinition.collections.push(collection);
    collection.visible = CollectionManager.isCollectionVisible(collection);
    collection.collapsed = CollectionManager.isCollectionCollapsed(collection);

    for (var item in collection.shapeDefs) {
        var shapeDef = collection.shapeDefs[item];
        if (shapeDef.constructor == Shortcut) {
            CollectionManager.shapeDefinition.shortcutMap[shapeDef.id] = shapeDef;
        } else {
            CollectionManager.shapeDefinition.shapeDefMap[shapeDef.id] = shapeDef;
        }
    }
};
CollectionManager.shapeDefinition.locateDefinition = function (shapeDefId) {
    return CollectionManager.shapeDefinition.shapeDefMap[shapeDefId];
};
CollectionManager.shapeDefinition.locateShortcut = function (shortcutId) {
    return CollectionManager.shapeDefinition.shortcutMap[shortcutId];
};
CollectionManager.loadUserDefinedStencils = function () {
    


    try {
        var stencilDir = CollectionManager.getUserStencilDirectory();
        debug("Loading optional stencils in: " + stencilDir.path);
        CollectionManager._loadUserDefinedStencilsIn(stencilDir);
    } catch (e) {
        Console.dumpError(e);
    }

    try {
        var properties = Components.classes["@mozilla.org/file/directory_service;1"]
                         .getService(Components.interfaces.nsIProperties);

        stencilDir = properties.get("resource:app", Components.interfaces.nsIFile);
        stencilDir.append("Stencils");
        debug("Loading optional stencils in: " + stencilDir.path);
        CollectionManager._loadUserDefinedStencilsIn(stencilDir);
    } catch (e) {
        Console.dumpError(e);
    }

};
CollectionManager.getUserStencilDirectory = function () {
    var properties = Components.classes["@mozilla.org/file/directory_service;1"]
                     .getService(Components.interfaces.nsIProperties);

    var stencilDir = null;
    stencilDir = properties.get("ProfD", Components.interfaces.nsIFile);
    stencilDir.append("Pencil");
    stencilDir.append("Stencils");

    return stencilDir;
};
CollectionManager._loadUserDefinedStencilsIn = function (stencilDir) {
    

    var parser = new ShapeDefCollectionParser();

    //loading all stencils
    try {
        if (!stencilDir.exists() || !stencilDir.isDirectory()) return;
        var entries = stencilDir.directoryEntries;
        while(entries.hasMoreElements())
        {
            var definitionFile = entries.getNext();
            definitionFile.QueryInterface(Components.interfaces.nsIFile);
            definitionFile.append("Definition.xml");
            if (!definitionFile.exists() || definitionFile.isDirectory()) continue;

            var uri = ios.newFileURI(definitionFile);

            try {
                var collection = parser.parseFile(definitionFile, uri.spec);
                collection.userDefined = true;
                collection.installDirPath = definitionFile.parent.path;
                CollectionManager.addShapeDefCollection(collection);
            } catch (ex) {
                alert("Warning:\nThe stencil at: " + definitionFile.path + " cannot be parsed.\nError: " + ex.message);
                continue;
            }
        }
    } catch (e) {
        Console.dumpError(e);
    }
};

CollectionManager.loadStencils = function() {
    CollectionManager.shapeDefinition.collections = [];
    CollectionManager.shapeDefinition.shapeDefMap = { };

    //load all system stencils
    var parser = new ShapeDefCollectionParser();
    CollectionManager.addShapeDefCollection(parser.parseURL("../Stencil/Common/Definition.xml"));
    CollectionManager.addShapeDefCollection(parser.parseURL("../Stencil/Annotation/Definition.xml"));
    CollectionManager.addShapeDefCollection(parser.parseURL("../Stencil/BasicWebElements/Definition.xml"));
    CollectionManager.addShapeDefCollection(parser.parseURL("../Stencil/Gtk.GUI/Definition.xml"));
    CollectionManager.addShapeDefCollection(parser.parseURL("../Stencil/WindowsXP-GUI/Definition.xml"));
    CollectionManager.addShapeDefCollection(parser.parseURL("../Stencil/Native.GUI/Definition.xml"));
    CollectionManager.addShapeDefCollection(parser.parseURL("../Stencil/SketchyGUI/Definition.xml"));

    CollectionManager.loadUserDefinedStencils();
    PrivateCollectionManager.loadPrivateCollections();

    Pencil.collectionPane.reloadCollections();
    Pencil.privateCollectionPane.reloadCollections();
};
CollectionManager.installNewCollection = function () {
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, "Open Document", nsIFilePicker.modeOpen);
    fp.appendFilter("Pencil Collection Archives (*.epc; *.zip)", "*.epc; *.zip");
    fp.appendFilter("All Files", "*");

    if (fp.show() != nsIFilePicker.returnOK) return;

    CollectionManager.installCollectionFromFile(fp.file);
}
CollectionManager.installCollectionFromFile = function (file) {
    var zipReader = Components.classes["@mozilla.org/libjar/zip-reader;1"]
                   .createInstance(Components.interfaces.nsIZipReader);
    zipReader.open(file);

    var targetDir = CollectionManager.getUserStencilDirectory();
    //generate a random number
    targetDir.append(file.leafName.replace(/\.[^\.]+$/, "") + "_" + Math.ceil(Math.random() * 1000) + "_" + (new Date().getTime()));

    var targetPath = targetDir.path;

    var isWindows = true;
    if (navigator.platform.indexOf("Windows") < 0) {
        isWindows = false;
    }

    var entryEnum = zipReader.findEntries(null);
    while (entryEnum.hasMore()) {
        var entry = entryEnum.getNext();

        var targetFile = Components.classes["@mozilla.org/file/local;1"]
                   .createInstance(Components.interfaces.nsILocalFile);
        targetFile.initWithPath(targetPath);

        debug(entry);
        if (zipReader.getEntry(entry).isDirectory) continue;

        var parts = entry.split("\\");
        if (parts.length == 1) {
            parts = entry.split("/");
        } else {
            var testParts = entry.split("/");
            if (testParts.lenth > 1) {
                debug("unregconized entry (bad name): " + entry);
                continue;
            }
        }
        for (var i = 0; i < parts.length; i ++) {
            targetFile.append(parts[i]);
        }

        debug("Extracting '" + entry + "' --> " + targetFile.path + "...");

        var parentDir = targetFile.parent;
        if (!parentDir.exists()) {
            parentDir.create(parentDir.DIRECTORY_TYPE, 0777);
        }
        zipReader.extract(entry, targetFile);
        targetFile.permissions = 0600;
    }
    var extractedDir = Components.classes["@mozilla.org/file/local;1"]
                   .createInstance(Components.interfaces.nsILocalFile);

    extractedDir.initWithPath(targetPath);

    //try loading the collection
    try {
        var definitionFile = Components.classes["@mozilla.org/file/local;1"]
                       .createInstance(Components.interfaces.nsILocalFile);

        definitionFile.initWithPath(targetPath);
        definitionFile.append("Definition.xml");

        if (!definitionFile.exists()) throw "Collection specification is not found in the archive. The file may be corrupted."

        var uri = ios.newFileURI(definitionFile);

        var parser = new ShapeDefCollectionParser();
        var collection = parser.parseFile(definitionFile, uri.spec);

        //check for duplicate of name
        for (i in CollectionManager.shapeDefinition.collections) {
            var existingCollection = CollectionManager.shapeDefinition.collections[i];
            if (existingCollection.id == collection.id) {
                throw "Collection named '" + collection.id + "' already installed.";
            }
        }
        collection.userDefined = true;
        if (!Util.confirmWithWarning("Are you sure you want to install the unsigned collection: " + collection.displayName,
                                     new RichText("<p>Since a collection may contain execution code that could harm your machine. " +
                                                  "It is highly recommended that you should <em>only install collections from authors whom you trust</em>.</p>"), "Install")) {
            extractedDir.remove(true);
            return;
        }

        CollectionManager.setCollectionVisible(collection, true);
        CollectionManager.setCollectionCollapsed(collection, false);

        CollectionManager.addShapeDefCollection(collection);
        CollectionManager.loadStencils();
    } catch (e) {
        Util.error("Error installing collection", "" + e);

        //removing the extracted dir
        extractedDir.remove(true);

        return;
    }
};
CollectionManager.installCollectionFromFilePath = function (filePath) {
    var file = Components.classes["@mozilla.org/file/local;1"]
                   .createInstance(Components.interfaces.nsILocalFile);
    file.initWithPath(filePath);

    CollectionManager.installCollectionFromFile(file);
};
CollectionManager.setCollectionVisible = function (collection, visible) {
    collection.visible = visible;
    Config.set("Collection." + collection.id + ".visible", visible);
};
CollectionManager.isCollectionVisible = function (collection) {
    var visible = Config.get("Collection." + collection.id + ".visible");
    if (visible == null) visible = true;
    return visible;
};
CollectionManager.setCollectionCollapsed = function (collection, collapsed) {
    collection.collapsed = collapsed;
    Config.set("Collection." + collection.id + ".collapsed", collapsed);
};
CollectionManager.isCollectionCollapsed = function (collection) {
    var collapsed = Config.get("Collection." + collection.id + ".collapsed");
    if (collapsed == null) collapsed = false;
    return collapsed;
};
CollectionManager.uninstallCollection = function (collection) {
    if (!collection.installDirPath || !collection.userDefined) return;
    if (!Util.confirm("Are you sure you want to uninstall " + collection.displayName + "?",
                      "Warning: uninstalling a collection makes shapes created by that collection uneditable.")) return;
    var dir = Components.classes["@mozilla.org/file/local;1"]
                   .createInstance(Components.interfaces.nsILocalFile);
    dir.initWithPath(collection.installDirPath);

    dir.remove(true);
    CollectionManager.loadStencils();
}
