
function SearchService(options) {
	this.options = options;
	
	this.engines = [];
	
	this.currentEngine = null;
}

SearchService.prototype.getEngines = function() {
	return this.engines;
}

SearchManager = {
	searchService: null,
	getSearchService: function() {
	    if (this.searchService == null) {
	    	this.searchService = new SearchService();
	    }
	    return this.searchService;
    },
	registerSearchEngine: function(constructor, isDefault) {
    	try {
    		var se = new constructor();
    		if (se) {
    			debug("Register search engine: " + se.name);
    			this.getSearchService().engines.push(se);
    			if (isDefault) {
    				this.setCurrentEngine(se);
    			}
    		}
    	} catch (e) {
    		error("Failed to register search engine: " + e);
    	}
    },
    setCurrentEngine: function(se) {
    	this.getSearchService().currentEngine = se;
    },
    
    activeCanvas: null
}

handleOnload = function(abc) {
	debug("args: " + window.arguments);
	if (window.arguments.length > 0) {
		SearchManager.activeCanvas = window.arguments[0];
	}
}

window.addEventListener("load", handleOnload, false);