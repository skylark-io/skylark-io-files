/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./system-user-entry"],function(t){"use strict";class e extends t{constructor(t){super(t)}virtualSizeHigh(){return this._data.readUInt32LE(4)}virtualSizeLow(){return this._data.readUInt32LE(12)}tableDepth(){return this._data[20]}}return e});
//# sourceMappingURL=../../sourcemaps/providers/iso/sf-entry.js.map
