function UnimplementedExporter(name) {
    this.name = name;
    this.invalid = true;
    this.id = name;
}
UnimplementedExporter.prototype = new BaseExporter();

Pencil.registerDocumentExporter(new UnimplementedExporter("OpenOffice.org document (ODT file)"));
Pencil.registerDocumentExporter(new UnimplementedExporter("Microsoft Word document (DOC file)"));
Pencil.registerDocumentExporter(new UnimplementedExporter("PDF document"));
