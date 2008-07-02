var CanvasImpl = {};

CanvasImpl.setupGrid = function () {
    return;
    var size = Pencil.getGridSize();
    
    var nH = this.width / size.w + 1;
    var nV = this.height / size.h + 1;
    
    if (this.gridContainer) {
        //Dom.empty(this.gridContainer);
    } else {
        var g = this.ownerDocument.createElementNS(PencilNamespaces.svg, "g");
        g.setAttributeNS(PencilNamespaces.p, "p:name", "grids");
        g.setAttribute("transform", "translate(-0.5, -0.5)");
        this.bgLayer.appendChild(g);
        this.gridContainer = g;
    }
    
    for (var i = this.nHGridPainted; i < nH; i ++) {
        var p = this.ownerDocument.createElementNS(PencilNamespaces.svg, "path");
        this.gridContainer.appendChild(p);
        
        p.setAttribute("d", [M(Math.round(i * size.w * this.zoom), -1), L(Math.round(i * size.w * this.zoom), this.height + 1)].join(" "));
    }
    for (var i = this.nVGridPainted; i < nV; i ++) {
        var p = this.ownerDocument.createElementNS(PencilNamespaces.svg, "path");
        this.gridContainer.appendChild(p);
        
        p.setAttribute("d", [M(-1, Math.round(i * size.h * this.zoom)), L(this.width + 1, Math.round(i * size.h * this.zoom))].join(" "));
    }
    
    this.nHGridPainted = Math.max(this.nHGridPainted, nH);
    this.nVGridPainted = Math.max(this.nVGridPainted, nV);
};
