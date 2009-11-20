ExportTemplateManager = {}
ExportTemplateManager.templates = {};
ExportTemplateManager.templateMap = {};

ExportTemplateManager.SUPPORTED_TYPES = ["HTML"];

ExportTemplateManager.addTemplate = function (template, type) {
    if (!ExportTemplateManager.templates[type]) {
        ExportTemplateManager.templates[type] = [];
    }
    ExportTemplateManager.templates[type].push(template);
    ExportTemplateManager.templateMap[template.id] = template;
};
ExportTemplateManager.getTemplatesForType = function (type) {
    return ExportTemplateManager.templates[type];
};
ExportTemplateManager.getTemplateById = function (templateId) {
    return ExportTemplateManager.templateMap[templateId];
};

ExportTemplateManager.loadUserDefinedTemplates = function () {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");

    try {
        var templateDir = ExportTemplateManager.getUserTemplateDirectory();

        for (i in ExportTemplateManager.SUPPORTED_TYPES) {
            var type = ExportTemplateManager.SUPPORTED_TYPES[i];
            var dir = templateDir.clone();
            dir.append(type);

            ExportTemplateManager._loadUserDefinedTemplatesIn(dir, type);
        }
    } catch (e) {
        Console.dumpError(e);
    }
};
ExportTemplateManager.getUserTemplateDirectory = function () {
    var properties = Components.classes["@mozilla.org/file/directory_service;1"]
                     .getService(Components.interfaces.nsIProperties);

    var templateDir = null;
    templateDir = properties.get("ProfD", Components.interfaces.nsIFile);
    templateDir.append("Pencil");
    templateDir.append("Templates");

    return templateDir;
};
ExportTemplateManager._loadUserDefinedTemplatesIn = function (templateDir, type) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");

    //loading all templates
    debug("Loading template in " + templateDir.path);
    try {
        if (!templateDir.exists() || !templateDir.isDirectory()) return;

        var entries = templateDir.directoryEntries;
        while(entries.hasMoreElements()) {
            var dir = entries.getNext();

            dir = dir.QueryInterface(Components.interfaces.nsIFile);
            var template = ExportTemplate.parse(dir);

            if (!template) {
                Util.error("Unrecognized template at: " + dir.path);
                continue;
            }

            debug("Found template: " + template.name + ", at: " + dir.path);

            ExportTemplateManager.addTemplate(template, type);
        }
    } catch (e) {
        Console.dumpError(e);
    }
};

ExportTemplateManager.loadTemplates = function() {
    ExportTemplateManager.templates = {};
    ExportTemplateManager.templateMap = {};
    
    ExportTemplateManager.loadUserDefinedTemplates();
};
ExportTemplateManager.installNewTemplate = function (type) {
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, "Open Document", nsIFilePicker.modeOpen);
    fp.appendFilter("Pencil " + type + " Export Templates (*.epxt; *.zip)", "*.epxt; *.zip");
    fp.appendFilter("All Files", "*");

    if (fp.show() != nsIFilePicker.returnOK) return;

    ExportTemplateManager.installTemplateFromFile(fp.file, type);
}
ExportTemplateManager.installTemplateFromFile = function (file, type) {
    var zipReader = Components.classes["@mozilla.org/libjar/zip-reader;1"]
                   .createInstance(Components.interfaces.nsIZipReader);
    zipReader.open(file);

    var targetDir = ExportTemplateManager.getUserTemplateDirectory();
    //generate a random number
    targetDir.append(type);
    if (!targetDir.exists()) {
        targetDir.create(targetDir.DIRECTORY_TYPE, 0777);
    }

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
            if (testParts.length > 1) {
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

    try {
        var template = ExportTemplate.parse(extractedDir);
        if (!template) throw "Template cannot be parsed";

        Util.info("Template '" + template.name + "' has been installed successfully");
        ExportTemplateManager.loadTemplates();
    } catch (e) {
        Util.error("Error installing template", "" + e);
        extractedDir.remove(true);
    }
};
ExportTemplateManager.uninstallTemplate = function (template) {
    //TODO:
}
