/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-binary/buffer","../../stats","../../file-type","../../file-error","../../error-codes","../../file-flag","../../action-type","../../utils","./misc","./special-arg-type"],function(o,t,e,r,a,f,s,l,d,c){var{}=l;return class{constructor(){this._fileDescriptors={},this._nextId=0}toRemoteArg(r,a,s,l){const i=this._nextId++;let f,n;(this._fileDescriptors[i]=r).stat((e,t)=>{e?l(e):(n=d.bufferToTransferrableObject(t.toBuffer()),s.isReadable()?r.read(o.alloc(t.size),0,t.size,0,(e,t,r)=>{e?l(e):(f=d.bufferToTransferrableObject(r),l(null,{type:c.FD,id:i,data:f,stat:n,path:a,flag:s.getFlagString()}))}):l(null,{type:c.FD,id:i,data:new ArrayBuffer(0),stat:n,path:a,flag:s.getFlagString()}))})}applyFdAPIRequest(r,a){const s=r.args[0];this._applyFdChanges(s,(e,t)=>{e?a(e):t[r.method](e=>{"close"===r.method&&delete this._fileDescriptors[s.id],a(e)})})}_applyFdChanges(e,r){const a=this._fileDescriptors[e.id],s=transferrableObjectToBuffer(e.data),l=t.fromBuffer(transferrableObjectToBuffer(e.stat)),i=f.getFileFlag(e.flag);i.isWriteable()?a.write(s,0,s.length,i.isAppendable()?a.getPos():0,e=>{function t(){a.stat((e,t)=>{e?r(e):t.mode!==l.mode?a.chmod(l.mode,e=>{r(e,a)}):r(e,a)})}e?r(e):i.isAppendable()?t():a.truncate(s.length,()=>{t()})}):r(null,a)}}});
//# sourceMappingURL=../../sourcemaps/providers/worker/file-descriptor-argument-converter.js.map
