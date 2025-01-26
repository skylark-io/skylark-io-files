/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./system-user-entry"],function(t){"use strict";class e extends t{constructor(t){super(t)}mode(){return this._data.readUInt32LE(4)}fileLinks(){return this._data.readUInt32LE(12)}uid(){return this._data.readUInt32LE(20)}gid(){return this._data.readUInt32LE(28)}inode(){return this._data.readUInt32LE(36)}}return e});
//# sourceMappingURL=../../sourcemaps/providers/iso/px-entry.js.map
