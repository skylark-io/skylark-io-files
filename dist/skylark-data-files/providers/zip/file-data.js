/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../error-codes","../../file-error","./compression-method"],function(e,r,t){"use strict";const s={};return class{constructor(e,r,t){this.header=e,this.record=r,this.data=t}decompress(){const o=this.header.compressionMethod(),i=s[o];if(i)return i(this.data,this.record.compressedSize(),this.record.uncompressedSize(),this.record.flag());{let s=t[o];throw s||(s=`Unknown: ${o}`),new r(e.EINVAL,`Invalid compression method on file '${this.header.fileName()}': ${s}`)}}getHeader(){return this.header}getRecord(){return this.record}getRawData(){return this.data}static RegisterDecompressionMethod(e,r){s[e]=r}}});
//# sourceMappingURL=../../sourcemaps/providers/zip/file-data.js.map
