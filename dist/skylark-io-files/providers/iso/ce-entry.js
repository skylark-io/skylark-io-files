/**
 * skylark-io-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./system-user-entry"],function(t){"use strict";class n extends t{constructor(t){super(t),this._entries=null}continuationLba(){return this._data.readUInt32LE(4)}continuationLbaOffset(){return this._data.readUInt32LE(12)}continuationLength(){return this._data.readUInt32LE(20)}getEntries(t){var n;return this._entries||(n=2048*this.continuationLba()+this.continuationLbaOffset(),this._entries=constructSystemUseEntries(t,n,this.continuationLength(),t)),this._entries}}return n});
//# sourceMappingURL=../../sourcemaps/providers/iso/ce-entry.js.map
