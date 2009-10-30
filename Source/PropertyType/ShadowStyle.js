function ShadowStyle() {
    this.dx = "0";
    this.dy = "0";
    this.size = "3";
}
ShadowStyle.REG_EX = /^([^\|]+)\|([^\|]+)\|([^\|]+)$/i;
ShadowStyle.fromString = function (literal) {
    var shadowStyle = new ShadowStyle();
    if (literal.match(ShadowStyle.REG_EX)) {
        shadowStyle.dx = RegExp.$1;
        shadowStyle.dy = RegExp.$2;
        shadowStyle.size = RegExp.$3;
    }
    return shadowStyle;
};
ShadowStyle.prototype.toString = function () {
    return [this.dx, this.dy, this.size].join('|');
};
ShadowStyle.prototype.toCSSString = function (color) {
    return [this.dx + "px", this.dy + "px", this.size + "px", color.toRGBAString()].join(" ");
};

