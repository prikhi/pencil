function Rasterizer(format) {
    this.format = format;
    
    //create the window
    var iframe = document.createElementNS(PencilNamespaces.html, "html:iframe");

    var container = document.body;
    if (!container) container = document.documentElement;
    var box = document.createElement("box");
    box.setAttribute("style", "-moz-box-pack: start; -moz-box-align: start;");

    iframe.setAttribute("style", "border: none; min-width: 0px; min-height: 0px; width: 1px; height: 1px; xvisibility: hidden;");
    iframe.setAttribute("src", "blank.html");
    
    box.appendChild(iframe);
    container.appendChild(box);
    
    box.style.MozBoxPack = "start";
    box.style.MozBoxAlign = "start";
    
    this.win = iframe.contentWindow;
    this.win.document.body.setAttribute("style", "padding: 0px; margin: 0px;")
};
Rasterizer.prototype.getImageDataFromUrl = function (url, callback) {
    this.win.document.body.innerHTML = "";
    var image = this.win.document.createElementNS(PencilNamespaces.html, "img");
    
    //pickup the image width & height
   
    image.addEventListener("load", function (event) {
        try {
            callback(new ImageData(image.width, image.height, url));
        } catch (e) {
            Console.dumpError(e);
        }
    }, false);
    this.win.document.body.appendChild(image);
    image.setAttribute("src", url);
};
Rasterizer.prototype.rasterizePageToUrl = function (page, callback) {
    var svg = document.createElementNS(PencilNamespaces.svg, "svg");
    svg.setAttribute("width", "" + page.properties.width  + "px");
    svg.setAttribute("height", "" + page.properties.height  + "px");
    
    this._width = page.properties.width;
    this._height = page.properties.height;
    
    if (page._view.canvas.hasBackgroundImage) {
        var bgImage = page._view.canvas.backgroundImage.cloneNode(true);
        bgImage.removeAttribute("transform");
        bgImage.removeAttribute("id");
        svg.appendChild(bgImage);
    }
    
    var drawingLayer = page._view.canvas.drawingLayer.cloneNode(true);
    drawingLayer.removeAttribute("transform");
    drawingLayer.removeAttribute("id");
    svg.appendChild(drawingLayer);

    this.win.document.body.innerHTML = "";
    this.win.document.body.appendChild(this.win.document.importNode(svg, true));

    var thiz = this;    
    window.setTimeout(function () {
        thiz.rasterizeWindowToUrl(callback);
    }, 10);
};

Rasterizer.prototype.rasterizeWindowToUrl = function (callback) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    var h = 0;
    var w = 0;
    if (this._width && this._height) {
        w = this._width;
        h = this._height;
    } else {
        var d =  this.win.document;
        if( d.compatMode == "CSS1Compat" )
        {
          h = d.documentElement.scrollHeight;
          w = d.documentElement.scrollWidth;
        }
        else
        {
          h = d.body.scrollHeight;
          w = d.body.scrollWidth;
        }
    }
    var canvasW = w;
    var canvasH = h;
    
    var canvas = document.createElementNS(PencilNamespaces.html, "canvas");
    canvas.style.width = canvasW + "px";
    canvas.style.height = canvasH + "px";
    canvas.width = canvasW;
    canvas.height = canvasH;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.save();
    ctx.scale(1, 1);
    ctx.drawWindow(this.win, 0, 0, w, h, "rgba(255,255,255,0)");
    ctx.restore();
    
    data = {
        url: canvas.toDataURL("image/png", ""),
        width: canvasW,
        height: canvasH
    };
    callback(data);
};
Rasterizer.prototype.rasterizeDOM = function (svgNode, filePath, callback) {
    this.win.document.body.innerHTML = "";
    this.win.document.body.appendChild(this.win.document.importNode(svgNode, true));

    var thiz = this;    
    window.setTimeout(function () {
        thiz.rasterizeWindow(filePath, callback);
    }, 10);
};

Rasterizer.prototype.rasterizeWindow = function (filePath, callback) {
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    
    var h = 0;
    var w = 0;
    var d =  this.win.document;
    if( d.compatMode == "CSS1Compat" )
    {
      h = d.documentElement.scrollHeight;
      w = d.documentElement.scrollWidth;
    }
    else
    {
      h = d.body.scrollHeight;
      w = d.body.scrollWidth;
    }
    var canvasW = w;
    var canvasH = h;
    
    var canvas = document.createElementNS(PencilNamespaces.html, "canvas");
    canvas.style.width = canvasW + "px";
    canvas.style.height = canvasH + "px";
    canvas.width = canvasW;
    canvas.height = canvasH;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.save();
    ctx.scale(1, 1);
    ctx.drawWindow(this.win, 0, 0, w, h, "rgba(255,255,255,0)");
    ctx.restore();
    
    data = canvas.toDataURL("image/png", "");
    
    this.saveURI(data, filePath);
    
    callback();
};

Rasterizer.prototype.saveURI = function (url, file)
{
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");

    uri = Components.classes["@mozilla.org/network/standard-url;1"].
          createInstance(Components.interfaces.nsIURI);
    uri.spec = url;

    localFile = Components.classes["@mozilla.org/file/local;1"].
                createInstance(Components.interfaces.nsILocalFile)
    localFile.initWithPath(file)

    persistListener = new PersistProgressListener();
    persist = Components.classes["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"].
              createInstance(Components.interfaces.nsIWebBrowserPersist);

    persist.progressListener = persistListener;
    persist.saveURI(uri, null, null, null, null, localFile);
    //persist.cancelSave();
}

function PersistProgressListener()
{
  this.init();
}

PersistProgressListener.prototype =
{
  QueryInterface : function(aIID)
  {
    if(aIID.equals(Components.interfaces.nsIWebProgressListener))
      return this;
    throw Components.results.NS_NOINTERFACE;
  },

  init : function()
  {
  },

  destroy : function()
  {
  },

  // nsIWebProgressListener
  onProgressChange : function (aWebProgress, aRequest,
                               aCurSelfProgress, aMaxSelfProgress,
                               aCurTotalProgress, aMaxTotalProgress)
  {
  },

  onStateChange : function(aWebProgress, aRequest, aStateFlags, aStatus)
  {
  },

  onLocationChange : function(aWebProgress, aRequest, aLocation)
  {
  },

  onStatusChange : function(aWebProgress, aRequest, aStatus, aMessage)
  {
  },

  onSecurityChange : function(aWebProgress, aRequest, aState)
  {
  }
};
