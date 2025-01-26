/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../file-error","../../error-codes","../async-key-value-provider","../../utils"],function(s,c,r,e){"use strict";const a=e["arrayBuffer2Buffer"];function i(r,e=r.toString()){switch(r.name){case"NotFoundError":return new s(c.ENOENT,e);case"QuotaExceededError":return new s(c.ENOSPC,e);default:return new s(c.EIO,e)}}return class{constructor(r,e){this.tx=r,this.store=e}get(r,e){try{var t=this.store.get(r);t.onerror=(n=e,o=c.EIO,u=null,function(r){r.preventDefault(),n(new s(o,null!==u?u:void 0))}),t.onsuccess=r=>{r=r.target.result;e(null,void 0===r?r:a(r))}}catch(r){e(i(r))}var n,o,u}}});
//# sourceMappingURL=../../sourcemaps/providers/indexeddb/indexed-db-ro-transaction.js.map
