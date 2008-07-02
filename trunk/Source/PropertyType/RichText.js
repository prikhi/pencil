function RichText(html) {
    this.html = html;
}
RichText.fromString = function (html) {
    return new RichText(html);
};
RichText.prototype.toString = function () {
    return this.html;
};

