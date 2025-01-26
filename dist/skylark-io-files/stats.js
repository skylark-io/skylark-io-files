/**
 * skylark-io-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-binary/buffer","./files","./file-type"],function(t,e,h){"use strict";return e.Stats=class m{constructor(e,t,i,s,r,m,n){this.dev=0,this.ino=0,this.rdev=0,this.nlink=1,this.blksize=4096,this.uid=0,this.gid=0,this.fileData=null,this.size=t;let o=0;"number"!=typeof s&&(s=o=Date.now()),"number"!=typeof r&&(r=o=o||Date.now()),"number"!=typeof m&&(m=o=o||Date.now()),"number"!=typeof n&&(n=o=o||Date.now()),this.atimeMs=s,this.ctimeMs=m,this.mtimeMs=r,this.birthtimeMs=n,i?this.mode=i:e===h.FILE?this.mode=420:(h.DIRECTORY,this.mode=511),this.blocks=Math.ceil(t/512),this.mode<4096&&(this.mode|=e)}static fromBuffer(e){var t=e.readUInt32LE(0),i=e.readUInt32LE(4),s=e.readDoubleLE(8),r=e.readDoubleLE(16),e=e.readDoubleLE(24);return new m(61440&i,t,4095&i,s,r,e)}static clone(e){return new m(61440&e.mode,e.size,4095&e.mode,e.atimeMs,e.mtimeMs,e.ctimeMs,e.birthtimeMs)}get atime(){return new Date(this.atimeMs)}get mtime(){return new Date(this.mtimeMs)}get ctime(){return new Date(this.ctimeMs)}get birthtime(){return new Date(this.birthtimeMs)}toBuffer(){var e=t.alloc(32);return e.writeUInt32LE(this.size,0),e.writeUInt32LE(this.mode,4),e.writeDoubleLE(this.atime.getTime(),8),e.writeDoubleLE(this.mtime.getTime(),16),e.writeDoubleLE(this.ctime.getTime(),24),e}isFile(){return(61440&this.mode)===h.FILE}isDirectory(){return(61440&this.mode)===h.DIRECTORY}isSymbolicLink(){return(61440&this.mode)===h.SYMLINK}chmod(e){this.mode=61440&this.mode|e}isSocket(){return!1}isBlockDevice(){return!1}isCharacterDevice(){return!1}isFIFO(){return!1}}});
//# sourceMappingURL=sourcemaps/stats.js.map
