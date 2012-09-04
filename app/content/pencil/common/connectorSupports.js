/**
 * Utility functions for implementing the connector module
 */
 
var Connector = {};

Connector.invalidateInboundConnections = function (canvas, shape) {
    var target = canvas.createControllerFor(shape);
    var outlets = target.getConnectorOutlets();
    if (outlets == null) return;
    var outletMap = {};
    for (var i = 0; i < outlets.length; i ++) {
        outletMap[outlets[i].id] = outlets[i];
    }
    
    Dom.workOn("./svg:g[@p:type='Shape']", canvas.drawingLayer, function (node) {
        if (canvas.isShapeLocked(node)) return;
        
        var defId = canvas.getType(node);
        
        var def = CollectionManager.shapeDefinition.locateDefinition(defId);
        var handleProps = [];
        for (var i = 0; i < def.propertyGroups.length; i ++) {
            for (var j = 0; j < def.propertyGroups[i].properties.length; j ++) {
                var prop = def.propertyGroups[i].properties[j];
                if (prop.type == Handle) {
                    handleProps.push(prop);
                }
            }
        }
        if (handleProps.length == 0) return;
        var source = canvas.createControllerFor(node);

        for (var i = 0; i < handleProps.length; i ++) {
            var prop = handleProps[i];
            var handle = source.getProperty(prop.name);
            if (!handle.meta ||
                !handle.meta.connectedShapeId ||
                !handle.meta.connectedOutletId) continue;

            if (handle.meta.connectedShapeId != shape.id) continue;
            if (!outletMap[handle.meta.connectedOutletId]) continue;

            var outlet = outletMap[handle.meta.connectedOutletId];
            
            var m = shape.getTransformToElement(node);
            var p = Svg.pointInCTM(outlet.x, outlet.y, m);
            handle.x = p.x;
            handle.y = p.y;
            source.setProperty(prop.name, handle);
        }
    });
};

Connector.invalidateOutboundConnections = function (canvas, node) {
    var defId = canvas.getType(node);
    
    var def = CollectionManager.shapeDefinition.locateDefinition(defId);
    var handleProps = [];
    for (var i = 0; i < def.propertyGroups.length; i ++) {
        for (var j = 0; j < def.propertyGroups[i].properties.length; j ++) {
            var prop = def.propertyGroups[i].properties[j];
            if (prop.type == Handle) {
                handleProps.push(prop);
            }
        }
    }
    if (handleProps.length == 0) return;
    var source = canvas.createControllerFor(node);

    for (var i = 0; i < handleProps.length; i ++) {
        var prop = handleProps[i];
        var handle = source.getProperty(prop.name);
        if (!handle.meta ||
            !handle.meta.connectedShapeId ||
            !handle.meta.connectedOutletId) continue;

        var shape = Dom.getSingle(".//svg:g[@p:type='Shape'][@id='" + handle.meta.connectedShapeId + "']", canvas.drawingLayer);
        if (!shape) continue;
        
        var target = canvas.createControllerFor(shape);
        var outlets = target.getConnectorOutlets();
        if (outlets == null) continue;
        var outlet = null;
        for (var j = 0; j < outlets.length; j ++) {
            if (outlets[j].id == handle.meta.connectedOutletId) {
                outlet = outlets[j];
                break;
            }
        }

        if (!outlet) continue;
        
        var m = shape.getTransformToElement(node);
        var p = Svg.pointInCTM(outlet.x, outlet.y, m);
        handle.x = p.x;
        handle.y = p.y;
        source.setProperty(prop.name, handle);
    }
};

Connector.areClassesMatched = function (classes1, classes2) {
    for (var i = 0; i < classes1.length; i ++) {
        if (classes1[i] == "*" || classes2.indexOf(classes1[i]) >= 0) return true;
    }

    return false;
};
Connector.getMatchingOutlets = function (canvas, shape, classes) {
    var matchingOutlets = [];
    var classes1 = classes.split(/[ ]*\,[ ]*/);
    Dom.workOn("./svg:g[@p:type='Shape']", canvas.drawingLayer, function (node) {
        if (node.id == shape.id) return;
        
        var source = canvas.createControllerFor(node);
        var outlets = source.getConnectorOutlets();
        if (!outlets) return;

        var m = node.getTransformToElement(shape);
        
        for (var i = 0; i < outlets.length; i ++) {
            var outlet = outlets[i];
            var classes2 = outlet.classes.split(/[ ]*\,[ ]*/);
            if (!Connector.areClassesMatched(classes1, classes2)) continue;
            
            var p = Svg.pointInCTM(outlet.x, outlet.y, m);
            outlet.x = p.x;
            outlet.y = p.y;

            outlet.shapeId = node.id;

            matchingOutlets.push(outlet);
        }
    });

    return matchingOutlets;
};

function Outlet(id, classes, x, y) {
    this.id = id;
    this.classes = classes;
    this.x = x;
    this.y = y;
}

Outlet.prototype.toString = function () {
    return this.id + "[" + this.classes + "]@" + [this.x, this.y];
};

pencilSandbox.Outlet = {
    newOutlet: function (id, classes, x, y) {
        return new Outlet(id, classes, x, y);
    }
};
for (var p in Outlet) {
    pencilSandbox.Outlet[p] = Outlet[p];
};
