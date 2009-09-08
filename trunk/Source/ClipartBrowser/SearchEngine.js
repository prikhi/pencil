
function SearchEngine() {
	this.title = "";
	this.name = "";
	this.icon = "";
	this.iconURI = "";
	this.uri = "";
	this.searchUri = "";
}

SearchEngine.prototype.getSearchData = function(aData, a) {
	return this.getData(aData, a);
}