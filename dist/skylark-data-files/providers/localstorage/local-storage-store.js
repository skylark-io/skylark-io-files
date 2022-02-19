/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-binary/buffer","../simple-sync-rw-transaction","../../error-codes","../../file-error"],function(e,r,t,n){"use strict";return class{name(){return LocalStorageProvider.Name}clear(){window.localStorage.clear()}beginTransaction(e){return new r(this)}get(r){try{const t=window.localStorage.getItem(r);if(null!==t)return e.from(t,binaryEncoding)}catch(e){}}put(e,r,o){try{return!(!o&&null!==window.localStorage.getItem(e)||(window.localStorage.setItem(e,r.toString(binaryEncoding)),0))}catch(e){throw new n(t.ENOSPC,"LocalStorage is full.")}}del(e){try{window.localStorage.removeItem(e)}catch(r){throw new n(t.EIO,"Unable to delete key "+e+": "+r)}}}});
//# sourceMappingURL=../../sourcemaps/providers/localstorage/local-storage-store.js.map
