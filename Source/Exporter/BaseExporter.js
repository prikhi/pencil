function BaseExporter() {
    this.id = "BaseExporter";
}
BaseExporter.prototype.requireRasterizedData = function () {
    return false;
};
BaseExporter.prototype.getWarnings = function () {
    return null;
};
BaseExporter.prototype.supportTemplating = function () {
    return false;
};
