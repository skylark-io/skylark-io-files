/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../file-error","../../error-codes","../async-key-value-provider","../../utils","./indexed-db-ro-transaction"],function(o,s,e,r,t){"use strict";const u=r["buffer2ArrayBuffer"];window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;function d(e,r=e.toString()){switch(e.name){case"NotFoundError":return new o(s.ENOENT,r);case"QuotaExceededError":return new o(s.ENOSPC,r);default:return new o(s.EIO,r)}}function c(r,t=s.EIO,n=null){return function(e){e.preventDefault(),r(new o(t,null!==n?n:void 0))}}class n extends t{constructor(e,r){super(e,r)}put(e,r,t,n){try{var o=u(r),s=t?this.store.put(o,e):this.store.add(o,e);s.onerror=c(n),s.onsuccess=e=>{n(null,!0)}}catch(e){n(d(e))}}del(e,r){try{var t=this.store.delete(e);t.onerror=c(r),t.onsuccess=e=>{r()}}catch(e){r(d(e))}}commit(e){setTimeout(e,0)}abort(e){let r=null;try{this.tx.abort()}catch(e){r=d(e)}finally{e(r)}}}return n});
//# sourceMappingURL=../../sourcemaps/providers/indexeddb/indexed-db-rw-transaction.js.map
