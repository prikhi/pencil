function BaseRasterizedExporter() {
    this.name = "Rasterized graphics (PNG files)";
    this.id = "BaseRasterizedExporter";
}
BaseRasterizedExporter.prototype = new BaseExporter();

BaseRasterizedExporter.prototype.requireRasterizedData = function () {
    return true;
};
BaseRasterizedExporter.prototype.getRasterizedPageDestination = function (baseDir) {
    return baseDir.clone();
};

BaseRasterizedExporter.prototype.export = function (doc, pages, extraDataMap, options, dir, callback) {
    callback();
};
BaseRasterizedExporter.prototype.getWarnings = function () {
    return "No linkings are preserved when the document is exported to rasterized images";
};
BaseRasterizedExporter.prototype.fixAbsoluteRasterizedPaths = function (sourceDOM, destDir) {
    //changing rasterized path to relative
    var pathPrefix = destDir.path + DirIO.sep;
    Dom.workOn("//p:Page/@rasterized", sourceDOM, function (attr) {
        var path = attr.nodeValue;
        if (path.indexOf(pathPrefix) == 0) {
            path = path.substring(pathPrefix.length);
            attr.nodeValue = path;
        }
    });
};

Pencil.registerDocumentExporter(new BaseRasterizedExporter());
