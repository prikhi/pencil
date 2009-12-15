function RichText(html) {
    this.html = html;
}
RichText.fromString = function (html) {
    return new RichText(html);
};
RichText.prototype.toString = function () {
    return this.html;
};

RichText.fromLoremIpsum = function (words) {
    return new RichText(loremIpsumSentence2(words));
};
