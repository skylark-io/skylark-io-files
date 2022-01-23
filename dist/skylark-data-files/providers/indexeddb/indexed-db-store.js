/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../file-error","../../error-codes","./indexed-db-ro-transaction","./indexed-db-rw-transaction"],function(e,t,r,n){"use strict";function o(r,n=t.EIO,o=null){return function(t){t.preventDefault(),r(new e(n,null!==o?o:void 0))}}class s{constructor(e,t){this.db=e,this.storeName=t}static Create(e,r){const n=indexedDB.open(e,1);n.onupgradeneeded=(t=>{const r=t.target.result;r.objectStoreNames.contains(e)&&r.deleteObjectStore(e),r.createObjectStore(e)}),n.onsuccess=(t=>{r(null,new s(t.target.result,e))}),n.onerror=o(r,t.EACCES)}name(){return IndexedDBProvider.Name+" - "+this.storeName}clear(r){try{const n=this.db.transaction(this.storeName,"readwrite").objectStore(this.storeName).clear();n.onsuccess=(e=>{setTimeout(r,0)}),n.onerror=o(r)}catch(n){r(function(r,n=r.toString()){switch(r.name){case"NotFoundError":return new e(t.ENOENT,n);case"QuotaExceededError":return new e(t.ENOSPC,n);default:return new e(t.EIO,n)}}(n))}}beginTransaction(o="readonly"){const s=this.db.transaction(this.storeName,o),a=s.objectStore(this.storeName);if("readwrite"===o)return new n(s,a);if("readonly"===o)return new r(s,a);throw new e(t.EINVAL,"Invalid transaction type.")}}return s});
//# sourceMappingURL=../../sourcemaps/providers/indexeddb/indexed-db-store.js.map
