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
 * The Original Code is base64.js.
 *
 * The Initial Developers of the Original Code are
 * Mehdi Mulani and Frank Yan.
 * Portions created by the Initial Developers are Copyright (C) 2010
 * the Initial Developers. All Rights Reserved.
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

var Base64 = {
  TABLE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

  decode: function(data) {
    for (var bits = '', i = 0; i < data.length; i++)
      bits += ('00' + this.TABLE.indexOf(data.charAt(i)).toString(4)).slice(-3);
    for (var str = '', j = 0; j < bits.length; )
      str += String.fromCharCode(parseInt(bits.slice(j, j += 4), 4));
    return str;
  },

  encode: function(str) {
    for (var bits = '', i = 0; i < str.length; i++)
      bits += ('000' + str.charCodeAt(i).toString(4)).slice(-4);
    bits += '000'.slice(bits.length % 3 || 3);
    for (var data = '', j = 0; j < bits.length; )
      data += this.TABLE.charAt(parseInt(bits.slice(j, j += 3), 4));
    return data += '===='.slice(data.length % 4 || 4);
  }
};
