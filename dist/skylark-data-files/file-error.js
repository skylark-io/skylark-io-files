/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-binary/buffer","./files","./error-codes","./error-strings"],function(s,t,i,a){"use strict";class e extends Error{constructor(t,r=a[t],e){super(r),this.syscall="",this.errno=t,this.code=i[t],this.path=e,this.stack=(new Error).stack,this.message=`Error: ${this.code}: `+r+(this.path?`, '${this.path}'`:"")}static fromJSON(t){var r=new e(0);return r.errno=t.errno,r.code=t.code,r.path=t.path,r.stack=t.stack,r.message=t.message,r}static fromBuffer(t,r=0){return e.fromJSON(JSON.parse(t.toString("utf8",r+4,r+4+t.readUInt32LE(r))))}static create(t,r){return new e(t,a[t],r)}static ENOENT(t){return this.create(i.ENOENT,t)}static EEXIST(t){return this.create(i.EEXIST,t)}static EISDIR(t){return this.create(i.EISDIR,t)}static ENOTDIR(t){return this.create(i.ENOTDIR,t)}static EPERM(t){return this.create(i.EPERM,t)}static ENOTEMPTY(t){return this.create(i.ENOTEMPTY,t)}toString(){return this.message}toJSON(){return{errno:this.errno,code:this.code,path:this.path,stack:this.stack,message:this.message}}writeToBuffer(t=s.alloc(this.bufferSize()),r=0){var e=t.write(JSON.stringify(this.toJSON()),r+4);return t.writeUInt32LE(e,r),t}bufferSize(){return 4+s.byteLength(JSON.stringify(this.toJSON()))}}return t.FileError=e});
//# sourceMappingURL=sourcemaps/file-error.js.map
