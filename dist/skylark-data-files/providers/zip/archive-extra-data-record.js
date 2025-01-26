/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../error-codes","../../file-error"],function(r,a){"use strict";return class{constructor(t){if(this.data=t,134630224!==this.data.readUInt32LE(0))throw new a(r.EINVAL,"Invalid archive extra data record signature: "+this.data.readUInt32LE(0))}length(){return this.data.readUInt32LE(4)}extraFieldData(){return this.data.slice(8,8+this.length())}}});
//# sourceMappingURL=../../sourcemaps/providers/zip/archive-extra-data-record.js.map
