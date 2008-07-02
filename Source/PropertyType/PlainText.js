function PlainText(s) {
    this.value = s;
}
PlainText.fromString = function (literal) {
    return new PlainText(literal);
};
PlainText.prototype.toString = function () {
    return this.value;
};
