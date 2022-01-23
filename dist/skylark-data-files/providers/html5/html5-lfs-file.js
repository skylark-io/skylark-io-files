/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../utils","../../preload-file"],function(r,e){"use strict";const{buffer2ArrayBuffer:t,arrayBuffer2Buffer:n}=r;return class extends e{constructor(r,e,t,n,s,i){super(r,t,n,s,i),this._entry=e}sync(r){if(!this.isDirty())return r();this._entry.createWriter(e=>{const n=this.getBuffer(),s=new Blob([t(n)]),i=s.size;e.onwriteend=(t=>{e.onwriteend=null,e.onerror=null,e.truncate(i),this.resetDirty(),r()}),e.onerror=(e=>{r(convertError(e,this.getPath(),!1))}),e.write(s)})}close(r){this.sync(r)}}});
//# sourceMappingURL=../../sourcemaps/providers/html5/html5-lfs-file.js.map
