function ShapeXferHelper(canvas) {
    this.canvas = canvas;

    this.type = ShapeXferHelper.MIME_TYPE;
}
ShapeXferHelper.MIME_TYPE = "pencil/shape";

ShapeXferHelper.prototype.toString = function () {
    return "ShapeXferHelper: " + ShapeXferHelper.MIME_TYPE;
};
ShapeXferHelper.prototype.handleData = function (data, length) {
    

    var systemString = data.QueryInterface(Components.interfaces.nsISupportsString);
    var xml = systemString.data.substring(0, length / 2);

    var parser = new DOMParser();
    var dom = parser.parseFromString(xml, "text/xml");

    //validate
    var shape = Dom.getSingle("/svg:g[@p:type='Shape' or @p:type='Group']", dom);

    if (!shape) {
        throw "Bad data in the clipboard";
    }

    shape = this.canvas.ownerDocument.importNode(shape, true);
    Dom.renewId(shape);
    if (Config.get("edit.cutAndPasteAtTheSamePlace") == null ){
        Config.set("edit.cutAndPasteAtTheSamePlace", false);
    }
    if (!Config.get("edit.cutAndPasteAtTheSamePlace")) {
        var grid = Pencil.getGridSize()
        var dx = Math.round(Math.random() * 50);
        dx = dx - (dx % grid.w);

        var dy = Math.round(Math.random() * 50);
        dy = dy - (dy % grid.h);
    } else {
        dx = 0;
        dy = 0;
    }
    this.canvas.run(function() {
        this.canvas.drawingLayer.appendChild(shape);
        this.canvas.selectShape(shape);

        this.canvas.currentController.moveBy(dx, dy);
        this.canvas.ensureControllerInView();

        this.canvas.snappingHelper.updateSnappingGuide(this.canvas.currentController);
    }, this);
    this.canvas.invalidateEditors();
};

Pencil.registerXferHelper(ShapeXferHelper);
