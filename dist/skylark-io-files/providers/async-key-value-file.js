/**
 * skylark-io-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../files","../preload-file"],function(s,t){"use strict";class e extends t{constructor(s,t,e,i,r){super(s,t,e,i,r)}sync(t){this.isDirty()?this._fs._sync(this.getPath(),this.getBuffer(),this.getStats(),s=>{s||this.resetDirty(),t(s)}):t()}close(s){this.sync(s)}}return s.providers.AsyncKeyValueFile=e});
//# sourceMappingURL=../sourcemaps/providers/async-key-value-file.js.map
