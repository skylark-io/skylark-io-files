/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../utils","../../preload-file"],function(r,e){"use strict";const s=r["buffer2ArrayBuffer"];class t extends e{constructor(r,e,t,n,s,i){super(r,t,n,s,i),this._entry=e}sync(n){if(!this.isDirty())return n();this._entry.createWriter(e=>{var r=this.getBuffer(),r=new Blob([s(r)]);const t=r.size;e.onwriteend=r=>{e.onwriteend=null,e.onerror=null,e.truncate(t),this.resetDirty(),n()},e.onerror=r=>{n(convertError(r,this.getPath(),!1))},e.write(r)})}close(r){this.sync(r)}}return t});
//# sourceMappingURL=../../sourcemaps/providers/html5/html5-lfs-file.js.map
