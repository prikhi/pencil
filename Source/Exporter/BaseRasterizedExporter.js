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

BaseRasterizedExporter.prototype.export = function (doc, pages, extraDataMap, options, dir) {
};
BaseRasterizedExporter.prototype.getWarnings = function () {
    return "No linkings are preserved when the document is exported to rasterized images";
};
Pencil.registerDocumentExporter(new BaseRasterizedExporter());
