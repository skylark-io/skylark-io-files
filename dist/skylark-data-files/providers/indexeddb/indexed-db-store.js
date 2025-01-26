/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../file-error","../../error-codes","./indexed-db-ro-transaction","./indexed-db-rw-transaction"],function(o,a,n,s){"use strict";function t(e,r=e.toString()){switch(e.name){case"NotFoundError":return new o(a.ENOENT,r);case"QuotaExceededError":return new o(a.ENOSPC,r);default:return new o(a.EIO,r)}}function i(r,t=a.EIO,n=null){return function(e){e.preventDefault(),r(new o(t,null!==n?n:void 0))}}return class c{constructor(e,r){this.db=e,this.storeName=r}static Create(r,t){var e=indexedDB.open(r,1);e.onupgradeneeded=e=>{(e=e.target.result).objectStoreNames.contains(r)&&e.deleteObjectStore(r),e.createObjectStore(r)},e.onsuccess=e=>{t(null,new c(e.target.result,r))},e.onerror=i(t,a.EACCES)}name(){return IndexedDBProvider.Name+" - "+this.storeName}clear(r){try{var e=this.db.transaction(this.storeName,"readwrite").objectStore(this.storeName).clear();e.onsuccess=e=>{setTimeout(r,0)},e.onerror=i(r)}catch(e){r(t(e))}}beginTransaction(e="readonly"){var r=this.db.transaction(this.storeName,e),t=r.objectStore(this.storeName);if("readwrite"===e)return new s(r,t);if("readonly"===e)return new n(r,t);throw new o(a.EINVAL,"Invalid transaction type.")}}});
//# sourceMappingURL=../../sourcemaps/providers/indexeddb/indexed-db-store.js.map
