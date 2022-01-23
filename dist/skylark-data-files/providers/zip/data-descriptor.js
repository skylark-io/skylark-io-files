/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define([],function(){"use strict";return class{constructor(t){this.data=t}crc32(){return this.data.readUInt32LE(0)}compressedSize(){return this.data.readUInt32LE(4)}uncompressedSize(){return this.data.readUInt32LE(8)}}});
//# sourceMappingURL=../../sourcemaps/providers/zip/data-descriptor.js.map
