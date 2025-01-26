/**
 * skylark-io-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./system-user-entry","./misc"],function(t,e){"use strict";class i extends t{constructor(t){super(t)}identifierLength(){return this._data[4]}descriptorLength(){return this._data[5]}sourceLength(){return this._data[6]}extensionVersion(){return this._data[7]}extensionIdentifier(){return e.getASCIIString(this._data,8,this.identifierLength())}extensionDescriptor(){return e.getASCIIString(this._data,8+this.identifierLength(),this.descriptorLength())}extensionSource(){return e.getASCIIString(this._data,8+this.identifierLength()+this.descriptorLength(),this.sourceLength())}}return i});
//# sourceMappingURL=../../sourcemaps/providers/iso/er-entry.js.map
