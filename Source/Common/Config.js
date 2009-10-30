var Config = {};

Config.prefs = Components.classes["@mozilla.org/preferences-service;1"].
                    getService(Components.interfaces.nsIPrefBranch);

Config._buildName = function(name) {
    return "pencil.config." + name;
};
Config.set = function (name, value) {
    if (typeof(value) == "boolean") {
        Config.prefs.setBoolPref(Config._buildName(name), value);
        return;
    }
    if (typeof(value) == "number") {
        Config.prefs.setIntPref(Config._buildName(name), value);
        return;
    }
    if (typeof(value) == "string") {
        var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
        str.data = value;
        Config.prefs.setComplexValue(Config._buildName(name), Components.interfaces.nsISupportsString, str);

        return;
    }
    if (typeof(value) == "object" && value.length && value.join && value.shift) {
        Config.set(name + ".length", value.length);
        for (var i = 0; i < value.length; i ++) {
            Config.set(name + "." + i, value[i]);
        }
        return;
    }
};

Config.get = function (name, defaultValue) {
    var type = Config.prefs.getPrefType(Config._buildName(name));

    if (typeof(defaultValue) == "undefined") defaultValue = null;
    switch (type) {
        case 32:
            try {
                str = Config.prefs.getComplexValue(Config._buildName(name), Components.interfaces.nsISupportsString);
                return str.data;
            } catch (e) {
                return defaultValue;
            }
        case 64:
            return Config.prefs.getIntPref(Config._buildName(name));

        case 128:
            return Config.prefs.getBoolPref(Config._buildName(name));

        case 0:
            type = Config.prefs.getPrefType(Config._buildName(name + ".length"));
            if (type == 64) {
                var len = Config.get(name + ".length");
                var a = [];
                for (var i = 0; i < len; i ++) {
                    a.push(Config.get(name + "." + i));
                }

                return a;
            }
    }

    return defaultValue;
};

