/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../files","../preload-file"],function(s,t){"use strict";return class extends t{constructor(s,t,e,i,c){super(s,t,e,i,c)}syncSync(){this.isDirty()&&(this._fs._syncSync(this.getPath(),this.getBuffer(),this.getStats()),this.resetDirty())}closeSync(){this.syncSync()}}});
//# sourceMappingURL=../sourcemaps/providers/sync-key-value-file.js.map
