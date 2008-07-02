var PropertyDialog = {};
function setup() {
    PropertyDialog.setupReally();
}
function clean() {
    try {
        PropertyDialog.clean();
    } catch (e) {alert(); }
}
PropertyDialog.setupReally = function () {
    try {
        var editor = window.opener._dialogArgument;
        PropertyDialog.editor = editor;

        var tabs = document.getElementById("tabs");
        var tabPanels = document.getElementById("tabPanels");
        
        PropertyDialog.propertyMap = {};
        //creating tabs
        for (var i in editor.groups) {
            var group = editor.groups[i];
            
            //create a tab for this group
            var tab = document.createElementNS(PencilNamespaces.xul, "tab");
            tab.setAttribute("label", group.name);
            tabs.appendChild(tab);
            
            var tabPanel = document.createElementNS(PencilNamespaces.xul, "tabpanel");
            tabPanel.setAttribute("id", "tab" + new Date().getTime());
            tabPanels.appendChild(tabPanel);
            
            var vbox = document.createElementNS(PencilNamespaces.xul, "vbox");
            vbox.setAttribute("flex", "1");
            tabPanel.appendChild(vbox);
            
            for (var j in group.properties) {
                var property = group.properties[j];
                
                var separator = document.createElementNS(PencilNamespaces.xul, "separator");
                separator.setAttribute("class", "groove");
                if (j > 0) vbox.appendChild(separator);

                var tagName = editor.constructor.getTypeEditor(property.type);
                var editorWrapper = document.createElementNS(PencilNamespaces.xul, "peditorwrapper");

                editorWrapper.setAttribute("editor", tagName);
                editorWrapper.setAttribute("name", property.displayName);
                var value = editor.properties[property.name];
                if (value) editorWrapper.setAttribute("value", value.toString());
                else {
                    value = PropertyDialog.editor.targetObject.getProperty(property.name, "any");
                    if (value) {
                        editorWrapper.setAttribute("initial-value", value.toString());
                    }
                }

                vbox.appendChild(editorWrapper);

                
                PropertyDialog.propertyMap[property.name] = editorWrapper;
                
            }
        }
        if (tabs.parentNode.selectedIndex < 0) tabs.parentNode.selectedIndex = 0;
        document.title = editor.targetObject.getName() + " Properties";

        window.setTimeout(function () { window.sizeToContent(); }, 100);
    } catch (e) {}
    
};

PropertyDialog.clean = function () {
    var tabs = document.getElementById("tabs");
    var tabPanels = document.getElementById("tabPanels");
    
    while (tabs.hasChildNodes()) tabs.removeChild(tabs.firstChild);
    while (tabPanels.hasChildNodes()) tabPanels.removeChild(tabPanels.firstChild);
    
    //window.sizeToContent();
    
    document.title = "Properties";
};

PropertyDialog.doApply = function () {
    for (name in PropertyDialog.propertyMap) {
        var editor = PropertyDialog.propertyMap[name];
        
        //apply change to only modified properties
        if (editor.isModified()) {
            var value = editor.getValue();
            PropertyDialog.editor.targetObject.setProperty(name, value);
        }
    }
    return false;
};
PropertyDialog.doCancel = function () {
    return true;
};

window.addEventListener("DOMContentLoaded", function(event) {
}, false);

window.addEventListener("beforeunload", function(event) {
    window.opener._dialogArgument.propertyWindow = null;
    window.opener._dialogArgument.dialogShown = false;
}, false);







