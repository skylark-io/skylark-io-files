/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-paths","../stats","../file-type"],function(t,s,e){"use strict";class r{constructor(t=null){this.data=t,this._ls={}}isFile(){return!1}isDir(){return!0}getData(){return this.data}getStats(){return new s(e.DIRECTORY,4096,365)}getListing(){return Object.keys(this._ls)}getItem(t){const s=this._ls[t];return s||null}addItem(t,s){return!(t in this._ls)&&(this._ls[t]=s,!0)}remItem(t){const s=this._ls[t];return void 0===s?null:(delete this._ls[t],s)}}return r.isDirInode=function(t){return!!t&&t.isDir()},r});
//# sourceMappingURL=../sourcemaps/inodes/dir-inode.js.map
