var CanvasImpl = {};

CanvasImpl.setupGrid = function () {
    if (this.gridContainer) {
        Dom.empty(this.gridContainer);
    } else {
        this.gridContainer = document.createElementNS(PencilNamespaces.svg, "svg:g");
        this.gridContainer.setAttributeNS(PencilNamespaces.p, "p:name", "grids");
        this.gridContainer.setAttribute("transform", "translate(-0.5, -0.5)");
        this.bgLayer.appendChild(this.gridContainer);
    }

    if (Config.get("grid.enabled") == null) {
        Config.set("grid.enabled", true);
    }
    if (Config.get("grid.enabled")) {
        var grid = Pencil.getGridSize();
        var z = this.zoom ? this.zoom : 1;
        for (var i = grid.w * z; i < this.width * z; i += grid.w * z) {
            var line = document.createElementNS(PencilNamespaces.svg, "svg:line");
            line.setAttribute("x1", i);
            line.setAttribute("y1", grid.h * z);
            line.setAttribute("x2", i);
            line.setAttribute("y2", this.height * z);
            line.setAttribute("style", "stroke-dasharray: 1, " + grid.w * z + ";");
            this.gridContainer.appendChild(line);
        }
    }
};
