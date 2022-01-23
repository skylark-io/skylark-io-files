/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-binary/buffer","../sync-key-value-provider","../../error-codes","../../file-error","./local-storage-store"],function(e,r,t,o,a){"use strict";let n,i=!1;try{window.localStorage.setItem("__test__",String.fromCharCode(55296)),i=window.localStorage.getItem("__test__")===String.fromCharCode(55296)}catch(e){i=!1}n=i?"binary_string":"binary_string_ie",e.isEncoding(n)||(n="base64");class s extends r{constructor(){super({store:new a})}static Create(e,r){r(null,new s)}static isAvailable(){return void 0!==window.localStorage}}return s.Name="LocalStorage",s.Options={},s.LocalStorageStore=a,s});
//# sourceMappingURL=../../sourcemaps/providers/localstorage/local-storage-provider.js.map
