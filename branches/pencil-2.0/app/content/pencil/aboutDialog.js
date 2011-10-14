function handleOnload() {
    try {
        var req = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"]
                    .createInstance(Components.interfaces.nsIXMLHttpRequest);

        req.open("GET", "chrome://pencil/content/license.txt", false);
        req.send(null);
        document.getElementById("licenseText").value = req.responseText;
    } catch (e) {
        Console.dumpError(e);
    }
};

window.addEventListener("load", handleOnload, false);