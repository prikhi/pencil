var pageTitle = null;
var size = null;
var width = null;
var height = null;
var lastUsedItem = null;
var backgroundPage = null;
var dimBackground = null;
var backgroundColor = null;
var transparentBackground = null;
var backgroundColorPane = null;
var dimBackgroundPane = null;
var SIZE_RE = /^([0-9]+)x([0-9]+)$/;

var returnValueHolder = null;
var currentData = null;
var possibleBackgroundPages = null;

function handleOnload() {
    try {
        handleOnloadImpl();
    } catch (e) {
        Console.dumpError(e, "stdout");
    }
}
function handleOnloadImpl() {
    pageTitle = document.getElementById("pageTitle");
    size = document.getElementById("size");
    width = document.getElementById("width");
    height = document.getElementById("height");
    lastUsedItem = document.getElementById("lastUsedItem");
    bestFitItem = document.getElementById("bestFitItem");
    backgroundPage = document.getElementById("backgroundPage");
    backgroundColor = document.getElementById("backgroundColorButton");
    dimBackground = document.getElementById("dimBackground");

    backgroundColorPane = document.getElementById("backgroundColorPane");
    dimBackgroundPane = document.getElementById("dimBackgroundPane");

    currentData = window.arguments[0];
    possibleBackgroundPages = window.arguments[1];
    returnValueHolder = window.arguments[2];

    backgroundColor.color = Color.fromString("#ffffff");
    transparentBackground = true;

    //TODO: Load sizes

    //preselect size
    var lastSize = Config.get("lastSize");
    if (lastSize) {
        lastUsedItem.style.display = "";
        lastUsedItem.label = "Last used (" + lastSize + ")";
        lastUsedItem.value = lastSize;
    }

    var bestFitSize = window.opener.Pencil.getBestFitSize();
    bestFitItem.style.display = "";
    bestFitItem.label = "Best fit (" + bestFitSize + ")";
    bestFitItem.value = bestFitSize;

    if (!currentData) {
        //debug("new, lastSize: " + lastSize);
        size.selectedItem = lastSize ? lastUsedItem : bestFitItem;
    } else {
        //debug("old, size: " + [currentData.width, currentData.height].join("x"));
        //search for a predefined size that matches current size
        var result = {};
        var sizeText = [currentData.width, currentData.height].join("x");
        Dom.workOn(".//xul:menuitem[@p:predefined]", size, function (node) {
            if (node.value == sizeText) {
                result.item = node;
            }
        });
        if (result.item) {
            size.selectedItem = result.item;
        } else {
            size.value = "";
            width.value = currentData.width;
            height.value = currentData.height;
        }

        if (currentData.backgroundColor) {
            backgroundColor.color = Color.fromString(currentData.backgroundColor);
        }
        transparentBackground = currentData.transparentBackground;
    }

    //event handlers
    size.addEventListener("command", function () {
        invalidateInputs();
        if (!size.value) {
            width.focus();
            width.select();
        }
    }, false);
    backgroundPage.addEventListener("command", function () {
        invalidateInputs();
    }, false);

    //setup list of background pages
    var hasValidBackground = false;
    for (var i in possibleBackgroundPages) {
        var page = possibleBackgroundPages[i];
        var menuItem = document.createElement("menuitem");
        backgroundPage.firstChild.appendChild(menuItem);

        menuItem.setAttribute("label", page.properties.name);
        menuItem.setAttribute("value", page.properties.id);

        if (!hasValidBackground && currentData && currentData.background == page.properties.id) {
            hasValidBackground = true;
        }
    }
    if (hasValidBackground) {
        backgroundPage.value = currentData.background;
        if (currentData.dimBackground) {
            dimBackground.checked = true;
        }
    } else {
        if (transparentBackground) {
            backgroundPage.value = "transparent";
        }
    }
    if (possibleBackgroundPages.length == 0) {
        //backgroundPage.disabled = true;
        //dimBackground.disabled = true;
    }

    //preselect title
    if (currentData) {
        pageTitle.value = currentData.title;

        document.getElementById("nameText").value = "Edit page properties";
        document.title = "Page Properties";
    }

    invalidateInputs();

    pageTitle.focus();
    pageTitle.select();

    //window.sizeToContent();
}
function handleDialogAccept() {
    try {
        var data = this.getData();
        returnValueHolder.data = data;
        returnValueHolder.ok = true;
        Config.set("lastSize", [data.width, data.height].join("x"))
        return true;
    } catch (e) {
        Console.dumpError(e);
        return false;
    }
}
function handleDialogCancel() {
    returnValueHolder.ok = false;
    return true;
}
function invalidateInputs() {
    var customSizeDisabled = (size.value != "");
    if (size.value && size.value.match(SIZE_RE)) {
        width.value = RegExp.$1;
        height.value = RegExp.$2;
    }
    Dom.workOn("./xul:*", width.parentNode, function (node) {
        node.disabled = customSizeDisabled;
    });

    transparentBackground = backgroundPage.value == "transparent";
    dimBackground.disabled = backgroundPage.disabled || !backgroundPage.value;
    if (!backgroundPage.value || transparentBackground) {
        backgroundColorPane.style.display = "";
        if (transparentBackground) {
            backgroundColorPane.style.display = "none";
        }
        dimBackgroundPane.style.visibility = "hidden";
        backgroundPage.removeAttributeNS(PencilNamespaces.p, "with-background");
    } else {
        backgroundColorPane.style.display = "none";
        dimBackgroundPane.style.visibility = "visible";
        backgroundPage.setAttributeNS(PencilNamespaces.p, "p:with-background", "true");
    }
}
function validateInput() {
    if (!pageTitle.value) throw "Title should not be empty";
    if (size.value && !size.value.match(SIZE_RE)) throw "Bad size: " + size.value;
}
function getData() {
    validateInput();

    var data = {};
    if (size.value) {
        if (size.value.match(SIZE_RE)) {
            data.width = parseInt(RegExp.$1, 10);
            data.height = parseInt(RegExp.$2, 10);
        } else throw "Ooops! You should never get here";
    } else {
        data.width = parseInt(width.value, 10);
        data.height = parseInt(height.value, 10);
    }
    data.title = pageTitle.value;
    data.background = backgroundPage.value;
    data.backgroundColor = backgroundColor.color.toString();
    data.transparentBackground = transparentBackground;
    data.dimBackground = (data.background && dimBackground.checked);

    return data;
}


window.addEventListener("load", handleOnload, false);
