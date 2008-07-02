function ImageData(w, h, data) {
    this.data = data;
    this.w = w;
    this.h = h;
}
ImageData.REG_EX = /^([0-9]+)\,([0-9]+)\,([^\0]+)$/;
ImageData.fromString = function (literal) {
    if (literal.match(ImageData.REG_EX)) {
        return new ImageData(parseInt(RegExp.$1),
                            parseInt(RegExp.$2),
                            RegExp.$3);
    }
    return new ImageData(literal);
};
ImageData.ios = Components.classes["@mozilla.org/network/io-service;1"]
                    .getService(Components.interfaces.nsIIOService);


ImageData.prompt = function (callback) {
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, "Select Image", nsIFilePicker.modeOpen);
    fp.appendFilter("Images", "*.png; *.jpg; *.jpeg; *.gif; *.bmp; *.svg");
    fp.appendFilter("All Files", "*");
    
    if (fp.show() != nsIFilePicker.returnOK) return null;
    
    var url = ImageData.ios.newFileURI(fp.file).spec;
    
    Pencil.rasterizer.getImageDataFromUrl(url, callback);
    
};
ImageData.prototype.toString = function () {
    return [this.w, this.h, this.data].join(",");
};
