// Copyright (c) Evolus Solutions. All rights reserved.
// License: GPL/MPL
// $Id$

/* class */ function ShapeDefCollection() {
    this.id = null;
    this.displayName = null;

    this.shapeDefs = [];
    this.shapeDefMap = {};
    this.propertyGroups = [];
    this.properties = {};
}
/* public void */ ShapeDefCollection.prototype.addDefinition = function (shapeDef) {
    this.shapeDefs.push(shapeDef);
    this.shapeDefMap[shapeDef.id] = shapeDef;
};
/* public void */ ShapeDefCollection.prototype.addShortcut = function (shortcut) {
    this.shapeDefs.push(shortcut);
};
/* public ShapeDef */ ShapeDefCollection.prototype.getShapeDefById = function (id) {
    return this.shapeDefMap[id];
};
/* public override String */ ShapeDefCollection.prototype.toString = function () {
    return "[ShapeDefCollection: " + this.id + "]";
};


