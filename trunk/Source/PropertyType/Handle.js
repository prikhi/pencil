function Handle(x, y) {
    this.x = x ? x : 0;
    this.y = y ? y : 0;
}
Handle.REG_EX = /^([\-0-9]+)\,([\-0-9]+)$/;
Handle.fromString = function(literal) {
    var handle = new Handle();
    if (literal.match(Handle.REG_EX)) {
        handle.x = parseInt(RegExp.$1);
        handle.y = parseInt(RegExp.$2);
    }
    
    return handle;
};

Handle.prototype.toString = function () {
    return this.x + "," + this.y;
};
