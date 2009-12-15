
var RECORD = new RegExp('<div[^>]*id="cc_record_listing"[^>]*>((?:(?!<div[^>]*style=""[^>]*><br[^>]*clear="all").)*)', 'g');

var FILE_INFO = ('<table[^>]*id="cc_file_info"[^>]*>((?:(?!<div[^>]*id="cc_action_buttons"[^>]*>).)*)');
var NAME = ('<td[^>]*colspan="2"[^>]*>[^<]*<h2>[^<]*<span[^>]*class=""[^>]*>[^<]*<a[^>]*>([^<]*)<');
var AUTHOR = ('<th>by\:<\/th>(?:(?!class="cc_user_link").)*class="cc_user_link">([^>]*)<');
var LICENSE = ('<th>license\:<\/th>(?:(?!<a).)*(?:(?!href=").)*href="([^"]*)"[^>]*>(?:(?!src=").)*src="([^"]*)"[^>]*>');
var DESC = ('<td[^>]*class="cc_search_result_info"[^>]*>((?:(?!<\/td>).)*)<\/td>');

var IMAGE_INFO = ('<div[^>]*class="cc_file_download_popup"[^>]*>((?:(?!<\/div>).)*)<\/div>');
var IMAGE_TYPE = ('<a(?:(?!type=).)*type="(.[^"]*)"');
var IMAGE_SRC = ('<a(?:(?!href=).)*href="(.[^"]*)"');
var IMAGE_SIZE = /<a[^>]*>[^\(]*\(([^\)]*)\)/;

function OpenClipartSearch() {

    this.title = "OpenClipart.org";
    this.name = "OpenClipart.org";
    this.icon = "http://openclipart.org/ccimages/ocal-logo-simple-75by50.png";
    this.iconURI = "http://openclipart.org/ccimages/ocal-logo-simple-75by50.png";
    this.uri = "http://openclipart.org/media/search/results";
    this.searchUri = this.uri + "?search_text=%s&search_type=any&search_in=3";

    this.rq = [];

    var thiz = this;

    this.searchImpl = function(query, options, callback) {
        var url = this.searchUri.replace("%s", query);
        //var url = "http://localhost:8080/search.html";
        for (var ii = 0; ii < this.rq.length; ii++) {
            this.rq[ii].abort();
            this.rq[ii].onreadystatechange = null;
        }
        this.rq = [];

        debug("OpenClipart: searching '" + query + "'");
        WebUtil.get(url, function(res) {
            var result = thiz.parseSearchResult(res);
            if (callback) callback(result);
        }, this.rq);
    };

    this.formatType = function(ty) {
        if (ty) {
            var idx = ty.indexOf("/");
            if (idx != -1) {
                return ty.substring(idx + 1).toUpperCase();
            }
        }

        return "Unknow type";
    };

    this.parseSearchResult = function(res) {
        try {
            res = res.replace(new RegExp('[\r\n]+', 'g'), "");
            //debug("------ " + res + " ---------");
            var r = [], i = 1;
            var record = RECORD.exec(res);
            while (record != null) {
                var rc = record[1];
                debug("Processing record " + (i++));
                var item = {name: "", author: "", desc: "", images: []};
                var file_info = new RegExp(FILE_INFO, 'g').exec(rc);
                if (file_info != null) {
                    var n = new RegExp(NAME, 'g').exec((file_info[1]));
                    var a = new RegExp(AUTHOR, 'g').exec((file_info[1]));
                    var l = new RegExp(LICENSE, 'g').exec((file_info[1]));
                    var d = new RegExp(DESC, 'g').exec((file_info[1]));
                    if (n != null) {
                        item.name = n[1];
                    }
                    if (a != null) {
                        item.author = a[1];
                    }
                    if (d != null) {
                        item.desc = d[1];
                    }
                    debug("    -> name: " + item.name + ", author: " + item.author + ", dscription: " + item.desc);
                }
                var image_info = new RegExp(IMAGE_INFO, 'g').exec(rc);
                if (image_info != null) {
                    var ir = new RegExp(IMAGE_SRC, 'g');
                    var it = new RegExp(IMAGE_TYPE, 'g');

                    var hasSvg = false;
                    var imi = image_info[1];
                    var imgsrc = ir.exec(imi);
                    var imgtype = it.exec(imi);
                    var imgsize = IMAGE_SIZE.exec(imi);

                    var images = [];

                    while (imgsrc != null && imgtype != null && imgsize != null) {
                        if (imgtype[1] == "image/svg+xml" || imgtype[1] == "image/png" || imgtype[1] == "image/jpg" || imgtype[1] == "image/gif") {
                            var tn = this.formatType(imgtype[1]);
                            images.push({src: imgsrc[1], type: imgtype[1], typeName: tn, size: imgsize[1]});
                            if (imgtype[1] == "image/svg+xml") {
                                hasSvg = true;
                            }
                            debug("    -> imgsrc: " + imgsrc[1] + ", imgtype: " + imgtype[1] + ", size: " + imgsize[1]);
                        }
                        imgsrc = ir.exec(imi);
                        imgtype = it.exec(imi);
                        iimgsize = IMAGE_SIZE.exec(imi);
                    }

                    for (var iik = 0; iik < images.length; iik++) {
                        if (!hasSvg || (hasSvg && images[iik].type == "image/svg+xml")) {
                            item.images.push(images[iik]);
                        }
                    }
                }

                r.push(item);
                record = RECORD.exec(res);
            }

            this.searchResult = r;
            return r;
        } catch (e) {
            error(e);
        }
    };
}
OpenClipartSearch.prototype = new SearchEngine();

//SearchManager.registerSearchEngine(OpenClipartSearch, true);

