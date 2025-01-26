/**
 * skylark-io-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../file-error","../../error-codes","./misc","./primary-or-supplementary-volume-descriptor","./joliet-directory-record"],function(t,o,n,e,r){"use strict";class i extends e{constructor(e){if(super(e),2!==this.type())throw new t(o.EIO,"Invalid supplementary volume descriptor.");var e=this.escapeSequence(),r=e[2];if(37!==e[0]||47!==e[1]||64!==r&&67!==r&&69!==r)throw new t(o.EIO,"Unrecognized escape sequence for SupplementaryVolumeDescriptor: "+e.toString())}name(){return"Joliet"}escapeSequence(){return this._data.slice(88,120)}_constructRootDirectoryRecord(e){return new r(e,-1)}_getString(e,r){return n.getJolietString(this._data,e,r)}}return i});
//# sourceMappingURL=../../sourcemaps/providers/iso/supplementary-volume-descriptor.js.map
