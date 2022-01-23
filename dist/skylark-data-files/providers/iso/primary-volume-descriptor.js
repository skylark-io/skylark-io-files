/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../file-error","../../error-codes","./primary-or-supplementary-volume-descriptor","./iso-directory-record"],function(r,e,t,o){"use strict";return class extends t{constructor(t){if(super(t),1!==this.type())throw new r(e.EIO,"Invalid primary volume descriptor.")}name(){return"ISO9660"}_constructRootDirectoryRecord(r){return new o(r,-1)}_getString(r,e){return this._getString(r,e)}}});
//# sourceMappingURL=../../sourcemaps/providers/iso/primary-volume-descriptor.js.map
