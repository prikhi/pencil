// Copyright (c) Evolus Solutions. All rights reserved.
// License: GPL/MPL
// $Id$

var PencilNamespaces = {};

PencilNamespaces["p"] = "http://www.evolus.vn/Namespace/Pencil";
PencilNamespaces["svg"] = "http://www.w3.org/2000/svg";
PencilNamespaces["xlink"] = "http://www.w3.org/1999/xlink";
PencilNamespaces["xul"] = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
PencilNamespaces["html"] = "http://www.w3.org/1999/xhtml";
PencilNamespaces["xbl"] = "http://www.mozilla.org/xbl";

PencilNamespaces.resolve = function (prefix) {
    var uri = PencilNamespaces[prefix];
    if (uri) return uri;
    
    return null;
};
