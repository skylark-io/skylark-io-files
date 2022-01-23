/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../file-error","../../error-codes","../async-key-value-provider","../../utils"],function(r,e,t,n){"use strict";const{arrayBuffer2Buffer:o,buffer2ArrayBuffer:u}=n;return class{constructor(r,e){this.tx=r,this.store=e}get(t,n){try{const u=this.store.get(t);u.onerror=function(t,n=e.EIO,o=null){return function(e){e.preventDefault(),t(new r(n,null!==o?o:void 0))}}(n),u.onsuccess=(r=>{const e=r.target.result;n(null,void 0===e?e:o(e))})}catch(t){n(function(t,n=t.toString()){switch(t.name){case"NotFoundError":return new r(e.ENOENT,n);case"QuotaExceededError":return new r(e.ENOSPC,n);default:return new r(e.EIO,n)}}(t))}}}});
//# sourceMappingURL=../../sourcemaps/providers/indexeddb/indexed-db-ro-transaction.js.map
