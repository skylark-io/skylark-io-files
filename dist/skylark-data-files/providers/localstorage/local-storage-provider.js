/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-binary/buffer","../../files","../registry","../sync-key-value-provider","../../error-codes","../../file-error","./local-storage-store"],function(e,r,t,o,a,i,s){"use strict";let n,l=!1;try{window.localStorage.setItem("__test__",String.fromCharCode(55296)),l=window.localStorage.getItem("__test__")===String.fromCharCode(55296)}catch(e){l=!1}n=l?"binary_string":"binary_string_ie",e.isEncoding(n)||(n="base64");class c extends o{constructor(){super({store:new s})}static Create(e,r){r(null,new c)}static isAvailable(){return void 0!==window.localStorage}}return c.Name="LocalStorage",c.Options={},c.LocalStorageStore=s,t.add("localStorage",c),r.providers.LocalStorageProvider=c});
//# sourceMappingURL=../../sourcemaps/providers/localstorage/local-storage-provider.js.map
