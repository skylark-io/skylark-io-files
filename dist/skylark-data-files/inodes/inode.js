/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-binary/buffer","../stats","../file-type"],function(i,t,e){"use strict";return class s{constructor(t,i,e,s,r,m){this.id=t,this.size=i,this.mode=e,this.atime=s,this.mtime=r,this.ctime=m}static fromBuffer(t){if(void 0===t)throw new Error("NO");return new s(t.toString("ascii",30),t.readUInt32LE(0),t.readUInt16LE(4),t.readDoubleLE(6),t.readDoubleLE(14),t.readDoubleLE(22))}toStats(){return new t((61440&this.mode)===e.DIRECTORY?e.DIRECTORY:e.FILE,this.size,this.mode,this.atime,this.mtime,this.ctime)}getSize(){return 30+this.id.length}toBuffer(t=i.alloc(this.getSize())){return t.writeUInt32LE(this.size,0),t.writeUInt16LE(this.mode,4),t.writeDoubleLE(this.atime,6),t.writeDoubleLE(this.mtime,14),t.writeDoubleLE(this.ctime,22),t.write(this.id,30,this.id.length,"ascii"),t}update(t){let i=!1;this.size!==t.size&&(this.size=t.size,i=!0),this.mode!==t.mode&&(this.mode=t.mode,i=!0);var e=t.atime.getTime(),e=(this.atime!==e&&(this.atime=e,i=!0),t.mtime.getTime()),e=(this.mtime!==e&&(this.mtime=e,i=!0),t.ctime.getTime());return this.ctime!==e&&(this.ctime=e,i=!0),i}isFile(){return(61440&this.mode)===e.FILE}isDirectory(){return(61440&this.mode)===e.DIRECTORY}}});
//# sourceMappingURL=../sourcemaps/inodes/inode.js.map
