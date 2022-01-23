/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-binary/buffer","./files","./error-codes","./error-strings"],function(t,r,e,s){"use strict";class i extends Error{constructor(t,r=s[t],i){super(r),this.syscall="",this.errno=t,this.code=e[t],this.path=i,this.stack=(new Error).stack,this.message=`Error: ${this.code}: ${r}${this.path?`, '${this.path}'`:""}`}static fromJSON(t){const r=new i(0);return r.errno=t.errno,r.code=t.code,r.path=t.path,r.stack=t.stack,r.message=t.message,r}static fromBuffer(t,r=0){return i.fromJSON(JSON.parse(t.toString("utf8",r+4,r+4+t.readUInt32LE(r))))}static create(t,r){return new i(t,s[t],r)}static ENOENT(t){return this.create(e.ENOENT,t)}static EEXIST(t){return this.create(e.EEXIST,t)}static EISDIR(t){return this.create(e.EISDIR,t)}static ENOTDIR(t){return this.create(e.ENOTDIR,t)}static EPERM(t){return this.create(e.EPERM,t)}static ENOTEMPTY(t){return this.create(e.ENOTEMPTY,t)}toString(){return this.message}toJSON(){return{errno:this.errno,code:this.code,path:this.path,stack:this.stack,message:this.message}}writeToBuffer(r=t.alloc(this.bufferSize()),e=0){const s=r.write(JSON.stringify(this.toJSON()),e+4);return r.writeUInt32LE(s,e),r}bufferSize(){return 4+t.byteLength(JSON.stringify(this.toJSON()))}}return r.FileError=i});
//# sourceMappingURL=sourcemaps/file-error.js.map
