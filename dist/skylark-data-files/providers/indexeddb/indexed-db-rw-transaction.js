/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../file-error","../../error-codes","../async-key-value-provider","../../utils","./indexed-db-ro-transaction"],function(e,r,t,n,o){"use strict";const{arrayBuffer2Buffer:s,buffer2ArrayBuffer:u}=n;window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;function c(t,n=t.toString()){switch(t.name){case"NotFoundError":return new e(r.ENOENT,n);case"QuotaExceededError":return new e(r.ENOSPC,n);default:return new e(r.EIO,n)}}function d(t,n=r.EIO,o=null){return function(r){r.preventDefault(),t(new e(n,null!==o?o:void 0))}}return class extends o{constructor(e,r){super(e,r)}put(e,r,t,n){try{const o=u(r);let s;(s=t?this.store.put(o,e):this.store.add(o,e)).onerror=d(n),s.onsuccess=(e=>{n(null,!0)})}catch(e){n(c(e))}}del(e,r){try{const t=this.store.delete(e);t.onerror=d(r),t.onsuccess=(e=>{r()})}catch(e){r(c(e))}}commit(e){setTimeout(e,0)}abort(e){let r=null;try{this.tx.abort()}catch(e){r=c(e)}finally{e(r)}}}});
//# sourceMappingURL=../../sourcemaps/providers/indexeddb/indexed-db-rw-transaction.js.map
