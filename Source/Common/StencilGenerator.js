
var labelInfo = null;
var chkSubfolder = null;
var buttonSelect = null;
var buttonGenerate = null;
var progressStatus = null;

StencilGenerator = {
	images: [],
	imgSize: [],
	includeSubfolder: false,
	prepareGenerateStencilDone: false,

	onLoad: function() {
	    labelInfo = document.getElementById("labelInfo");
	    chkSubfolder = document.getElementById("checkSubFolder");
	    buttonSelect = document.getElementById("buttonSelect");
	    progressStatus = document.getElementById("progress");
	    var dialog = document.documentElement;
	    buttonGenerate = dialog.getButton("accept");
	    buttonGenerate.setAttribute('disabled', true);
    },
    
    onSelectFolder : function() {
	    var folder = StencilGenerator._pickFolder();
	    if (folder) {
		    var text = document.getElementById("folder");
		    if (text) {
			    text.value = folder.path;
			    document.getElementById("name").value = unescape(StencilGenerator._getName(text.value));
			    if (document.getElementById("desc").value == "") {
			    	document.getElementById("desc").value = "Created by Stencil Generator";
			    }
			    if (document.getElementById("author").value == "") {
			    	document.getElementById("author").value = "Stencil Generator";
			    }
			    if (document.getElementById("url").value == "") {
			    	document.getElementById("url").value = "http://evolus.vn/Pencil";
			    }
			    
			    document.getElementById("infoPane").style.display = "";

			    debug("getting images...");
		    	labelInfo.value = "Searching images...";
		    	
		    	StencilGenerator.images = StencilGenerator._getImages(folder.path);
		    	StencilGenerator.imgSize = [];

		    	debug("getting images data...");
		    	labelInfo.value = "Getting images data...";
		    	StencilGenerator.prepareGenerateStencilDone = false;
		    	StencilGenerator._prepareGenerateStencil(0);
		    }
	    }
    },

    generateStencil: function() {
    	if (StencilGenerator.prepareGenerateStencilDone) {
    		StencilGenerator._completeGenerateStencil();
    	}
    },
    
    _completeGenerateStencil: function() {
    	var images = StencilGenerator.images;
    	if (images.length == 0) {
    		return;
    	}
    	
    	var name = document.getElementById("name").value;
    	var desc = document.getElementById("desc").value;
    	var author = document.getElementById("author").value;
    	var url = document.getElementById("url").value;
    	var f = StencilGenerator._pickFile(name + ".zip");
        if (f) {
        	buttonGenerate.setAttribute('disabled', true);
	    	var starter = function (listener) {
            	var s = "<Shapes xmlns=\"http://www.evolus.vn/Namespace/Pencil\" \n" + 
            			"		xmlns:p=\"http://www.evolus.vn/Namespace/Pencil\" \n" + 
            			"		xmlns:svg=\"http://www.w3.org/2000/svg\" \n" + 
            			"		xmlns:xlink=\"http://www.w3.org/1999/xlink\" \n" + 
            			"		id=\""+StencilGenerator._generateId(name)+".Icons\" \n" + 
            			"		displayName=\""+name+"\" \n" + 
            			"		description=\""+desc+"\" \n" + 
            			"		author=\""+author+"\" \n" + 
            			"		url=\""+url+"\">\n\n";
            	
            	debug("creating shapes...");
            	var index = -1;
            	
	            var run = function () {
	                try {
	                	index++;
	                	if (index >= images.length) {
                        	s += "</Shapes>";
                        	
                        	try {
	            		        var stream = StencilGenerator._toInputStream(s);
	            		        var zipWriter = Components.Constructor("@mozilla.org/zipwriter;1", "nsIZipWriter");
	            		        var zipW = new zipWriter();
	            		
	            		        zipW.open(f, 0x04 | 0x08 | 0x20 /*PR_RDWR | PR_CREATE_FILE | PR_TRUNCATE*/);
	            		        zipW.comment = "Stencil collection";
	            		        zipW.addEntryDirectory("Icons", new Date(), false);
	            		        
	            		        zipW.addEntryStream("Definition.xml", new Date(), Components.interfaces.nsIZipWriter.COMPRESSION_DEFAULT, stream, false);
	            		        
	            		        if (stream) {
	            		        	stream.close();
	            		        }
	            		        
	            		        for (var i = 0; i < images.length; i++) {
	            		        	var theFile = FileIO.open(images[i].path);
	            		        	var n = StencilGenerator._getName(images[i].path);
	            		        	try {
	            		        		zipW.addEntryFile("Icons/" + n, Components.interfaces.nsIZipWriter.COMPRESSION_DEFAULT, theFile, false);
	            		        		listener.onProgressUpdated("", i + 1, images.length * 2);
	            		        	} catch (eex) { ; }
	            		        }
	            		        
	            		        zipW.close();
                        	} catch (e5) {
                        		Console.dumpError(e5, "stdout");
                        	}
                        	
	            	        Util.info("Stencil collection created.");
	            	        debug("stencil collection created.");
	            	        
	            	        buttonGenerate.setAttribute('disabled', false);
	            	        
	            	        listener.onTaskDone();
	                        return;
	                    }
	                	
	                	//debug("current index: " + index);
	                	
                    	if (StencilGenerator.imgSize[index].w > 0 && StencilGenerator.imgSize[index].h > 0) {
            	            var fileData = StencilGenerator._readBinaryFile(images[index]);
            	            var base64 = Base64.encode(fileData, true);
            	            var shapeName = StencilGenerator._getName(images[index].path), sn = shapeName;
            	            var id = shapeName.indexOf(".");
            	            if (id != -1) {
            	            	sn = shapeName.substring(0, id);
            	            }
            	
            	            var shape = StencilGenerator._buildShape(StencilGenerator._generateId(sn), sn, shapeName, StencilGenerator.imgSize[index].w, StencilGenerator.imgSize[index].h, base64);
            	            		
            	            s += shape;
            	            listener.onProgressUpdated("Generating stencils... ", index + 1, images.length);
                    	}
                    	
                        window.setTimeout(run, 10);
	                } catch (e2) {
	                    Console.dumpError(e2, "stdout");
	                }
	            };
	            run();
	        }
	        
	        //take a shower, doit together!!!
	    	window.openDialog("ProgressDialog.xul", "pencilProgressDialog" + Util.getInstanceToken(), "centerscreen,model", "Generating stencils...", starter);
        }
    },
    
    _readBinaryFile: function(file) {
		var ios = Components.classes["@mozilla.org/network/io-service;1"].
	    						getService(Components.interfaces.nsIIOService);
		
		var istream = Components.classes["@mozilla.org/network/file-input-stream;1"].
		        				createInstance(Components.interfaces.nsIFileInputStream);
		istream.init(file, -1, -1, false);
		
		var bstream = Components.classes["@mozilla.org/binaryinputstream;1"].
		        				createInstance(Components.interfaces.nsIBinaryInputStream);
		bstream.setInputStream(istream);
		
		var bytes = bstream.readBytes(bstream.available());
		
		istream.close();
		bstream.close();
		
		return bytes;
	},
	
    _toInputStream: function(s, b) {
		var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]
		                          .createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
		if (!b) {
			converter.charset = "UTF-8";
		}
		var stream = converter.convertToInputStream(s);
		return stream;
    },
    
    _prepareGenerateStencil: function(i) {
    	try {
	    	if (i >= StencilGenerator.images.length) {
	    		StencilGenerator.prepareGenerateStencilDone = true;
	    		debug(StencilGenerator.images.length + " images found.");
	    		if (StencilGenerator.images.length > 0) {
	    			labelInfo.value = StencilGenerator.images.length + " image" + (StencilGenerator.images.length > 1 ? "s" : "") + " found.";
	    			buttonGenerate.setAttribute('disabled', false);
	    		} else {
	    			labelInfo.value = "No images found.";
	    			buttonGenerate.setAttribute('disabled', true);
	    		}
	    		return true;
	    	}
	    	
	    	labelInfo.value = "Getting images data: " + (Math.round((i + 1) * 100 / StencilGenerator.images.length)) + "%";
	    	debug("getting size: " + (i + 1) + "/" + StencilGenerator.images.length + " -> " + StencilGenerator.images[i].path);
	    	
	    	var fileData = StencilGenerator._readBinaryFile(StencilGenerator.images[i]);
	        var base64 = Base64.encode(fileData, true);
	        var img = new Image();
	        
	        img.onerror = function() {
	        	StencilGenerator.imgSize.push({'w': 0, 'h': 0});
	        	setTimeout("StencilGenerator._prepareGenerateStencil(" + (i + 1) + ")", 10);
	        }
	    	img.onload = function() {
	            StencilGenerator.imgSize.push({'w': img.width, 'h': img.height});
	            setTimeout("StencilGenerator._prepareGenerateStencil(" + (i + 1) + ")", 10);
	        }
	    	img.src = "data:image/png;base64," + base64;
    	} catch (e) {
    		error(e);
    	}
    },
    
    _generateId: function(s) {
	    if (s) {
	    	return s.replace(new RegExp('[^0-9a-zA-Z\\-]+', 'g'), "_");
	    }
	    return "";
    },
    
    _getImages : function(path) {
	    try {
		    var images = new Array();
		    var aFolder = FileIO.open(path);
		    var fileEntries = aFolder.directoryEntries;
		    while (fileEntries.hasMoreElements()) {
                var next = fileEntries.getNext().QueryInterface(Components.interfaces.nsILocalFile);
                if (next.isFile() && /(\.png|\.jpg|\.bmp)$/.test(next.path)) {
                    images.push(next);
                } else if (chkSubfolder.checked && next.isDirectory()) {
                	var sub = StencilGenerator._getImages(next.path);
                	for (var i = 0; i < sub.length; i++) {
                		images.push(sub[i]);
                	}
                }
            }
            return images;
	    } catch (e) {
		    error(e);
		    return new Array();
	    }
    },

    _getName: function(path) {
    	path = StencilGenerator._makeUri(FileIO.open(path));
    	if (path && path.charAt(path.length - 1) == "/") {
    		path = path.substring(0, path.length - 1);
    	}
	    if (path.match(/\/(.[^\/]+)$/)) {
	    	return RegExp.$1;
	    }
    },
    
    _makeUri: function(file) {
    	var ioService = Components.classes["@mozilla.org/network/io-service;1"]  
    	                                   .getService(Components.interfaces.nsIIOService);
    	var ff = ioService.newFileURI(file);
    	return ff.prePath + ff.path;
    },
    
    _pickFolder: function() {
	    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
	    var nsIFilePicker = Components.interfaces.nsIFilePicker;
	    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	    fp.init(window, "Select a Folder", nsIFilePicker.modeGetFolder);
	    fp.appendFilters(nsIFilePicker.filterAll);
	    if (fp.show() == nsIFilePicker.returnCancel) return false;
	    return fp.file;
    },

    _pickFile: function(defaultName) {
	    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
	    var nsIFilePicker = Components.interfaces.nsIFilePicker;
	    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	    fp.init(window, "Select a File", nsIFilePicker.modeSave);
	    fp.appendFilters(nsIFilePicker.filterAll);
	    fp.defaultExtension = "zip";
	    if (defaultName) {
	    	fp.defaultString = defaultName;
	    }
	    if (fp.show() == nsIFilePicker.returnCancel) return false;
	    return fp.file;
    },
    
    _buildShape: function(id, name, icon, w, h, data) {
	    return (
		    "<Shape id=\""+id+"\" displayName=\""+name+"\" icon=\"Icons/"+icon+"\">\n" + 
		    "        <Properties>\n" + 
		    "            <PropertyGroup>\n" + 
		    "                <Property name=\"box\" type=\"Dimension\" p:lockRatio=\"true\">"+w+","+h+"</Property>\n" + 
		    "                <Property name=\"imageData\" type=\"ImageData\"><![CDATA["+w+","+h+",data:image/png;base64,"+data+"]]></Property>\n" + 
		    "                <Property name=\"withBlur\" type=\"Bool\" displayName=\"With Shadow\">false</Property>\n" + 
		    "            </PropertyGroup>\n" + 
		    "            <PropertyGroup name=\"Background\">\n" + 
		    "                <Property name=\"fillColor\" displayName=\"Background Color\" type=\"Color\">#ffffff00</Property>\n" + 
		    "                <Property name=\"strokeColor\" displayName=\"Border Color\" type=\"Color\">#000000ff</Property>\n" + 
		    "                <Property name=\"strokeStyle\" displayName=\"Border Style\" type=\"StrokeStyle\">0|</Property>\n" + 
		    "            </PropertyGroup>\n" + 
		    "        </Properties>\n" + 
		    "        <Behaviors>\n" + 
		    "            <For ref=\"imageContainer\">\n" + 
		    "                <Scale>\n" + 
		    "                    <Arg>$box.w / $imageData.w</Arg>\n" + 
		    "                    <Arg>$box.h / $imageData.h</Arg>\n" + 
		    "                </Scale>\n" + 
		    "            </For>\n" + 
		    "            <For ref=\"bgRect\">\n" + 
		    "                <Box>$box.narrowed(0 - $strokeStyle.w)</Box>\n" + 
		    "                <StrokeColor>$strokeColor</StrokeColor>\n" + 
		    "                <StrokeStyle>$strokeStyle</StrokeStyle>\n" + 
		    "                <Fill>$fillColor</Fill>\n" + 
		    "                <Transform>\"translate(\" + [0 - $strokeStyle.w / 2, 0 - $strokeStyle.w / 2] + \")\"</Transform>\n" + 
		    "            </For>\n" + 
		    "            <For ref=\"image\">\n" + 
		    "                <Image>$imageData</Image>\n" + 
		    "            </For>\n" + 
		    "            <For ref=\"bgCopy\">\n" + 
		    "                <ApplyFilter>$withBlur</ApplyFilter>\n" + 
		    "                <Visibility>$withBlur</Visibility>\n" + 
		    "            </For>\n" + 
		    "        </Behaviors>\n" + 
		    "        <Actions>\n" + 
		    "            <Action id=\"toOriginalSize\" displayName=\"To Original Size\">\n" + 
		    "                <Impl>\n" + 
		    "                    <![CDATA[\n" + 
		    "                        var data = this.getProperty(\"imageData\");\n" + 
		    "                        this.setProperty(\"box\", new Dimension(data.w, data.h));\n" + 
		    "                    ]]>\n" + 
		    "                    </Impl>\n" + 
		    "            </Action>\n" + 
		    "            <Action id=\"fixRatioW\" displayName=\"Correct Ratio by Width\">\n" + 
		    "                <Impl>\n" + 
		    "                    <![CDATA[\n" + 
		    "                        var data = this.getProperty(\"imageData\");\n" + 
		    "                        var box = this.getProperty(\"box\");\n" + 
		    "                        var h = Math.round(box.w * data.h / data.w);\n" + 
		    "                        this.setProperty(\"box\", new Dimension(box.w, h));\n" + 
		    "                    ]]>\n" + 
		    "                    </Impl>\n" + 
		    "            </Action>\n" + 
		    "            <Action id=\"fixRatioH\" displayName=\"Correct Ratio by Height\">\n" + 
		    "                <Impl>\n" + 
		    "                    <![CDATA[\n" + 
		    "                        var data = this.getProperty(\"imageData\");\n" + 
		    "                        var box = this.getProperty(\"box\");\n" + 
		    "                        var w = Math.round(box.h * data.w / data.h);\n" + 
		    "                        this.setProperty(\"box\", new Dimension(w, box.h));\n" + 
		    "                    ]]>\n" + 
		    "                    </Impl>\n" + 
		    "            </Action>\n" + 
		    "            <Action id=\"selectExternalFile\" displayName=\"Load Linked Image...\">\n" + 
		    "                <Impl>\n" + 
		    "                    <![CDATA[\n" + 
		    "                        var thiz = this;\n" + 
		    "                        ImageData.prompt(function(data) {\n" + 
		    "                            if (!data) return;\n" + 
		    "                            thiz.setProperty(\"imageData\", data);\n" + 
		    "                            thiz.setProperty(\"box\", new Dimension(data.w, data.h));\n" + 
		    "                            if (data.data.match(/\\.png$/)) {\n" + 
		    "                                thiz.setProperty(\"fillColor\", Color.fromString(\"#ffffff00\"));\n" + 
		    "                            }\n" + 
		    "                        });\n" + 
		    "                    ]]>\n" + 
		    "                    </Impl>\n" + 
		    "            </Action>\n" + 
		    "            <Action id=\"selectExternalFileEmbedded\" displayName=\"Load Embedded Image...\">\n" + 
		    "                <Impl>\n" + 
		    "                    <![CDATA[\n" + 
		    "                        var thiz = this;\n" + 
		    "                        ImageData.prompt(function(data) {\n" + 
		    "                            if (!data) return;\n" + 
		    "                            thiz.setProperty(\"imageData\", data);\n" + 
		    "                            thiz.setProperty(\"box\", new Dimension(data.w, data.h));\n" + 
		    "                            if (data.data.match(/\\.png$/)) {\n" + 
		    "                                thiz.setProperty(\"fillColor\", Color.fromString(\"#ffffff00\"));\n" + 
		    "                            }\n" + 
		    "                        }, \"embedded\");\n" + 
		    "                    ]]>\n" + 
		    "                    </Impl>\n" + 
		    "            </Action>\n" + 
		    "        </Actions>\n" + 
		    "        <p:Content xmlns:p=\"http://www.evolus.vn/Namespace/Pencil\" xmlns=\"http://www.w3.org/2000/svg\">\n" + 
		    "            <defs>\n" + 
		    "                <filter id=\"imageShading\" height=\"1.2558399\" y=\"-0.12792\" width=\"1.06396\" x=\"-0.03198\">\n" + 
		    "                    <feGaussianBlur stdDeviation=\"1.3325\" in=\"SourceAlpha\"/>\n" + 
		    "                </filter>\n" + 
		    "                <g id=\"container\">\n" + 
		    "                    <rect id=\"bgRect\" style=\"fill: none; stroke: none;\"/>\n" + 
		    "                    <g id=\"imageContainer\">\n" + 
		    "                        <image id=\"image\" x=\"0\" y=\"0\"/>\n" + 
		    "                    </g>\n" + 
		    "                </g>\n" + 
		    "            </defs>\n" + 
		    "            <use xlink:href=\"#container\" id=\"bgCopy\" transform=\"translate(1, 1)\" p:filter=\"url(#imageShading)\" style=\" opacity:0.6;\"/>\n" + 
		    "            <use xlink:href=\"#container\"/>\n" + 
		    "        </p:Content>\n" + 
		    "    </Shape>");
    }
}
window.addEventListener("load", function(){ StencilGenerator.onLoad(); }, false);