function Dimension(w, h) {
    this.w = w ? w : 0;
    this.h = h ? h : 0;
}
Dimension.REG_EX = /^([0-9\.\-]+)\,([0-9\.\-]+)$/;
Dimension.fromString = function(literal) {
    var dim = new Dimension();
    if (literal.match(Dimension.REG_EX)) {
        dim.w = parseInt(RegExp.$1);
        dim.h = parseInt(RegExp.$2);
    }
    
    return dim;
};

Dimension.prototype.toString = function () {
    return this.w + "," + this.h;
};
Dimension.prototype.narrowed = function (delta, delta2) {
    var dim = new Dimension(this.w - delta, this.h - (typeof(delta2) == "undefined" ? delta : delta2));
    return dim;
};
