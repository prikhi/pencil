function ODTExporer() {
    this.name = "OpenOffice.org document (ODT file)";
    this.id = "ODTExporer";
    this.xsltProcessor = new XSLTProcessor();
}
ODTExporer.RASTERIZED_SUBDIR = "Pages";

ODTExporer.prototype = new BaseRasterizedExporter();

ODTExporer.prototype.getRasterizedPageDestination = function (baseDir) {
    this.tmpDir = Local.createTempDir("pencilodt");
    var dir = this.tmpDir.clone();
    dir.append(ODTExporer.RASTERIZED_SUBDIR);

    return dir;
};
ODTExporer.prototype.supportTemplating = function () {
    return true;
};
ODTExporer.prototype.getTemplates = function () {
    return ExportTemplateManager.getTemplatesForType("ODT");
};
ODTExporer.prototype.getWarnings = function () {
    return null;
};

ODTExporer.prototype.transform = function (template, fileBaseName, sourceDOM, targetDir) {
    var styleSheetFile = template.dir.clone();
    styleSheetFile.append(fileBaseName + ".xslt");
    
    if (!styleSheetFile.exists()) return;
    
    this.xsltProcessor.reset();
    
    var xsltDOM = Dom.parseFile(styleSheetFile);
    this.xsltProcessor.importStylesheet(xsltDOM);

    var result = this.xsltProcessor.transformToDocument(sourceDOM);

    var xmlFile = targetDir.clone();
    xmlFile.append(fileBaseName + ".xml");

    Dom.serializeNodeToFile(result, xmlFile);
};

ODTExporer.prototype.export = function (doc, options, destFile, xmlFile) {
    var templateId = options.templateId;
    if (!templateId) return;
    
    var template = ExportTemplateManager.getTemplateById(templateId);

    //copying support files to a temp dir
    if (!this.tmpDir) {
        this.tmpDir = Util.createTempDir("pencilodt");
    }
    
    var items = template.dir.directoryEntries;
    while (items.hasMoreElements()) {
        var file = items.getNext().QueryInterface(Components.interfaces.nsIFile);
        
        //ignore the xslt files
        if (file.leafName.match(/\.xslt$/)) continue;
            
        var targetFile = this.tmpDir.clone();
        targetFile.append(file.leafName);

        if (targetFile.exists()) targetFile.remove(true);

        file.copyTo(this.tmpDir, "");
    }

    //transform the xml to HTML
    var sourceDOM = Dom.parseFile(xmlFile);
    
    //changing rasterized path to relative
    this.fixAbsoluteRasterizedPaths(sourceDOM, this.tmpDir);
    
    this.transform(template, "content", sourceDOM, this.tmpDir);
    this.transform(template, "meta", sourceDOM, this.tmpDir);
    this.transform(template, "settings", sourceDOM, this.tmpDir);
    this.transform(template, "styles", sourceDOM, this.tmpDir);
    
    Util.compress(this.tmpDir, destFile);
    this.tmpDir.remove(true);
    this.tmpDir = null;
};
ODTExporer.prototype.getOutputType = function () {
    return BaseExporter.OUTPUT_TYPE_FILE;
};
ODTExporer.prototype.getOutputFileExtensions = function () {
    return [
        {
            title: "OpenOffice.org Document (*.odt)",
            ext: "*.odt"
        }
    ];
};
Pencil.registerDocumentExporter(new ODTExporer());
