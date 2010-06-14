var ExternalEditorSupports = {};

var launcherService = Components.classes['@mozilla.org/uriloader/external-helper-app-service;1']
                                    .getService(Components.interfaces.nsPIExternalAppLauncher);

var mimeService = Components.classes["@mozilla.org/mime;1"]
                              .getService(Components.interfaces.nsIMIMEService);

ExternalEditorSupports.getEditorPath = function (extension) {
    if (extension == "svg") return Config.get("external.editor.vector.path", "/usr/bin/inkscape");
    if (extension == "jpg"
        || extension == "gif"
        || extension == "png") return Config.get("external.editor.bitmap.path", "/usr/local/bin/gimp-2.7");

    throw "Unsupported type: " + extension;
};

ExternalEditorSupports.edit = function (contentProvider, contentReceiver) {
    var tmpFile = Local.newTempFile("pencil", contentProvider.extension);
    contentProvider.saveTo(tmpFile, function () {

        var protoservice = Components.classes['@mozilla.org/uriloader/external-protocol-service;1']
                                        .getService(Components.interfaces.nsIExternalProtocolService);


        var localFile = tmpFile.QueryInterface(Components.interfaces.nsILocalFile);

        var app = Components.classes["@mozilla.org/file/local;1"]
                         .createInstance(Components.interfaces.nsILocalFile);
        app.initWithPath(ExternalEditorSupports.getEditorPath(contentProvider.extension));

        var process = Components.classes["@mozilla.org/process/util;1"]
                            .createInstance(Components.interfaces.nsIProcess);
        process.init(app);

        debug(localFile.path);

        var args = [localFile.path];
        process.runAsync(args, args.length);

        var initialLastModifiedTime = localFile.lastModifiedTime;

        //track the process and file for changes
        var tracker = function () {
            if (!localFile.exists()) return;

            try {
                var lmt = localFile.lastModifiedTime;
                if (lmt > initialLastModifiedTime) {
                    initialLastModifiedTime = lmt;
                    contentReceiver.update(localFile);
                }
            } finally {
                if (process.isRunning) {
                    window.setTimeout(tracker, 1000);
                } else {
                    localFile.remove(true);
                }
            }
        };

        window.setTimeout(tracker, 1000);
    });
};
