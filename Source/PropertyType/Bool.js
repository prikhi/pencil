function Bool(value) {
    this.value = value ? true : false;
}
Bool.fromString = function(literal) {
    var bool = new Bool(literal == "true");
    return bool;
};

Bool.prototype.toString = function () {
    return "" + this.value;
};
Bool.prototype.negative = function () {
    return new Bool(!this.value);
};

pencilSandbox.Bool = Bool;

