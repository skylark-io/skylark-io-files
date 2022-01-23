/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define([],function(){"use strict";return FileInode.isDirInode=function(t){return!!t&&t.isDir()},class{constructor(t=null){this.data=t,this._ls={}}isFile(){return!1}isDir(){return!0}getData(){return this.data}getStats(){return new Stats(FileType.DIRECTORY,4096,365)}getListing(){return Object.keys(this._ls)}getItem(t){const e=this._ls[t];return e||null}addItem(t,e){return!(t in this._ls||(this._ls[t]=e,0))}remItem(t){const e=this._ls[t];return void 0===e?null:(delete this._ls[t],e)}}});
//# sourceMappingURL=../sourcemaps/inodes/dir-inode.js.map
