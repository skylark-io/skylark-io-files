/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../error-codes","../../file-error","./compression-method"],function(t,s,o){"use strict";const i={};return class{constructor(e,r,t){this.header=e,this.record=r,this.data=t}decompress(){var r=this.header.compressionMethod(),e=i[r];if(e)return e(this.data,this.record.compressedSize(),this.record.uncompressedSize(),this.record.flag());{let e=o[r];throw e=e||"Unknown: "+r,new s(t.EINVAL,`Invalid compression method on file '${this.header.fileName()}': `+e)}}getHeader(){return this.header}getRecord(){return this.record}getRawData(){return this.data}static RegisterDecompressionMethod(e,r){i[e]=r}}});
//# sourceMappingURL=../../sourcemaps/providers/zip/file-data.js.map
