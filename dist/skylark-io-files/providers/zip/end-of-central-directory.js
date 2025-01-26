/**
 * skylark-io-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../error-codes","../../file-error","../../stats","./msdos2date","./safe-to-string","./file-header","./file-data"],function(r,e,t,a,d,n,i){"use strict";return class{constructor(t){if(this.data=t,101010256!==this.data.readUInt32LE(0))throw new e(r.EINVAL,"Invalid Zip file: End of central directory record has invalid signature: "+this.data.readUInt32LE(0))}diskNumber(){return this.data.readUInt16LE(4)}cdDiskNumber(){return this.data.readUInt16LE(6)}cdDiskEntryCount(){return this.data.readUInt16LE(8)}cdTotalEntryCount(){return this.data.readUInt16LE(10)}cdSize(){return this.data.readUInt32LE(12)}cdOffset(){return this.data.readUInt32LE(16)}cdZipCommentLength(){return this.data.readUInt16LE(20)}cdZipComment(){return d(this.data,!0,22,this.cdZipCommentLength())}rawCdZipComment(){return this.data.slice(22,22+this.cdZipCommentLength())}}});
//# sourceMappingURL=../../sourcemaps/providers/zip/end-of-central-directory.js.map
