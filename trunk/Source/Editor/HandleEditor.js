function HandleEditor() {
    this.svgElement = null;
    this.canvas = null;
}
HandleEditor.ANCHOR_SIZE = 6;
HandleEditor.configDoc = Dom.loadSystemXml("HandleEditor.config.xml");
HandleEditor.prototype.install = function (canvas) {
    this.canvas = canvas;
    this.canvas.onScreenEditors.push(this);
    this.svgElement = canvas.ownerDocument.importNode(Dom.getSingle("/p:Config/svg:g", HandleEditor.configDoc), true);
    this.svgContainer = Dom.getSingle("./svg:g[@class='Inner']", this.svgElement)

    this.svgElement.style.visibility = "hidden";
    canvas.installControlSVGElement(this.svgElement);


    //register event
    var thiz = this;

    //registering event on the outmost item to have better UI interation
    var outmostItem = this.svgElement.ownerDocument.documentElement;
    outmostItem.addEventListener("mousedown", function (ev) {
        if (thiz.passivated) {
            outmostItem.removeEventListener("mousedown", arguments.callee, false);
            return;
        }
        thiz.handleMouseDown(ev);
    }, false);
    outmostItem.addEventListener("mouseup", function (ev) {
        if (thiz.passivated) {
            outmostItem.removeEventListener("mouseup", arguments.callee, false);
            return;
        }
        thiz.handleMouseUp(ev);
    }, false);
    outmostItem.addEventListener("mousemove", function (ev) {
        if (thiz.passivated) {
            outmostItem.removeEventListener("mousemove", arguments.callee, false);
            return;
        }
        thiz.handleMouseMove(ev);
    }, false);

};
HandleEditor.prototype.attach = function (targetObject) {
    if (targetObject.constructor != Shape) {
        this.dettach();
        return;
    }

    this.targetObject = targetObject;

    var geo = this.canvas.getZoomedGeo(this.targetObject);
    this.setEditorGeometry(geo);

    this.svgElement.style.visibility = "visible";
    this.setupHandles();
};
HandleEditor.prototype.invalidate = function () {
    if (!this.targetObject) return;
    var currentTarget = this.targetObject;
    this.dettach();
    this.attach(currentTarget);
};
HandleEditor.prototype.nextTool = function () {
    //just ignore this, since this editor implements only one tool set
};

HandleEditor.prototype.dettach = function () {
    if (!this.targetObject) return;

    this.targetObject = null;
    this.svgElement.style.visibility = "hidden";
};

HandleEditor.prototype.setEditorGeometry = function (geo) {
    //transformation
    Svg.ensureCTM(this.svgElement, geo.ctm);
    this.geo = geo;
};
HandleEditor.prototype.findHandle = function (element) {
    var thiz = this;
    var handle = Dom.findUpward(element, function (node) {
        return node._isHandle && (node._editor == thiz);
    });

    return handle;
};
HandleEditor.prototype.handleMouseDown = function (event) {
    this.currentHandle = this.findHandle(event.originalTarget);
    this.oX = event.clientX;
    this.oY = event.clientY;
};
HandleEditor.prototype.handleMouseUp = function (event) {
    try {
        if (this.currentHandle && this.targetObject) {
            //commiting the change
            this.currentHandle._x = this.currentHandle._newX;
            this.currentHandle._y = this.currentHandle._newY;

            var h = new Handle(Math.round(this.currentHandle._x / this.canvas.zoom), Math.round(this.currentHandle._y / this.canvas.zoom));
            Console.log(event.originalTarget.nodeName + ": " + this.targetObject);
            this.targetObject.setProperty(this.currentHandle._def.name, h);

            this.canvas.invalidateEditors(this);
        }
    } finally {
        this.currentHandle = null;
    }
};
HandleEditor.prototype.handleMouseMove = function (event) {
    event.preventDefault();
    if (!this.currentHandle) return;

    var uPoint1 = Svg.vectorInCTM(new Point(this.oX, this.oY), this.geo.ctm);
    var uPoint2 = Svg.vectorInCTM(new Point(event.clientX, event.clientY), this.geo.ctm);


    dx = uPoint2.x - uPoint1.x;
    dy = uPoint2.y - uPoint1.y;

    var constraints = this.getPropertyConstraints(this.currentHandle);

    dx = constraints.lockX ? 0 : dx;
    dy = constraints.lockY ? 0 : dy;

    var grid = Pencil.getGridSize();
    if (!event.shiftKey) {
        dx = grid.w * Math.round(dx / grid.w);
        dy = grid.h * Math.round(dy / grid.h);
    }

    var newX = this.currentHandle._x + dx;
    var newY = this.currentHandle._y + dy;


    if (!constraints.lockX) newX = Math.min(Math.max(newX, constraints.minX), constraints.maxX);
    if (!constraints.lockY) newY = Math.min(Math.max(newY, constraints.minY), constraints.maxY);

    this.currentHandle._newX = newX;
    this.currentHandle._newY = newY;

    Svg.setX(this.currentHandle, this.currentHandle._newX);
    Svg.setY(this.currentHandle, this.currentHandle._newY);

};
HandleEditor.prototype.getPropertyConstraints = function (handle) {
    if (!this.currentHandle) return {};
    return this.getPropertyConstraintsFromDef(this.currentHandle._def);
};
HandleEditor.prototype.getPropertyConstraintsFromDef = function (def) {
    if (!def) return {};

    this.targetObject.prepareExpressionEvaluation();

    var meta = def.meta;
    return {lockX: this.targetObject.evalExpression(meta.lockX, false),
            lockY: this.targetObject.evalExpression(meta.lockY, false),
            disabled: this.targetObject.evalExpression(meta.disabled, false),
            maxX: this.targetObject.evalExpression(meta.maxX, Number.MAX_VALUE),
            minX: this.targetObject.evalExpression(meta.minX, 0 - Number.MAX_VALUE),
            maxY: this.targetObject.evalExpression(meta.maxY, Number.MAX_VALUE),
            minY: this.targetObject.evalExpression(meta.minY, 0 - Number.MAX_VALUE)
            };
};

HandleEditor.prototype.createHandle = function (def, value) {
    var p = value;
    if (!p) return;

    p.x *= this.canvas.zoom;
    p.y *= this.canvas.zoom;

    var rect = this.svgElement.ownerDocument.createElementNS(PencilNamespaces.svg, "rect");
    rect.setAttribute("x", p.x);
    rect.setAttribute("y", p.y);
    rect.setAttribute("width", HandleEditor.ANCHOR_SIZE);
    rect.setAttribute("height", HandleEditor.ANCHOR_SIZE);
    rect.setAttribute("title", def.displayName);

    rect.setAttribute("transform", "translate(" + [0 - HandleEditor.ANCHOR_SIZE / 2, 0 - HandleEditor.ANCHOR_SIZE / 2] + ")");

    rect.setAttributeNS(PencilNamespaces.p, "p:name", "Handle");
    rect._isHandle = true;
    rect._editor = this;
    rect._def = def;
    rect._x = p.x;
    rect._y = p.y;
    rect._newX = p.x;
    rect._newY = p.y;

    this.svgElement.appendChild(rect);

    try {
        var constraints = this.getPropertyConstraintsFromDef(def);
        if (constraints.disabled) {
            rect.style.visibility = "hidden";
        }
    } catch (e) {
        Console.dumpError(e, "stdout");
    }
};
HandleEditor.prototype.setupHandles = function () {
    //remove all handles
    while (this.svgElement.lastChild._isHandle) this.svgElement.removeChild(this.svgElement.lastChild);

    var properties = this.targetObject.getProperties();
    var def = this.targetObject.def;

    for (name in properties) {
        var value = properties[name];
        if (value.constructor != Handle) {
            continue;
        }

        this.createHandle(def.propertyMap[name], value);
    }
};






Pencil.registerEditor(HandleEditor);


























