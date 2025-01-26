/**
 * skylark-io-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define([],function(){"use strict";class t{constructor(t){this.data=t}isFile(){return!0}isDir(){return!1}getData(){return this.data}setData(t){this.data=t}}return t.isFileInode=function(t){return!!t&&t.isFile()},t});
//# sourceMappingURL=../sourcemaps/inodes/file-inode.js.map
