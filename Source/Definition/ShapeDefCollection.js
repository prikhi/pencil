// Copyright (c) Evolus Solutions. All rights reserved.
// License: GPL/MPL
// $Id$

/* class */ function ShapeDefCollection() {
    this.id = null;
    this.displayName = null;

    this.shapeDefs = [];
    this.propertyGroups = [];
    this.properties = {};
}
/* public override String */ ShapeDefCollection.prototype.toString = function () {
    return "[ShapeDefCollection: " + this.id + "]";
};


