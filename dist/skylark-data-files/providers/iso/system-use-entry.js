/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./misc"],function(t){"use strict";return class{constructor(t){this._data=t}signatureWord(){return this._data.readUInt16BE(0)}signatureWordString(){return t.getASCIIString(this._data,0,2)}length(){return this._data[2]}suVersion(){return this._data[3]}}});
//# sourceMappingURL=../../sourcemaps/providers/iso/system-use-entry.js.map
