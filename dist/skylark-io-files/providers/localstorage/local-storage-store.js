/**
 * skylark-io-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-binary/buffer","../simple-sync-rw-transaction","../../error-codes","../../file-error"],function(t,r,n,o){"use strict";return class{name(){return LocalStorageProvider.Name}clear(){window.localStorage.clear()}beginTransaction(e){return new r(this)}get(e){try{var r=window.localStorage.getItem(e);if(null!==r)return t.from(r,binaryEncoding)}catch(e){}}put(e,r,t){try{return t||null===window.localStorage.getItem(e)?(window.localStorage.setItem(e,r.toString(binaryEncoding)),!0):!1}catch(e){throw new o(n.ENOSPC,"LocalStorage is full.")}}del(r){try{window.localStorage.removeItem(r)}catch(e){throw new o(n.EIO,"Unable to delete key "+r+": "+e)}}}});
//# sourceMappingURL=../../sourcemaps/providers/localstorage/local-storage-store.js.map
