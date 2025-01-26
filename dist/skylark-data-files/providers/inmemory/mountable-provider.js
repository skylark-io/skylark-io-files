/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-paths","../../files","../registry","../base-provider","./in-memory-provider","../../file-error","../../error-codes","../../utils"],function(i,t,r,s,a,o,e,n){"use strict";const h=n["mkdirpSync"];class u extends s{constructor(t){super(),this.mountList=[],this.mntMap={},this.rootFs=t}static Create(e,n){a.Create({},(t,r)=>{if(r){const s=new u(r);try{Object.keys(e).forEach(t=>{s.mount(t,e[t])})}catch(t){return n(t)}n(null,s)}else n(t)})}static isAvailable(){return!0}mount(t,r){if("/"!==t[0]&&(t="/"+t),t=i.resolve(t),this.mntMap[t])throw new o(e.EINVAL,"Mount point "+t+" is already taken.");h(t,511,this.rootFs),this.mntMap[t]=r,this.mountList.push(t),this.mountList=this.mountList.sort((t,r)=>r.length-t.length)}umount(t){if("/"!==t[0]&&(t="/"+t),t=i.resolve(t),!this.mntMap[t])throw new o(e.EINVAL,"Mount point "+t+" is already unmounted.");for(delete this.mntMap[t],this.mountList.splice(this.mountList.indexOf(t),1);"/"!==t&&0===this.rootFs.readdirSync(t).length;)this.rootFs.rmdirSync(t),t=i.dirname(t)}_getFs(r){var s=this.mountList,e=s.length;for(let t=0;t<e;t++){var n=s[t];if(n.length<=r.length&&0===r.indexOf(n))return""===(r=r.substr(1<n.length?n.length:0))&&(r="/"),{fs:this.mntMap[n],path:r,mountPoint:n}}return{fs:this.rootFs,path:r,mountPoint:"/"}}getName(){return u.Name}diskSpace(t,r){r(0,0)}isReadOnly(){return!1}supportsLinks(){return!1}supportsProps(){return!1}supportsSynch(){return!0}standardizeError(t,r,s){var e=t.message.indexOf(r);return-1!==e&&(t.message=t.message.substr(0,e)+s+t.message.substr(e+r.length),t.path=s),t}rename(s,e,n){const r=this._getFs(s),i=this._getFs(e);return r.fs===i.fs?r.fs.rename(r.path,i.path,t=>{t&&this.standardizeError(this.standardizeError(t,r.path,s),i.path,e),n(t)}):fs.readFile(s,function(t,r){if(t)return n(t);fs.writeFile(e,r,function(t){if(t)return n(t);fs.unlink(s,n)})})}renameSync(r,s){var e=this._getFs(r),n=this._getFs(s);if(e.fs===n.fs)try{return e.fs.renameSync(e.path,n.path)}catch(t){throw this.standardizeError(this.standardizeError(t,e.path,r),n.path,s),t}e=fs.readFileSync(r);return fs.writeFileSync(s,e),fs.unlinkSync(r)}readdirSync(r){var s=this._getFs(r);let e=null;if(s.fs!==this.rootFs)try{e=this.rootFs.readdirSync(r)}catch(t){}try{const n=s.fs.readdirSync(s.path);return null===e?n:n.concat(e.filter(t=>-1===n.indexOf(t)))}catch(t){if(null===e)throw this.standardizeError(t,s.path,r);return e}}readdir(e,n){const i=this._getFs(e);i.fs.readdir(i.path,(r,s)=>{if(i.fs!==this.rootFs)try{var t=this.rootFs.readdirSync(e);s=s?s.concat(t.filter(t=>-1===s.indexOf(t))):t}catch(t){if(r)return n(this.standardizeError(r,i.path,e))}else if(r)return n(this.standardizeError(r,i.path,e));n(null,s)})}realpathSync(r,t){var s=this._getFs(r);try{var e=s.fs.realpathSync(s.path,{});return i.resolve(i.join(s.mountPoint,e))}catch(t){throw this.standardizeError(t,s.path,r)}}realpath(s,t,e){const n=this._getFs(s);n.fs.realpath(n.path,{},(t,r)=>{t?e(this.standardizeError(t,n.path,s)):e(null,i.resolve(i.join(n.mountPoint,r)))})}rmdirSync(r){var s=this._getFs(r);if(this._containsMountPt(r))throw o.ENOTEMPTY(r);try{s.fs.rmdirSync(s.path)}catch(t){throw this.standardizeError(t,s.path,r)}}rmdir(r,s){const e=this._getFs(r);this._containsMountPt(r)?s(o.ENOTEMPTY(r)):e.fs.rmdir(e.path,t=>{s(t?this.standardizeError(t,e.path,r):null)})}_containsMountPt(r){var s=this.mountList,e=s.length;for(let t=0;t<e;t++){var n=s[t];if(n.length>=r.length&&n.slice(0,r.length)===r)return!0}return!1}}function l(n,t){return t?function(...t){var r=t[0],s=this._getFs(r);t[0]=s.path;try{return s.fs[n].apply(s.fs,t)}catch(t){throw this.standardizeError(t,s.path,r),t}}:function(...t){const r=t[0],s=this._getFs(r);if(t[0]=s.path,"function"==typeof t[t.length-1]){const e=t[t.length-1];t[t.length-1]=(...t)=>{0<t.length&&t[0]instanceof o&&this.standardizeError(t[0],s.path,r),e.apply(null,t)}}return s.fs[n].apply(s.fs,t)}}u.Name="MountableProvider",u.Options={};var c=[["exists","unlink","readlink"],["stat","mkdir","truncate"],["open","readFile","chmod","utimes"],["chown"],["writeFile","appendFile"]];for(let t=0;t<c.length;t++)for(const d of c[t])u.prototype[d]=l(d,!1,t),u.prototype[d+"Sync"]=l(d+"Sync",!0,t);return t.providers.MountableProvider=u});
//# sourceMappingURL=../../sourcemaps/providers/inmemory/mountable-provider.js.map
