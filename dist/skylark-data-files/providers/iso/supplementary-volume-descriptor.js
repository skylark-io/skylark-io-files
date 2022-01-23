/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../file-error","../../error-codes","./misc","./primary-or-supplementary-volume-descriptor","./joliet-directory-record"],function(e,r,t,o,n){"use strict";return class extends o{constructor(t){if(super(t),2!==this.type())throw new e(r.EIO,"Invalid supplementary volume descriptor.");const o=this.escapeSequence(),n=o[2];if(37!==o[0]||47!==o[1]||64!==n&&67!==n&&69!==n)throw new e(r.EIO,`Unrecognized escape sequence for SupplementaryVolumeDescriptor: ${o.toString()}`)}name(){return"Joliet"}escapeSequence(){return this._data.slice(88,120)}_constructRootDirectoryRecord(e){return new n(e,-1)}_getString(e,r){return t.getJolietString(this._data,e,r)}}});
//# sourceMappingURL=../../sourcemaps/providers/iso/supplementary-volume-descriptor.js.map
