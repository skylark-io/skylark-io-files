/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../file-error","../../error-codes","../async-key-value-provider","../registry","../../utils","./indexed-db-store","./indexed-db-ro-transaction","./indexed-db-rw-transaction"],function(e,n,t,i,s,o,r,d){"use strict";const a=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;class c extends t{constructor(e){super(e)}static Create(e={},n){o.Create(e.storeName?e.storeName:"browserfs",(t,i)=>{if(i){const t=new c("number"==typeof e.cacheSize?e.cacheSize:100);t.init(i,e=>{e?n(e):n(null,t)})}else n(t)})}static isAvailable(){try{return void 0!==a&&null!==a.open("__browserfs_test__")}catch(e){return!1}}}return c.Name="IndexedDB",c.Options={storeName:{type:"string",optional:!0,description:"The name of this file system. You can have multiple IndexedDB file systems operating at once, but each must have a different name."},cacheSize:{type:"number",optional:!0,description:"The size of the inode cache. Defaults to 100. A size of 0 or below disables caching."}},c.IndexedDBROTransaction=r,c.IndexedDBRWTransaction=d,c.IndexedDBStore=o,i.add("indexedDB",c),c});
//# sourceMappingURL=../../sourcemaps/providers/indexeddb/indexed-db-provider.js.map
