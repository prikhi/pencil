function PrintingExporter() {
    this.name = "Export to printers";
    this.id = "PrintingExporter";
    this.xsltProcessor = new XSLTProcessor();
    this.xsltDOM = null;
}
PrintingExporter.HTML_FILE = "index.html";
PrintingExporter.prototype = new BaseExporter();

PrintingExporter.prototype.requireRasterizedData = function () {
    return false;
};
PrintingExporter.prototype.getRasterizedPageDestination = function (baseDir) {
    return null;
};
PrintingExporter.prototype.supportTemplating = function () {
    return true;
};
PrintingExporter.prototype.getTemplates = function () {
    return ExportTemplateManager.getTemplatesForType("Print");
};
PrintingExporter.prototype.export = function (doc, options, targetFile, xmlFile, callback) {
    var destDir = Local.createTempDir("printing");
    debug("destDir: " + destDir.path);

    var templateId = options.templateId;
    if (!templateId) return;

    var template = ExportTemplateManager.getTemplateById(templateId);

    //copying support files
    var items = template.dir.directoryEntries;
    while (items.hasMoreElements()) {
        var file = items.getNext().QueryInterface(Components.interfaces.nsIFile);

        if (file.leafName == "Template.xml"
            || file.leafName == template.styleSheet) continue;

        var destFile = destDir.clone();
        destFile.append(file.leafName);

        if (destFile.exists()) destFile.remove(true);

        file.copyTo(destDir, "");
    }

    //transform the xml to HTML
    var sourceDOM = Dom.parseFile(xmlFile);

    //changing rasterized path to relative
    //this.fixAbsoluteRasterizedPaths(sourceDOM, destDir);

    var xsltDOM = Dom.parseFile(template.styleSheetFile);

    var xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsltDOM);

    var result = xsltProcessor.transformToDocument(sourceDOM);

    var htmlFile = destDir.clone();
    htmlFile.append(PrintingExporter.HTML_FILE);

    Dom.serializeNodeToFile(result, htmlFile);
    
    var ios = Components.classes["@mozilla.org/network/io-service;1"].
              getService(Components.interfaces.nsIIOService);
    var url = ios.newFileURI(htmlFile);
    
    debug(url.spec);
    debug(targetFile.path);
    
    Pencil.printer.printUrl(url.spec, {filePath: targetFile.path}, callback);
};
PrintingExporter.prototype.getWarnings = function () {
    return null;
};
PrintingExporter.prototype.getOutputType = function () {
    return BaseExporter.OUTPUT_TYPE_FILE;
};
PrintingExporter.prototype.getOutputFileExtensions = function () {
    return [
        {
            title: "Portable Document Format (*.pdf)",
            ext: "*.pdf"
        }
    ];
};
Pencil.registerDocumentExporter(new PrintingExporter());
