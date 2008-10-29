/* ***** BEGIN LICENSE BLOCK ***** 
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is the pImageLoader.
 *
 * The Initial Developer of the Original Code is SHIMODA Hiroshi.
 * Portions created by the Initial Developer are Copyright (C) 2004
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s): SHIMODA Hiroshi <piro@p.club.ne.jp>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
/* 
 ::::::USAGE:::::: 

Smiple sample:
*/

/*
The second argument, listener, have to be a function or an object
which has a method "onImageLoad".

Another sample:

> var listener = {
>        browser     : gBrowser.getBrowserForTab(gBrowser.selectedTab),
>        onImageLoad : function(aImageData) {
>          this.browser.loadURI(aImageData);
>        }
> };
>
> var loader = new pImageLoader(
>                     'http://piro.sakura.ne.jp/common/favicon.ico',
>                     listener
>                  );
> loader.load();


*/
 
function pImageLoader(aImageURI, aListener) 
{
	this.URI       = aImageURI;
	this.mListener = aListener;
}

pImageLoader.prototype = {
	mListener : null,
	
	get URI() 
	{
		return this.mURI;
	},
	set URI(aValue)
	{
		this.mURI = String(aValue);
	},
	mURI : null,
 
	load : function() 
	{
		if (!this.mListener)
			throw 'pImageLoader\nError: no listener';

		if (!this.mURI)
			throw 'pImageLoader\nError: no URI';

		const IOService = IOService = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
		var channel = IOService.newChannel(this.URI, null, null);
		var listener = new pImageLoaderInternalListener(this, channel);
		channel.notificationCallbacks = listener;
		channel.asyncOpen(listener, null);
	},
 
	onLoad : function(aImageData) 
	{
		if (typeof this.mListener == 'function')
			this.mListener(aImageData);
		else if ('onImageLoad' in this.mListener &&
			typeof this.mListener.onImageLoad == 'function')
			this.mListener.onImageLoad(aImageData);
	},
 
	onError : function(aStatusCode) 
	{
		if (typeof this.mListener == 'function')
			this.mListener(aStatusCode);
		else if ('onImageError' in this.mListener &&
			typeof this.mListener.onImageError == 'function')
			this.mListener.onImageError(aStatusCode);
	},
 
	toString : function() 
	{
		return '[object pImageLoader]';
	}
 
}; 
 
/* Base64 Encoder for bytes 
	based on the library:
	http://www.onicos.com/staff/iz/amuse/javascript/expert/base64.txt
	( http://www.onicos.com/staff/iz/amuse/javascript/expert/)
	The original credit is:
*/
/* Copyright (C) 1999 Masanao Izumo <mo@goice.co.jp>
 * Version: 1.0
 * LastModified: Dec 25 1999
 * This library is free.  You can redistribute it and/or modify it.
 */
pImageLoader.base64encode = function(aData)
{
	if (!aData) return null;

	const base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    var out, i, len;
    var c1, c2, c3;

    len = aData.length;
    i = 0;
    out = "";
    while(i < len) {
	c1 = (aData.constructor == Array ? aData[i++] : String(aData).charCodeAt(i++) ) & 0xff;
	if(i == len)
	{
	    out += base64EncodeChars.charAt(c1 >> 2);
	    out += base64EncodeChars.charAt((c1 & 0x3) << 4);
	    out += "==";
	    break;
	}
	c2 = (aData.constructor == Array ? aData[i++] : String(aData).charCodeAt(i++) );
	if(i == len)
	{
	    out += base64EncodeChars.charAt(c1 >> 2);
	    out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
	    out += base64EncodeChars.charAt((c2 & 0xF) << 2);
	    out += "=";
	    break;
	}
	c3 = (aData.constructor == Array ? aData[i++] : String(aData).charCodeAt(i++) );
	out += base64EncodeChars.charAt(c1 >> 2);
	out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
	out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
	out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
};
  
// based on "bookmarksFavIconLoadListener"
function pImageLoaderInternalListener(aLoader, aChannel) 
{
	if (!aLoader || aLoader != '[object pImageLoader]')
		throw 'pImageLoaderInternalListener\nError: invalid loader';

	this.mLoader     = aLoader;
	this.mURI        = aLoader.URI;
	this.mCountRead  = 0;
	this.mChannel    = aChannel;
}

pImageLoaderInternalListener.prototype = {
	mLoader     : null,
	mURI        : null,
	mCountRead  : null,
	mChannel    : null,
	mBytes      : Array(),
	mStream     : null,
	
	QueryInterface : function (aIID) 
	{
		if (aIID.equals(Components.interfaces.nsISupports) ||
			aIID.equals(Components.interfaces.nsIInterfaceRequestor) ||
			aIID.equals(Components.interfaces.nsIRequestObserver) ||
			aIID.equals(Components.interfaces.nsIHttpEventSink) ||
			aIID.equals(Components.interfaces.nsIProgressEventSink) ||
			aIID.equals(Components.interfaces.nsIStreamListener))
			return this;

		throw Components.results.NS_ERROR_NO_INTERFACE;
	},
 
	// nsIInterfaceRequestor 
	getInterface : function (aIID)
	{
		try {
			return this.QueryInterface(aIID);
		}
		catch (e) {
			throw Components.results.NS_NOINTERFACE;
		}
	},
 
	// nsIRequestObserver 
	onStartRequest : function (aRequest, aContext)
	{
        this.mStream = Components.classes['@mozilla.org/binaryinputstream;1'].createInstance(Components.interfaces.nsIBinaryInputStream);
	},
 
	onStopRequest : function (aRequest, aContext, aStatusCode) 
	{
        //var httpChannel = this.mChannel.QueryInterface(Components.interfaces.nsIHttpChannel);
        /* (httpChannel && httpChannel.requestSucceeded) &&
				Components.isSuccessCode(aStatusCode) &&
				this.mCountRead > 0  */
        if (true) {
			var dataurl;
			var mimeType = null;
			
			const nsICategoryManager = Components.interfaces.nsICategoryManager;
			const nsIContentSniffer = Components.interfaces.nsIContentSniffer;
			
			var catMgr = Components.classes['@mozilla.org/categorymanager;1'].getService(nsICategoryManager);
			var sniffers = catMgr.enumerateCategory('content-sniffing-services');
			while (mimeType == null && sniffers.hasMoreElements())
			{
				var snifferCID = sniffers.getNext().QueryInterface(Components.interfaces.nsISupportsCString).toString();
				var sniffer = Components.classes[snifferCID].getService(nsIContentSniffer);
				try {
					mimeType = sniffer.getMIMETypeFromContent(aRequest,this.mBytes, this.mCountRead);
				}
				catch(e) {
					mimeType = null;
				}
			}
			var imageData = null;
			if (mimeType != null  ) {
				imageData = [
						'data:',
						mimeType,
						';base64,',
						pImageLoader.base64encode(this.mBytes)
					].join('');
			}
			this.mLoader.onLoad(imageData);
		}
		else {
			this.mLoader.onError(aStatusCode);
        }

		this.mChannel = null;
	},
 
	// nsIStreamObserver 
	onDataAvailable : function (aRequest, aContext, aInputStream, aOffset, aCount)
	{
		this.mStream.setInputStream(aInputStream);
		var chunk = this.mStream.readByteArray(aCount);
		this.mBytes = this.mBytes.concat(chunk);
		this.mCountRead += aCount;
	},
 
	// nsIHttpEventSink 
	onRedirect : function (aHttpChannel, aNewChannel)
	{
		this.mChannel = aNewChannel;
	},
 
	onProgress : function (aRequest, aContext, aProgress, aProgressMax) { }, 
	onStatus : function (aRequest, aContext, aStatus, aStatusArg) { },
 
	toString : function() 
	{
		return '[object pImageLoaderInternalListener]';
	}
 
}; 
  function listener(aImageData)
{
  alert("toto" + aImageData);
  // aImageData is a "data URI", like "data:image/png;base64,******".
}
/*
url1 = 'file:///D:/home/max/Desktop/Proto/arrow.png'
url1 = 'file:///D:/home/max/Desktop/Proto/fond_entete_Copie.png'
url2 = 'http://www.poweredbypulse.com/images/products/download_arrow.png'

var loader = new pImageLoader(
                    url1,
                    listener
                 );
loader.load();*/
