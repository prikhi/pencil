var Compat = {};

var appInfo = Components.classes["@mozilla.org/xre/app-info;1"]
  .getService(Components.interfaces.nsIXULAppInfo);

Compat.xre_version = appInfo.platformVersion.split('.')[0];

Compat.saveUri = function(persist, uri, headers, localFile) {
  if (Compat.xre_version >= '36') {
    persist.saveURI(uri, null, null, null, null, headers, localFile, null);
  } else {
    persist.saveURI(uri, null, null, null, headers, localFile, null);
  }
}
