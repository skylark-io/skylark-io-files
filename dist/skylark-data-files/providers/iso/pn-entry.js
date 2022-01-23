/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./system-user-entry"],function(t){"use strict";return class extends t{constructor(t){super(t)}devTHigh(){return this._data.readUInt32LE(4)}devTLow(){return this._data.readUInt32LE(12)}}});
//# sourceMappingURL=../../sourcemaps/providers/iso/pn-entry.js.map
