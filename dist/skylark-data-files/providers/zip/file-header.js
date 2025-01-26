/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../error-codes","../../file-error","./msdos2date","./safe-to-string"],function(e,a,t,r){"use strict";return class{constructor(t){if(67324752!==(this.data=t).readUInt32LE(0))throw new a(e.EINVAL,"Invalid Zip file: Local file header has invalid signature: "+this.data.readUInt32LE(0))}versionNeeded(){return this.data.readUInt16LE(4)}flags(){return this.data.readUInt16LE(6)}compressionMethod(){return this.data.readUInt16LE(8)}lastModFileTime(){return t(this.data.readUInt16LE(10),this.data.readUInt16LE(12))}rawLastModFileTime(){return this.data.readUInt32LE(10)}crc32(){return this.data.readUInt32LE(14)}fileNameLength(){return this.data.readUInt16LE(26)}extraFieldLength(){return this.data.readUInt16LE(28)}fileName(){return r(this.data,this.useUTF8(),30,this.fileNameLength())}extraField(){var t=30+this.fileNameLength();return this.data.slice(t,t+this.extraFieldLength())}totalSize(){return 30+this.fileNameLength()+this.extraFieldLength()}useUTF8(){return 2048==(2048&this.flags())}}});
//# sourceMappingURL=../../sourcemaps/providers/zip/file-header.js.map
