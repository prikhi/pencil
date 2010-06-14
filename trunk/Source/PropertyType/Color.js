hexdig='0123456789ABCDEF';
function Dec2Hex(d) {
    return hexdig.charAt((d-(d%16))/16)+hexdig.charAt(d%16);
}
function Hex2Dec(h) {
    return parseInt(h, 16);
}

function RGB2Hex(r,g,b) {
    return Dec2Hex(r)+Dec2Hex(g)+Dec2Hex(b);
}

// RGB2HSV and HSV2RGB are based on Color Match Remix [http://color.twysted.net/]
// which is based on or copied from ColorMatch 5K [http://colormatch.dk/]
function HSV2RGB(hsv) {
    var rgb=new Object();
    if (hsv.saturation==0) {
        rgb.r=rgb.g=rgb.b=Math.round(hsv.value*2.55);
    } else {
        hsv.hue/=60;
        hsv.saturation/=100;
        hsv.value/=100;
        i=Math.floor(hsv.hue);
        f=hsv.hue-i;
        p=hsv.value*(1-hsv.saturation);
        q=hsv.value*(1-hsv.saturation*f);
        t=hsv.value*(1-hsv.saturation*(1-f));
        switch(i) {
        case 0: rgb.r=hsv.value; rgb.g=t; rgb.b=p; break;
        case 1: rgb.r=q; rgb.g=hsv.value; rgb.b=p; break;
        case 2: rgb.r=p; rgb.g=hsv.value; rgb.b=t; break;
        case 3: rgb.r=p; rgb.g=q; rgb.b=hsv.value; break;
        case 4: rgb.r=t; rgb.g=p; rgb.b=hsv.value; break;
        default: rgb.r=hsv.value; rgb.g=p; rgb.b=q;
        }
        rgb.r=Math.round(rgb.r*255);
        rgb.g=Math.round(rgb.g*255);
        rgb.b=Math.round(rgb.b*255);
    }
    return rgb;
}

function min3(a,b,c) { return (a<b)?((a<c)?a:c):((b<c)?b:c); }
function max3(a,b,c) { return (a>b)?((a>c)?a:c):((b>c)?b:c); }

function RGB2HSV(rgb) {
    hsv = new Object();
    max=max3(rgb.r,rgb.g,rgb.b);
    dif=max-min3(rgb.r,rgb.g,rgb.b);
    hsv.saturation=(max==0.0)?0:(100*dif/max);
    if (hsv.saturation==0) hsv.hue=0;
    else if (rgb.r==max) hsv.hue=60.0*(rgb.g-rgb.b)/dif;
    else if (rgb.g==max) hsv.hue=120.0+60.0*(rgb.b-rgb.r)/dif;
    else if (rgb.b==max) hsv.hue=240.0+60.0*(rgb.r-rgb.g)/dif;
    if (hsv.hue<0.0) hsv.hue+=360.0;
    hsv.value=Math.round(max*100/255);
    hsv.hue=Math.round(hsv.hue);
    hsv.saturation=Math.round(hsv.saturation);
    return hsv;
}

function Color() {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 1.0;
}
Color.REG_EX = /^#([0-9A-F]{2,2})([0-9A-F]{2,2})([0-9A-F]{2,2})([0-9A-F]{2,2})$/i;
Color.REG_EX_NO_ALPHA = /^#([0-9A-F]{2,2})([0-9A-F]{2,2})([0-9A-F]{2,2})$/i;
Color.REG_EX_RGB = /^rgb\(([0-9]+)\,[ ]*([0-9]+)\,[ ]*([0-9]+)\)$/i;
Color.fromString = function (literal) {
    var color = new Color();
    if (!literal) literal = "#ffffffff";

    if (literal.match(Color.REG_EX)) {
        color.r = parseInt(RegExp.$1, 16);
        color.g = parseInt(RegExp.$2, 16);
        color.b = parseInt(RegExp.$3, 16);
        color.a = parseInt(RegExp.$4, 16) / 255;
    } else if (literal.match(Color.REG_EX_NO_ALPHA)) {
        color.r = parseInt(RegExp.$1, 16);
        color.g = parseInt(RegExp.$2, 16);
        color.b = parseInt(RegExp.$3, 16);
        color.a = 1;
    } else if (literal.match(Color.REG_EX_RGB)) {
        //debug("found rgb()");
        color.r = parseInt(RegExp.$1, 10);
        color.g = parseInt(RegExp.$2, 10);
        color.b = parseInt(RegExp.$3, 10);
        color.a = 1;
        //debug("found rgb(): " + color);
    } if (literal == "transparent") {
        color.r = 0;
        color.g = 0;
        color.b = 0;
        color.a = 0;
        //debug("transparent");
    }

    return color;
};
Color.fromHSV = function (h, s, v) {
    var rgb = HSV2RGB({hue: h, saturation: s, value: v});
    var color = new Color();

    color.r = rgb.r;
    color.g = rgb.g;
    color.b = rgb.b;
    color.a = 1;

    return color;
};
Color.prototype.toString = function () {
    return this.toRGBString() + Dec2Hex(Math.min(255, Math.round(this.a * 255)));
};
Color.prototype.toRGBString = function () {
    return "#" + Dec2Hex(this.r) + Dec2Hex(this.g) + Dec2Hex(this.b);
};
Color.prototype.toRGBAString = function () {
    return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + (Math.round(this.a * 100) / 100) + ")";
};
Color.prototype.shaded = function (percent) {
    var hsv = RGB2HSV(this);
    hsv.value = Math.max(Math.min(hsv.value * (1 - percent), 100), 0);


    var rgb = HSV2RGB(hsv);

    var color = new Color();
    color.r = rgb.r;
    color.g = rgb.g;
    color.b = rgb.b;

    color.a = this.a;
    return color;
};
Color.prototype.hollowed = function (percent) {
    var color = new Color();
    color.r = this.r;
    color.g = this.g;
    color.b = this.b;

    color.a = Math.max(Math.min(this.a * (1 - percent), 1), 0);
    return color;
};
Color.prototype.getHSV = function () {
    return RGB2HSV(this); //h: 0..259, s: 0..100, v: 0..100
};

pencilSandbox.Color = Color;

