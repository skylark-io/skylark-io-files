/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-binary/buffer","../stats","../file-type"],function(t,i,e){"use strict";class s{constructor(t,i,e,s,r,m){this.id=t,this.size=i,this.mode=e,this.atime=s,this.mtime=r,this.ctime=m}static fromBuffer(t){if(void 0===t)throw new Error("NO");return new s(t.toString("ascii",30),t.readUInt32LE(0),t.readUInt16LE(4),t.readDoubleLE(6),t.readDoubleLE(14),t.readDoubleLE(22))}toStats(){return new i((61440&this.mode)===e.DIRECTORY?e.DIRECTORY:e.FILE,this.size,this.mode,this.atime,this.mtime,this.ctime)}getSize(){return 30+this.id.length}toBuffer(i=t.alloc(this.getSize())){return i.writeUInt32LE(this.size,0),i.writeUInt16LE(this.mode,4),i.writeDoubleLE(this.atime,6),i.writeDoubleLE(this.mtime,14),i.writeDoubleLE(this.ctime,22),i.write(this.id,30,this.id.length,"ascii"),i}update(t){let i=!1;this.size!==t.size&&(this.size=t.size,i=!0),this.mode!==t.mode&&(this.mode=t.mode,i=!0);const e=t.atime.getTime();this.atime!==e&&(this.atime=e,i=!0);const s=t.mtime.getTime();this.mtime!==s&&(this.mtime=s,i=!0);const r=t.ctime.getTime();return this.ctime!==r&&(this.ctime=r,i=!0),i}isFile(){return(61440&this.mode)===e.FILE}isDirectory(){return(61440&this.mode)===e.DIRECTORY}}return s});
//# sourceMappingURL=../sourcemaps/inodes/inode.js.map
