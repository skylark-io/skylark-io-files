/**
 * skylark-io-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../file-error","../../error-codes","./primary-or-supplementary-volume-descriptor","./iso-directory-record"],function(e,t,r,o){"use strict";class i extends r{constructor(r){if(super(r),1!==this.type())throw new e(t.EIO,"Invalid primary volume descriptor.")}name(){return"ISO9660"}_constructRootDirectoryRecord(r){return new o(r,-1)}_getString(r,e){return this._getString(r,e)}}return i});
//# sourceMappingURL=../../sourcemaps/providers/iso/primary-volume-descriptor.js.map
