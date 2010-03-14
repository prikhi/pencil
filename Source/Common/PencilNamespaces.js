// Copyright (c) Evolus Solutions. All rights reserved.
// License: GPL/MPL
// $Id$

var PencilNamespaces = { };

PencilNamespaces["p"] = "http://www.evolus.vn/Namespace/Pencil";
PencilNamespaces["svg"] = "http://www.w3.org/2000/svg";
PencilNamespaces["xlink"] = "http://www.w3.org/1999/xlink";
PencilNamespaces["xul"] = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
PencilNamespaces["html"] = "http://www.w3.org/1999/xhtml";
PencilNamespaces["xbl"] = "http://www.mozilla.org/xbl";

PencilNamespaces["inkscape"] = "http://www.inkscape.org/namespaces/inkscape";
PencilNamespaces["dc"] = "http://purl.org/dc/elements/1.1/";
PencilNamespaces["cc"] = "http://creativecommons.org/ns#";
PencilNamespaces["rdf"] = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
PencilNamespaces["sodipodi"] = "http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd";


PencilNamespaces.resolve = function (prefix) {
    var uri = PencilNamespaces[prefix];
    if (uri) return uri;

    return null;
};
