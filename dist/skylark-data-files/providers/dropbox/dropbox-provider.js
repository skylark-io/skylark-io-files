/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-funcs/defer","skylark-langx-binary/buffer","skylark-langx-paths","../../files","../registry","../base-provider","../../stats","../../file-type","../../file-error","../../error-codes","../../utils","./dropbox-file"],function(n,o,e,t,r,a,i,c,l,h,s,u){"use strict";const{arrayBuffer2Buffer:f,buffer2ArrayBuffer:p}=s,_=e["dirname"];function d(e){return"/"===e?"":e}function m(e){var t,r=e.error;if(!r[".tag"]){if(r.error)return!(t=r.error)[".tag"]&&t.reason&&t.reason[".tag"]?t.reason:t;if("string"==typeof r)try{var a=JSON.parse(r);if(a.error&&a.error.reason&&a.error.reason[".tag"])return a.error.reason}catch(e){}}return r}function w(e){if(e.user_message)return e.user_message.text;if(e.error_summary)return e.error_summary;if("string"==typeof e.error)return e.error;if("object"==typeof e.error)return w(e.error);throw new Error("Dropbox's servers gave us a garbage error message: "+JSON.stringify(e))}function E(e,t,r){switch(e[".tag"]){case"malformed_path":return new l(h.EBADF,r,t);case"not_found":return l.ENOENT(t);case"not_file":return l.EISDIR(t);case"not_folder":return l.ENOTDIR(t);case"restricted_content":return l.EPERM(t);default:return new l(h.EIO,r,t)}}function y(e,t,r){switch(e[".tag"]){case"malformed_path":case"disallowed_name":return new l(h.EBADF,r,t);case"conflict":case"no_write_permission":case"team_folder":return l.EPERM(t);case"insufficient_space":return new l(h.ENOSPC,r);default:return new l(h.EIO,r,t)}}function b(r,a,n){var e={path:d(a)};r.filesDeleteV2(e).then(()=>{n()}).catch(e=>{var t=m(e);switch(t[".tag"]){case"path_lookup":n(E(t.path_lookup,a,w(e)));break;case"path_write":n(y(t.path_write,a,w(e)));break;case"too_many_write_operations":setTimeout(()=>b(r,a,n),500+300*Math.random());break;default:n(new l(h.EIO,w(e),a))}})}class g extends a{constructor(e){super(),this._client=e}static Create(e,t){t(null,new g(e.client))}static isAvailable(){return"undefined"!=typeof Dropbox}getName(){return g.Name}isReadOnly(){return!1}supportsSymlinks(){return!1}supportsProps(){return!1}supportsSynch(){return!1}empty(a){this.readdir("/",(e,t)=>{if(t){const r=e=>{0===t.length?a():b(this._client,t.shift(),r)};r()}else a(e)})}rename(a,n,s){this.stat(n,!1,(e,t)=>{const r=()=>{var e={from_path:d(a),to_path:d(n)};this._client.filesMoveV2(e).then(()=>s()).catch(function(e){var t=m(e);switch(t[".tag"]){case"from_lookup":s(E(t.from_lookup,a,w(e)));break;case"from_write":s(y(t.from_write,a,w(e)));break;case"to":s(y(t.to,n,w(e)));break;case"cant_copy_shared_folder":case"cant_nest_shared_folder":s(new l(h.EPERM,w(e),a));break;case"cant_move_folder_into_itself":case"duplicated_or_nested_paths":s(new l(h.EBADF,w(e),a));break;case"too_many_files":s(new l(h.ENOSPC,w(e),a));break;default:s(new l(h.EIO,w(e),a))}})};e?r():a===n?e?s(l.ENOENT(n)):s():t&&t.isDirectory()?s(l.EISDIR(n)):this.unlink(n,e=>{e?s(e):r()})})}stat(r,e,a){var t;"/"===r?n(function(){a(null,new i(c.DIRECTORY,4096))}):(t={path:d(r)},this._client.filesGetMetadata(t).then(e=>{switch(e[".tag"]){case"file":a(null,new i(c.FILE,e.size));break;case"folder":a(null,new i(c.DIRECTORY,4096));break;case"deleted":a(l.ENOENT(r))}}).catch(e=>{var t=m(e);"path"===t[".tag"]?a(E(t.path,r,w(e))):a(new l(h.EIO,w(e),r))}))}openFile(r,a,n){var e={path:d(r)};this._client.filesDownload(e).then(e=>{e=e.fileBlob;const t=new FileReader;t.onload=()=>{var e=t.result;n(null,new u(this,r,a,new i(c.FILE,e.byteLength),f(e)))},t.readAsArrayBuffer(e)}).catch(e=>{var t=m(e);"path"===t[".tag"]?n(E(t.path,r,w(e))):n(new l(h.EIO,w(e),r))})}createFile(r,a,n,s){const t=o.alloc(0);var e={contents:new Blob([p(t)],{type:"octet/stream"}),path:d(r)};this._client.filesUpload(e).then(e=>{s(null,new u(this,r,a,new i(c.FILE,0),t))}).catch(e=>{var t=m(e);switch(t[".tag"]){case"path":s(y(t.path.reason,r,w(e)));break;case"too_many_write_operations":setTimeout(()=>this.createFile(r,a,n,s),500+300*Math.random());break;default:s(new l(h.EIO,w(e),r))}})}unlink(r,a){this.stat(r,!1,(e,t)=>{t?t.isDirectory()?a(l.EISDIR(r)):b(this._client,r,a):a(e)})}rmdir(r,a){this.readdir(r,(e,t)=>{t?0<t.length?a(l.ENOTEMPTY(r)):b(this._client,r,a):a(e)})}mkdir(r,a,n){const s=_(r);this.stat(s,!1,(e,t)=>{e?n(e):t&&!t.isDirectory()?n(l.ENOTDIR(s)):(e={path:d(r)},this._client.filesCreateFolderV2(e).then(()=>n()).catch(e=>{"too_many_write_operations"===m(e)[".tag"]?setTimeout(()=>this.mkdir(r,a,n),500+300*Math.random()):n(y(m(e).path,r,w(e)))}))})}readdir(t,r){var e={path:d(t)};this._client.filesListFolder(e).then(e=>{!function t(r,a,e,n,s){const o=e.entries.map(e=>e.path_display).filter(e=>!!e);const i=n.concat(o);if(e.has_more){const c={cursor:e.cursor};r.filesListFolderContinue(c).then(e=>{t(r,a,e,i,s)}).catch(e=>{k(e,a,s)})}else s(null,i)}(this._client,t,e,[],r)}).catch(e=>{k(e,t,r)})}_syncFile(r,a,n){var e={contents:new Blob([p(a)],{type:"octet/stream"}),path:d(r),mode:{".tag":"overwrite"}};this._client.filesUpload(e).then(()=>{n()}).catch(e=>{var t=m(e);switch(t[".tag"]){case"path":n(y(t.path.reason,r,w(e)));break;case"too_many_write_operations":setTimeout(()=>this._syncFile(r,a,n),500+300*Math.random());break;default:n(new l(h.EIO,w(e),r))}})}}function k(e,t,r){var a=m(e);"path"===a[".tag"]?r(E(a.path,t,w(e))):r(new l(h.EIO,w(e),t))}return g.Name="DropboxV2",g.Options={client:{type:"object",description:"An *authenticated* Dropbox client. Must be from the 2.5.x JS SDK."}},g.DropboxFile=u,r.add("dropbox",g),t.providers.DropboxProvider=g});
//# sourceMappingURL=../../sourcemaps/providers/dropbox/dropbox-provider.js.map
