/**
 * skylark-io-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-binary/buffer","../../files","../registry","../sync-key-value-provider","../../error-codes","../../file-error","./local-storage-store"],function(r,e,t,o,a,i,s){"use strict";let n=!1,l;try{window.localStorage.setItem("__test__",String.fromCharCode(55296)),n=window.localStorage.getItem("__test__")===String.fromCharCode(55296)}catch(r){n=!1}l=n?"binary_string":"binary_string_ie",r.isEncoding(l);class c extends o{constructor(){super({store:new s})}static Create(r,e){e(null,new c)}static isAvailable(){return void 0!==window.localStorage}}return c.Name="LocalStorage",c.Options={},c.LocalStorageStore=s,t.add("localStorage",c),e.providers.LocalStorageProvider=c});
//# sourceMappingURL=../../sourcemaps/providers/localstorage/local-storage-provider.js.map
