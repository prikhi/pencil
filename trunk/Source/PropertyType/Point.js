function Point(x, y) {
    this.x = x ? x : 0;
    this.y = y ? y : 0;
}
Point.REG_EX = /^([0-9]+)\,([0-9]+)$/;
Point.fromString = function(literal) {
    var point = new Point();
    if (literal.match(Point.REG_EX)) {
        point.x = parseInt(RegExp.$1);
        point.y = parseInt(RegExp.$2);
    }
    
    return point;
};

Point.prototype.toString = function () {
    return this.x + "," + this.y;
};

pencilSandbox.Point = Point;

