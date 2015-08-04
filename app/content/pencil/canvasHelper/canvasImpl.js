
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
        if (grid.w > 0 && grid.h > 0) {
            var z = this.zoom ? this.zoom : 1;
            
            if (Config.get("edit.gridAppearance") === 'dots') {
                for (var i = 1; i < this.width * z; i += grid.w * z) {
                    var line = document.createElementNS(PencilNamespaces.svg, "svg:line");
                    line.setAttribute("x1", i);
                    line.setAttribute("y1", 0);
                    line.setAttribute("x2", i);
                    line.setAttribute("y2", this.height * z);
                    line.setAttribute("style", "stroke-dasharray: 1," + (grid.h - 1) * z + ";");
                    this.gridContainer.appendChild(line);
                }
            } else {
                for (var i = 1; i < this.width * z; i += grid.w * z) {
                    var line = document.createElementNS(PencilNamespaces.svg, "svg:line");
                    line.setAttribute("x1", i);
                    line.setAttribute("y1", 0);
                    line.setAttribute("x2", i);
                    line.setAttribute("y2", this.height * z);
                    this.gridContainer.appendChild(line);
                }

                for (var i = 1; i < this.height * z; i += grid.h * z) {
                    var line = document.createElementNS(PencilNamespaces.svg, "svg:line");
                    line.setAttribute("x1", 0);
                    line.setAttribute("y1", i);
                    line.setAttribute("x2", this.width * z);
                    line.setAttribute("y2", i);
                    this.gridContainer.appendChild(line);
                }
            }
        }
    }
};
