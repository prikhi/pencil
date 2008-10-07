function Shape(canvas, svg) {
    this.svg = svg;
    this.canvas = canvas;
    
    var defId = this.canvas.getType(svg);
    this.def = CollectionManager.shapeDefinition.locateDefinition(defId);
    if (!this.def) {
        throw "Shape definition not found: " + defId;
    }
    
    //locating metadata node
    this.metaNode = Dom.getSingle("./p:metadata", this.svg);
    
    //construct the target node map
    this.targetMap = {};
    for (i in this.def.behaviors) {
        var name = this.def.behaviors[i].target;
        var target = Dom.getSingle(".//*[@p:name='" + name + "']", this.svg);
        if (!target) {
            debug("This object seems to be old to the current stencil definition you have. Ignoring...");
        }
        this.targetMap[name] = target;
    }
}
Shape.prototype.getName = function () {
    return this.def.displayName;
};
Shape.prototype.isFor = function (svg) {
    return this.svg == svg;
};
Shape.prototype.getProperties = function () {
    var properties = {};
    for (var name in this.def.propertyMap) {
        properties[name] = this.getProperty(name);
    }
    
    return properties;
};
Shape.prototype.getPropertyGroups = function () {
    return this.def.propertyGroups;
};

Shape.prototype.setInitialPropertyValues = function () {
    for (var name in this.def.propertyMap) {
        this.storeProperty(name, this.def.propertyMap[name].initialValue);
    }
    for (name in this.def.propertyMap) {
        this.applyBehaviorForProperty(name);
    }
};
Shape.prototype.applyBehaviorForProperty = function (name) {
    var propertyDef = this.def.propertyMap[name];
    this.prepareExpressionEvaluation();
    
    //enumerate all related target
    for (var targetName in propertyDef.relatedTargets) {
    
        //do apply any target that was already processed
        if (this._appliedTargets) {
            for (var i in this._appliedTargets) if (this._appliedTargets[i] == targetName) continue;
            this._appliedTargets.push(targetName);
        }
        
        var target = this.targetMap[targetName];
        if (!target) {
            warn("Target '" + targetName + "' is not found. Ignoring...");
            continue;
        }
        F._target = target;
        
        var behavior = this.def.behaviorMap[targetName];
        for (var i in behavior.items) {
            var item = behavior.items[i];
            
            var args = [];
            for (var j in item.args) {
                var arg = item.args[j];
                if (!arg.type) {
                    args.push(this.evalExpression(arg.literal));
                } else {
                    //FIXME: this should inspect the type and do the conversion
                    args.push(arg.literal);
                }
            }
            try {
                item.handler.apply(target, args);
            } catch (e) {
                Console.dumpError(e);
            }
        }
    }    
};
Shape.prototype.prepareExpressionEvaluation = function () {
    this._evalContext = {properties: this.getProperties(), functions: Pencil.functions};
};
Shape.prototype.evalExpression = function (expression, value) {
    var defaultValue = value ? value : null;
    if (!expression) return defaultValue;
    if (!this._evalContext) throw "Please prepare by calling prepareExpressionEvaluation() first."
    try {
        with (this._evalContext) {
            return eval("" + expression);
        }
    } catch (e) {
        return defaultValue;
    }
};
Shape.prototype.setProperty = function (name, value, nested) {
    if (!nested) {
        this._appliedTargets = [];
        this.canvas.run( function () {
            this.storeProperty(name, value);
            this.applyBehaviorForProperty(name);
        }, this);
        this._appliedTargets = [];
    } else {
        this.storeProperty(name, value);
        this.applyBehaviorForProperty(name);
    }
    this.canvas.invalidateEditors();
};
Shape.prototype.getProperty = function (name) {
    var propNode = this.locatePropertyNode(name);
    if (!propNode) return null;
    var propType = this.def.getProperty(name).type;
    
    var literal = propNode.textContent;
    if (!literal) literal = "";
    return propType.fromString(literal);
};
Shape.prototype.locatePropertyNode = function (name) {
    return Dom.getSingle("./p:property[@name='" + name +"']", this.metaNode);
};
Shape.prototype.storeProperty = function (name, value) {
    var propNode = this.locatePropertyNode(name);
    if (!propNode) {
        propNode = this.metaNode.ownerDocument.createElementNS(PencilNamespaces.p, "p:property");
        propNode.setAttribute("name", name);
        this.metaNode.appendChild(propNode);
    } else Dom.empty(propNode);
    
    var cdata = propNode.ownerDocument.createCDATASection(value.toString());
    propNode.appendChild(cdata);
};
Shape.TRANSLATE_REGEX = /^translate\(([\-0-9]+)\,([\-0-9]+)\)$/
Shape.prototype.getGeometry = function () {
    var geo = new Geometry();
    geo.ctm = this.svg.getTransformToElement(this.canvas.drawingLayer);
    geo.dim = this.getProperty("box");
    
    if (!geo.dim) {
        geo.dim = {};
        var bbox = this.svg.getBBox();
        geo.dim.w = bbox.width;
        geo.dim.h = bbox.height;
        
        geo.loc = {x: bbox.x, y: bbox.y};
    }
    
    return geo;
};
Shape.prototype.getBoundingRect = function () {
    var rect = {x: 0, y: 0, width: 0, height: 0};
    try {
        rect = this.svg.getBBox();
    } catch (e) {}
    var ctm = this.svg.getTransformToElement(this.canvas.drawingLayer);
    
    var rect = Svg.getBoundRectInCTM(rect, ctm.inverse());
    rect = {x: rect.left, y: rect.top, width: rect.right - rect.left, height: rect.bottom - rect.top};
    
    return this.canvas.getZoomedRect(rect);
};
Shape.prototype.setGeometry = function (geo) {
    if (geo.ctm) {
        Svg.ensureCTM(this.svg, geo.ctm);
    }    
    if (geo.dim) {
        //alert("commiting: " + [geo.dim.w, geo.dim.h]);
        if (this.def.propertyMap["box"]) {
            this.setProperty("box", new Dimension(geo.dim.w, geo.dim.h));
        }
    }
};

Shape.prototype.getBound = function () {
    throw "@method: Shape.prototype.getBound is now depricated, using getGeometry instead.";
    
    var box = this.getProperty("box");
    var bound = new Bound(0, 0, box.w, box.h);
    var s = this.svg.getAttribute("transform");
    if (s) {
        s = s.replace(/ /g, "");
        if (s.match(Shape.TRANSLATE_REGEX)) {
            bound.x = parseInt(RegExp.$1, 10);
            bound.y = parseInt(RegExp.$2, 10);
        }
    }
    
    return bound;
};
Shape.prototype.setBound = function (bound) {
    throw "@method: Shape.prototype.setBound(bound) is now depricated, using setGeometry(geometry) instead.";
    
    this.setProperty("box", new Dimension(bound.w, bound.h));
    this.move(bound.x, bound.y);
};
Shape.prototype.moveBy = function (x, y, zoomAware) {
    var ctm = this.svg.getTransformToElement(this.canvas.drawingLayer);
    var v = Svg.vectorInCTM({x: x / (zoomAware ? this.canvas.zoom : 1), y: y / (zoomAware ? this.canvas.zoom : 1)}, ctm, true);
    ctm = ctm.translate(v.x, v.y);
    
    Svg.ensureCTM(this.svg, ctm);
};

Shape.prototype.setPositionSnapshot = function () {
    var ctm = this.svg.getTransformToElement(this.canvas.drawingLayer);

    this.svg.transform.baseVal.consolidate();

    var translate = this.svg.ownerSVGElement.createSVGMatrix();
    translate.e = 0;
    translate.f = 0;
    
    translate = this.svg.transform.baseVal.createSVGTransformFromMatrix(translate);
    this.svg.transform.baseVal.appendItem(translate);

    this._pSnapshot = {ctm: ctm, translate: translate, x: ctm.e, y: ctm.f};
};
Shape.prototype.moveFromSnapshot = function (dx, dy, dontNormalize) {
    var v = Svg.vectorInCTM({x: dx, y: dy},
                            this._pSnapshot.ctm,
                            true);
                       
    if (!dontNormalize) {
        var grid = Pencil.getGridSize();
        newX = Util.gridNormalize(v.x + this._pSnapshot.x, grid.w);
        newY = Util.gridNormalize(v.y + this._pSnapshot.y, grid.h);
        
        v.x = newX - this._pSnapshot.x;
        v.y = newY - this._pSnapshot.y;
    }
    
    this._pSnapshot.translate.matrix.e = v.x;
    this._pSnapshot.translate.matrix.f = v.y;
};
Shape.prototype.clearPositionSnapshot = function () {
    delete this._pSnapshot;
    this._pSnapshot = null;
    this.svg.transform.baseVal.consolidate();
};
Shape.prototype.normalizePositionToGrid = function () {
    this.setPositionSnapshot();
    this.moveFromSnapshot(0, 0);
    this.clearPositionSnapshot();
};
Shape.prototype.deleteTarget = function () {
    this.svg.parentNode.removeChild(this.svg);
};
Shape.prototype.bringForward = function () {
    try {
        var next = this.svg.nextSibling;
        if (next) {
            this.canvas.run( function () {
                var parentNode = this.svg.parentNode;
                parentNode.removeChild(this.svg);
                var next2 = next.nextSibling;
                if (next2) {
                    parentNode.insertBefore(this.svg, next2);
                } else {
                    parentNode.appendChild(this.svg);
                }
            }, this);
        }
    } catch (e) { alert(e); }
};
Shape.prototype.bringToFront = function () {
    try {
        var next = this.svg.nextSibling;
        if (next) {
            this.canvas.run( function () {
                var parentNode = this.svg.parentNode;
                parentNode.removeChild(this.svg);
                parentNode.appendChild(this.svg);
            }, this);
        }
    } catch (e) { alert(e); }
};
Shape.prototype.sendBackward = function () {
    try {
        var previous = this.svg.previousSibling;
        if (previous) {
            this.canvas.run( function () {
                var parentNode = this.svg.parentNode;
                parentNode.removeChild(this.svg);
                parentNode.insertBefore(this.svg, previous);
            }, this);
        }
    } catch (e) { alert(e); }
};
Shape.prototype.sendToBack = function () {
    try {
        var previous = this.svg.previousSibling;
        if (previous) {
            this.canvas.run( function () {
                var parentNode = this.svg.parentNode;
                parentNode.removeChild(this.svg);
                parentNode.insertBefore(this.svg, parentNode.firstChild);
            }, this);
        }
    } catch (e) { alert(e); }
};

Shape.prototype.getTextEditingInfo = function () {
    var info = null;
    
    for (name in this.def.propertyMap) {
        if (this.def.propertyMap[name].type == PlainText) {
            //find a behavior that use this as text content
            for (target in this.def.behaviorMap) {
                var b = this.def.behaviorMap[target];
                for (i in b.items) {
                    if (b.items[i].handler == Pencil.behaviors.TextContent && b.items[i].args[0].literal == "properties." + name) {
                        var obj = {properties: this.getProperties(), functions: Pencil.functions};
                        var font = null;
                        for (j in b.items) {
                            if (b.items[j].handler == Pencil.behaviors.Font) {
                                var fontArg = b.items[j].args[0];
                                with (obj) {
                                    font = eval("" + fontArg.literal);
                                }
                                break;
                            }
                        }
                        var bound = null;
                        var align = null;
                        for (j in b.items) {
                            if (b.items[j].handler == Pencil.behaviors.BoxFit) {
                                with (obj) {
                                    bound = eval("" + b.items[j].args[0].literal);
                                    align = eval("" + b.items[j].args[1].literal);
                                }
                                break;
                            }
                        }
                        info = {prop: this.def.propertyMap[name],
                                value: this.getProperty(name),
                                targetName: target,
                                type: PlainText,
                                target: Dom.getSingle(".//*[@p:name='" + target + "']", this.svg),
                                bound: bound,
                                align: align,
                                font: font};
                                
                        return info;
                    }
                }
            }
        } else if (this.def.propertyMap[name].type == RichText) {
            var font = null;
            for (target in this.def.behaviorMap) {
                var b = this.def.behaviorMap[target];
                for (i in b.items) {
                    if (b.items[i].handler == Pencil.behaviors.TextContent && b.items[i].args[0].literal == "properties." + name) {
                        var obj = {properties: this.getProperties(), functions: Pencil.functions};
                        var font = null;
                        for (j in b.items) {
                            if (b.items[j].handler == Pencil.behaviors.Font) {
                                var fontArg = b.items[j].args[0];
                                with (obj) {
                                    font = eval("" + fontArg.literal);
                                }
                                break;
                            }
                        }
                        var align = null;
                        var bound = null;
                        for (j in b.items) {
                            if (b.items[j].handler == Pencil.behaviors.Bound) {
                                with (obj) {
                                    bound = eval("" + b.items[j].args[0].literal);
                                }
                                break;
                            }
                        }
                        if (bound == null) {
                            for (j in b.items) {
                                if (b.items[j].handler == Pencil.behaviors.BoxFit) {
                                    with (obj) {
                                        bound = eval("" + b.items[j].args[0].literal);
                                        align = eval("" + b.items[j].args[1].literal);
                                    }
                                    break;
                                }
                            }
                        }
                        
                        if (font) {
                            info = {
                                prop: this.def.propertyMap[name],
                                targetName: target,
                                target: Dom.getSingle(".//*[@p:name='" + target + "']", this.svg),
                                value: this.getProperty(name),
                                font: font,
                                bound: bound,
                                align: align,
                                type: RichText
                            };
                            
                            return info;
                        }
                    }
                }
            }
            return null;
        }
    }
    
    return null;
};

Shape.prototype.createTransferableData = function () {
    return {type: ShapeXferHelper.MIME_TYPE,
            dataNode: this.svg.cloneNode(true)
           };
};
Shape.prototype.lock = function () {
    this.svg.setAttributeNS(PencilNamespaces.p, "p:locked", "true");
};

Shape.prototype.markAsMoving = function (moving) {
    Svg.optimizeSpeed(this.svg, moving);
};
Shape.prototype.performAction = function (id) {
    var shapeAction = this.def.actionMap[id];
    if (!shapeAction) return;
    
    shapeAction.implFunction.apply(this, []);
}


