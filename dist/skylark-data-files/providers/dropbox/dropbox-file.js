/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../preload-file"],function(s){"use strict";return class extends s{constructor(s,e,t,c,i){super(s,e,t,c,i)}sync(s){this._fs._syncFile(this.getPath(),this.getBuffer(),s)}close(s){this.sync(s)}}});
//# sourceMappingURL=../../sourcemaps/providers/dropbox/dropbox-file.js.map
