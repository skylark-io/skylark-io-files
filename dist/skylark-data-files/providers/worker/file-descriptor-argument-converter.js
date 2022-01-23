/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-binary/buffer","../../stats","../../file-type","../../file-error","../../error-codes","../../file-flag","../../action-type","../../utils","./misc","./special-arg-type"],function(e,t,r,a,s,f,l,i,n,o){const{buffer2ArrayBuffer:c,arrayBuffer2Buffer:d,emptyBuffer:p}=i;return class{constructor(){this._fileDescriptors={},this._nextId=0}toRemoteArg(t,r,a,s){const f=this._nextId++;let l,i;this._fileDescriptors[f]=t,t.stat((c,d)=>{c?s(c):(i=n.bufferToTransferrableObject(d.toBuffer()),a.isReadable()?t.read(e.alloc(d.size),0,d.size,0,(e,t,c)=>{e?s(e):(l=n.bufferToTransferrableObject(c),s(null,{type:o.FD,id:f,data:l,stat:i,path:r,flag:a.getFlagString()}))}):s(null,{type:o.FD,id:f,data:new ArrayBuffer(0),stat:i,path:r,flag:a.getFlagString()}))})}applyFdAPIRequest(e,t){const r=e.args[0];this._applyFdChanges(r,(a,s)=>{a?t(a):s[e.method](a=>{"close"===e.method&&delete this._fileDescriptors[r.id],t(a)})})}_applyFdChanges(e,r){const a=this._fileDescriptors[e.id],s=transferrableObjectToBuffer(e.data),l=t.fromBuffer(transferrableObjectToBuffer(e.stat)),i=f.getFileFlag(e.flag);i.isWriteable()?a.write(s,0,s.length,i.isAppendable()?a.getPos():0,e=>{function t(){a.stat((e,t)=>{e?r(e):t.mode!==l.mode?a.chmod(l.mode,e=>{r(e,a)}):r(e,a)})}e?r(e):i.isAppendable()?t():a.truncate(s.length,()=>{t()})}):r(null,a)}}});
//# sourceMappingURL=../../sourcemaps/providers/worker/file-descriptor-argument-converter.js.map
