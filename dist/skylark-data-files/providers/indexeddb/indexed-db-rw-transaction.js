/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../file-error","../../error-codes","../async-key-value-provider","../../utils","./indexed-db-ro-transaction"],function(e,t,r,n,o){"use strict";const{arrayBuffer2Buffer:s,buffer2ArrayBuffer:c}=n;window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;function u(r,n=r.toString()){switch(r.name){case"NotFoundError":return new e(t.ENOENT,n);case"QuotaExceededError":return new e(t.ENOSPC,n);default:return new e(t.EIO,n)}}function i(r,n=t.EIO,o=null){return function(t){t.preventDefault(),r(new e(n,null!==o?o:void 0))}}class o{constructor(e,t){this.tx=e,this.store=t}get(e,t){try{const r=this.store.get(e);r.onerror=i(t),r.onsuccess=(e=>{const r=e.target.result;t(null,void 0===r?r:s(r))})}catch(e){t(u(e))}}}return class extends o{constructor(e,t){super(e,t)}put(e,t,r,n){try{const o=c(t);let s;(s=r?this.store.put(o,e):this.store.add(o,e)).onerror=i(n),s.onsuccess=(e=>{n(null,!0)})}catch(e){n(u(e))}}del(e,t){try{const r=this.store.delete(e);r.onerror=i(t),r.onsuccess=(e=>{t()})}catch(e){t(u(e))}}commit(e){setTimeout(e,0)}abort(e){let t=null;try{this.tx.abort()}catch(e){t=u(e)}finally{e(t)}}}});
//# sourceMappingURL=../../sourcemaps/providers/indexeddb/indexed-db-rw-transaction.js.map
