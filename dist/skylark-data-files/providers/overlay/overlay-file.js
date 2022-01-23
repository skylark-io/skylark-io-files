/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../preload-file"],function(s){return class extends s{constructor(s,t,i,n,c){super(s,t,i,n,c)}sync(s){this.isDirty()?this._fs._syncAsync(this,t=>{this.resetDirty(),s(t)}):s(null)}syncSync(){this.isDirty()&&(this._fs._syncSync(this),this.resetDirty())}close(s){this.sync(s)}closeSync(){this.syncSync()}}});
//# sourceMappingURL=../../sourcemaps/providers/overlay/overlay-file.js.map
