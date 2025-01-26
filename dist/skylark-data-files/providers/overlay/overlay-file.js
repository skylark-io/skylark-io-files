/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../preload-file"],function(s){class t extends s{constructor(s,t,i,n,c){super(s,t,i,n,c)}sync(t){this.isDirty()?this._fs._syncAsync(this,s=>{this.resetDirty(),t(s)}):t(null)}syncSync(){this.isDirty()&&(this._fs._syncSync(this),this.resetDirty())}close(s){this.sync(s)}closeSync(){this.syncSync()}}return t});
//# sourceMappingURL=../../sourcemaps/providers/overlay/overlay-file.js.map
