var Cc = Components.classes;
var Ci = Components.interfaces;
var Cu = Components.utils;
var Cr = Components.results;

function WebPrinter() {
    //create the window
    var iframe = document.createElementNS(PencilNamespaces.html, "html:iframe");

    var container = document.body;
    if (!container) container = document.documentElement;
    var box = document.createElement("box");
    box.setAttribute("style", "-moz-box-pack: start; -moz-box-align: start;");

    iframe.setAttribute("style", "border: none; min-width: 0px; min-height: 0px; width: 1px; height: 1px; visibility: hidden;");
    iframe.setAttribute("src", "blank.html");

    box.appendChild(iframe);
    container.appendChild(box);

    box.style.MozBoxPack = "start";
    box.style.MozBoxAlign = "start";

    var thiz = this;

    this.nextHandler = null;

    window.addEventListener("DOMFrameContentLoaded", function (event) {
        var win = iframe.contentWindow;
        debug("WebPrinter: DOMFrameContentLoaded, " + win);
        if (!win._initialized) {
            debug("WebPrinter: Initializing content window");
            win._isRasterizeFrame = true;
            win.addEventListener("MozAfterPaint", function (event) {
                //debug("MozAfterPaint: " + [event, event.originalTarget, win.document]);

                if (!event.originalTarget._isRasterizeFrame) return;
                win.setTimeout(function () {
                    if (!thiz.nextHandler) return;

                    debug("WebPrinter: calling next handler");
                    var f = thiz.nextHandler;
                    thiz.nextHandler = null;
                    f();
                }, 100);

                /*if (!event.originalTarget._isRasterizeFrame) return;
                if (!thiz.nextHandler) return;

                var f = thiz.nextHandler;
                thiz.nextHandler = null;
                f();*/

            }, false);

            var document = iframe.contentDocument.documentElement;
            document.style = document.style || {};
            document.style.backgroundColor = "rgba(0, 0, 0, 0)";
            win._initialized = true;
        }
    }, false);

    this.win = iframe.contentWindow;
    this.win.document.body.setAttribute("style", "padding: 0px; margin: 0px;")
};
WebPrinter.prototype.printUrl = function (url, settings, callback) {
    var thiz = this;
    this.nextHandler = function () {
        thiz._printWindow(settings, callback);
    };
    this.win.location.href = url;
};
WebPrinter.prototype._printWindow = function (settings, callback) {
    var printSettings = Cc["@mozilla.org/gfx/printsettings-service;1"]
                                                            .getService(Ci.nsIPrintSettingsService)
                                                            .newPrintSettings;
    printSettings.printSilent = true;
    printSettings.showPrintProgress = false;
    printSettings.printBGImages = true;
    printSettings.printBGColors = true;
    printSettings.printToFile = true;
    printSettings.toFileName = settings.filePath;
    printSettings.printFrameType = Ci.nsIPrintSettings.kFramesAsIs;
    printSettings.outputFormat = Ci.nsIPrintSettings.kOutputFormatPDF;

    printSettings.footerStrCenter = "";
    printSettings.footerStrLeft     = "";
    printSettings.footerStrRight    = "";
    printSettings.headerStrCenter = "";
    printSettings.headerStrLeft     = "";
    printSettings.headerStrRight    = "";
    printSettings.marginTop = 0;
    printSettings.marginRight = 0;
    printSettings.marginBottom = 0;
    printSettings.marginLeft = 0;
    printSettings.unwriteableMarginTop = 0;
    printSettings.unwriteableMarginRight = 0;
    printSettings.unwriteableMarginBottom = 0;
    printSettings.unwriteableMarginLeft = 0;
    printSettings.printBGColors = true;
    printSettings.title = "Pencil printing";
    var listener = {
        onStateChange: function(aWebProgress, aRequest, aStateFlags, aStatus) {
            if (aStateFlags & Ci.nsIWebProgressListener.STATE_STOP) {
                callback();
            }
        },
        onProgressChange : function(aWebProgress, aRequest, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress) {},

        onLocationChange : function() { throw "Unexpected onLocationChange"; },
        onStatusChange     : function() { throw "Unexpected onStatusChange";     },
        onSecurityChange : function() { throw "Unexpected onSecurityChange"; }
    };

    var webBrowserPrint = this.win.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebBrowserPrint);
    webBrowserPrint.print(printSettings, listener);
};

