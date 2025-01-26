/**
 * skylark-io-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define([],function(){"use strict";return class{constructor(t){if(this.data=t,84233040!==this.data.readUInt32LE(0))throw new FileError(ErrorCodes.EINVAL,"Invalid digital signature signature: "+this.data.readUInt32LE(0))}size(){return this.data.readUInt16LE(4)}signatureData(){return this.data.slice(6,6+this.size())}}});
//# sourceMappingURL=../../sourcemaps/providers/zip/digital-signature.js.map
