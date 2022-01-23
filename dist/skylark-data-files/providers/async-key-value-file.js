/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../files","./preload-file"],function(s,t){"use strict";return class extends t{constructor(s,t,e,i,r){super(s,t,e,i,r)}sync(s){this.isDirty()?this._fs._sync(this.getPath(),this.getBuffer(),this.getStats(),t=>{t||this.resetDirty(),s(t)}):s()}close(s){this.sync(s)}}});
//# sourceMappingURL=../sourcemaps/providers/async-key-value-file.js.map
