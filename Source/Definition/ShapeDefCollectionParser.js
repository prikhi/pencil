// Copyright (c) Evolus Solutions. All rights reserved.
// License: GPL/MPL
// $Id$

/* class */ function ShapeDefCollectionParser() {
}
ShapeDefCollectionParser.prototype.injectEntityDefs = function (content, file) {
	//getting the current local
	var locale = Config.getLocale();
	
	var dtdFile = file.parent.clone();
	dtdFile.append(locale + ".dtd");
	
	if (!dtdFile.exists()) {
		dtdFile = file.parent.clone();
		dtdFile.append("default.dtd");
		
		if (!dtdFile.exists()) {
		    dtdFile = file.parent.clone();
		    dtdFile.append("en-US.dtd");
		
		    if (!dtdFile.exists()) {
			    return content;
		    }
		}
	}
	
	var dtdContent = FileIO.read(dtdFile, ShapeDefCollectionParser.CHARSET);
	
	var doctypeContent = "<!DOCTYPE Shapes [\n" + dtdContent + "\n]>\n";
	
	content = content.replace(/(<Shapes)/, function (zero, one) {
			return doctypeContent + one;
		});
	
	return content;
};
ShapeDefCollectionParser.CHARSET = "UTF-8";
ShapeDefCollectionParser.getCollectionPropertyConfigName = function (collectionId, propName) {
    return "Collection." + collectionId + ".properties." + propName;
};

/* public ShapeDefCollection */ ShapeDefCollectionParser.prototype.parseURL = function (url) {
    try {
        netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
        var dom = document.implementation.createDocument("", "", null);
        dom.async = false;
        dom.load(url);

        return this.parse(dom);
    } catch (e) {
        Console.dumpError(e, "stdout");
    }
};
/* public ShapeDefCollection */ ShapeDefCollectionParser.prototype.parseFile = function (file, uri) {
    try {
        var fileContents = FileIO.read(file, ShapeDefCollectionParser.CHARSET);
        var domParser = new DOMParser();

        
        fileContents = this.injectEntityDefs(fileContents, file)
        debug("---- AFTER INJECTION ----");
        debug(fileContents.substring(0, 200));
        
        var dom = domParser.parseFromString(fileContents, "text/xml");

        return this.parse(dom, uri);
    } catch (e) {
        Console.dumpError(e, "stdout");
    }
};
/* public ShapeDefCollection */ ShapeDefCollectionParser.prototype.parse = function (dom, uri) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
    var collection = new ShapeDefCollection();
    collection.url = uri ? uri : dom.documentURI;

    var s1 = dom.documentURI.toString();
    var s2 = window.location.href.toString();

    var max = Math.min(s1.length, s2.length);
    var i = 0;
    for (i = 0; i < max; i++) {
        if (s1[i] != s2[i] ) break;
    }
    collection.relURL = s1.substring(i);

    var shapeDefsNode = dom.documentElement;
    collection.id = shapeDefsNode.getAttribute("id");
    collection.displayName = shapeDefsNode.getAttribute("displayName");
    collection.description = shapeDefsNode.getAttribute("description");
    collection.author = shapeDefsNode.getAttribute("author");
    collection.infoUrl = shapeDefsNode.getAttribute("url");

    Dom.workOn("./p:Script", shapeDefsNode, function (scriptNode) {
        var context = { collection: collection };
        with (context) {
            eval(scriptNode.textContent);
        }
    });

    this.parseCollectionProperties(shapeDefsNode, collection);

    var parser = this;
    Dom.workOn("./p:Shape | ./p:Shortcut", shapeDefsNode, function (node) {
        if (node.localName == "Shape") {
            collection.addDefinition(parser.parseShapeDef(node, collection));
        } else {
            collection.addShortcut(parser.parseShortcut(node, collection));
        }
    });


    return collection;
};
/* private void */ ShapeDefCollectionParser.prototype.parseCollectionProperties = function (shapeDefsNode, collection) {
    Dom.workOn("./p:Properties/p:PropertyGroup", shapeDefsNode, function (propGroupNode) {
        var group = new PropertyGroup;
        group.name = propGroupNode.getAttribute("name");

        Dom.workOn("./p:Property", propGroupNode, function (propNode) {
            var property = new Property();
            property.name = propNode.getAttribute("name");
            property.displayName = propNode.getAttribute("displayName");
            var type = propNode.getAttribute("type");
            try {
                property.type = eval("" + type);
            } catch (e) {
                alert(e);
                throw "Invalid property type: " + type;
            }
            property.initialValue = property.type.fromString(Dom.getText(propNode));

            try {
                var s = Config.get(ShapeDefCollectionParser.getCollectionPropertyConfigName (collection.id, property.name));
                property.value = property.type.fromString(s);
            } catch (e) {
                property.value = property.initialValue;
            }

            debug([property.name, property.value]);

            group.properties.push(property);
            collection.properties[property.name] = property;
        });

        collection.propertyGroups.push(group);
    });
};
/* public ShapeDef */ ShapeDefCollectionParser.prototype.parseShapeDef = function (shapeDefNode, collection) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
    var shapeDef = new ShapeDef();
    shapeDef.id = collection.id + ":" + shapeDefNode.getAttribute("id");
    shapeDef.displayName = shapeDefNode.getAttribute("displayName");
    shapeDef.system = shapeDefNode.getAttribute("system") == "true";
    shapeDef.collection = collection;
    var iconPath = shapeDefNode.getAttribute("icon");
    iconPath = collection.url.substring(0, collection.url.lastIndexOf("/") + 1) + iconPath;
    shapeDef.iconPath = iconPath;

    var parser = this;

    //parse properties
    Dom.workOn("./p:Properties/p:PropertyGroup", shapeDefNode, function (propGroupNode) {
        var group = new PropertyGroup;
        group.name = propGroupNode.getAttribute("name");

        Dom.workOn("./p:Property", propGroupNode, function (propNode) {
            var property = new Property();
            property.name = propNode.getAttribute("name");
            property.displayName = propNode.getAttribute("displayName");
            var type = propNode.getAttribute("type");
            try {
                property.type = eval("" + type);
            } catch (e) {
                alert(e);
                throw "Invalid property type: " + type;
            }
            var valueElement = Dom.getSingle("./p:*", propNode);
            if (valueElement) {
                if (valueElement.localName == "E") {
                    var expression = Dom.getText(valueElement);
                    expression = expression.replace(/\$\$([a-z][a-z0-9]*)/gi, function (zero, one) {
                        return "collection.properties." + one + ".value";
                    });

                    property.initialValueExpression = expression;
                } else if (valueElement.localName == "Null") {
                    property.initialValue = null;
                }
            } else {
                property.initialValue = property.type.fromString(Dom.getText(propNode));
            }

            property.relatedProperties = {};
            //parsing meta
            Dom.workOn("./@p:*", propNode, function (metaAttribute) {
                var metaValue = metaAttribute.nodeValue;
                metaValue = metaValue.replace(/\$([a-z][a-z0-9]*)/gi, function (zero, one) {
                    property.relatedProperties[one] = true;
                    return "properties." + one;
                });
                property.meta[metaAttribute.localName] = metaValue;
            });

            group.properties.push(property);
            shapeDef.propertyMap[property.name] = property;
        });

        shapeDef.propertyGroups.push(group);
    });

    //parse behaviors
    Dom.workOn("./p:Behaviors/p:For", shapeDefNode, function (forNode) {
        var behavior = new Behavior();
        behavior.target = forNode.getAttribute("ref");

        shapeDef.behaviorMap[behavior.target] = behavior;


        Dom.workOn("./p:*", forNode, function (behaviorItemNode) {
            var item = new BehaviorItem();
            item.handler = Pencil.behaviors[behaviorItemNode.localName];
            var count = Dom.workOn("./p:Arg", behaviorItemNode, function (argNode) {
                item.args.push(new BehaviorItemArg(Dom.getText(argNode), shapeDef, behavior.target, argNode.getAttribute("literal")));
            });

            if (count == 0) {
                var text = Dom.getText(behaviorItemNode);
                item.args.push(new BehaviorItemArg(text, shapeDef, behavior.target, null));
            }

            behavior.items.push(item);
        });

        shapeDef.behaviors.push(behavior);
    });

    //parsing actions
    Dom.workOn("./p:Actions/p:Action", shapeDefNode, function (actionNode) {

        var action = new ShapeAction();
        action.id = actionNode.getAttribute("id");
        action.displayName = actionNode.getAttribute("displayName");

        var implNode = Dom.getSingle("./p:Impl", actionNode);
        var text = implNode.textContent;
        action.implFunction = null;
        try {
            action.implFunction = eval("var x = function () {\n" + text + "\n}; x;");
        } catch (e) {
            Console.dumpError(e);
        }

        shapeDef.actionMap[action.id] = action;
        shapeDef.actions.push(action);

    });

    // pickup the content node
    shapeDef.contentNode = Dom.getSingle("./p:Content", shapeDefNode);

    // replacing id -> p:name
    Dom.workOn(".//*[@id]", shapeDef.contentNode, function (node) {
        var id = node.getAttribute("id");
        node.setAttributeNS(PencilNamespaces.p, "p:name", id);
        node.removeAttribute("id");
    });

    return shapeDef;
};
/* public Shortcut */ ShapeDefCollectionParser.prototype.parseShortcut = function (shortcutNode, collection) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
    var shortcut = new Shortcut();
    
    shortcut.displayName = shortcutNode.getAttribute("displayName");
    shortcut.system = shortcutNode.getAttribute("system") == "true";
    shortcut.collection = collection;
    var iconPath = shortcutNode.getAttribute("icon");
    iconPath = collection.url.substring(0, collection.url.lastIndexOf("/") + 1) + iconPath;
    shortcut.iconPath = iconPath;

    var shapeId = collection.id + ":" + shortcutNode.getAttribute("to");
    var shapeDef = collection.getShapeDefById(shapeId);
    
    if (!shapeDef) throw "Bad shortcut. Target shape def is not found: " + shapeId;
    
    shortcut.shape = shapeDef;
    shortcut.id = "system:ref:" + shortcut.displayName.replace(/[^a-z0-9]+/gi, "_").toLowerCase() + shortcut.shape.id;
    
    //parse property values
    Dom.workOn(".//p:PropertyValue", shortcutNode, function (propValueNode) {
        var name = propValueNode.getAttribute("name");

        var valueElement = Dom.getSingle("./p:*", propValueNode);
        var spec = {};
        if (valueElement) {
            if (valueElement.localName == "E") {
                var expression = Dom.getText(valueElement);
                expression = expression.replace(/\$\$([a-z][a-z0-9]*)/gi, function (zero, one) {
                    return "collection.properties." + one + ".value";
                });

                spec.initialValueExpression = expression;
            } else if (valueElement.localName == "Null") {
                spec.initialValue = null;
            }
        } else {
            var type = shapeDef.getProperty(name).type;
            spec.initialValue = type.fromString(Dom.getText(propValueNode));
        }

        shortcut.propertyMap[name] = spec;
    });

    return shortcut;
};

























