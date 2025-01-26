/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../preload-file","./special-arg-type","./misc"],function(t,e,s){class r extends t{constructor(t,e,s,r,i,o){super(t,e,s,r,o),this._remoteFdId=i}getRemoteFdId(){return this._remoteFdId}toRemoteArg(){return{type:e.FD,id:this._remoteFdId,data:s.bufferToTransferrableObject(this.getBuffer()),stat:s.bufferToTransferrableObject(this.getStats().toBuffer()),path:this.getPath(),flag:this.getFlag().getFlagString()}}sync(t){this._syncClose("sync",t)}close(t){this._syncClose("close",t)}_syncClose(t,e){this.isDirty()?this._fs.syncClose(t,this,t=>{t||this.resetDirty(),e(t)}):e()}}return r});
//# sourceMappingURL=../../sourcemaps/providers/worker/worker-file.js.map
