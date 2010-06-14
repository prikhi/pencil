function PlainText(s) {
    this.value = s;
}
PlainText.fromString = function (literal) {
    return new PlainText(literal);
};
PlainText.prototype.toString = function () {
    return this.value;
};
PlainText.fromLoremIpsum = function (words) {
    return new PlainText(loremIpsumSentence2(words));
};

pencilSandbox.PlainText = PlainText;

