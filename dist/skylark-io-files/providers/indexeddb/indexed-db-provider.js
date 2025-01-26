/**
 * skylark-io-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../files","../../file-error","../../error-codes","../async-key-value-provider","../registry","../../utils","./indexed-db-store","./indexed-db-ro-transaction","./indexed-db-rw-transaction"],function(e,n,t,i,d,r,s,o,a){"use strict";const c=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;class l extends i{constructor(e){super(e)}static Create(i={},d){s.Create(i.storeName||"browserfs",(e,n)=>{if(n){const t=new l("number"==typeof i.cacheSize?i.cacheSize:100);t.init(n,e=>{e?d(e):d(null,t)})}else d(e)})}static isAvailable(){try{return void 0!==c&&null!==c.open("__browserfs_test__")}catch(e){return!1}}}return l.Name="IndexedDB",l.Options={storeName:{type:"string",optional:!0,description:"The name of this file system. You can have multiple IndexedDB file systems operating at once, but each must have a different name."},cacheSize:{type:"number",optional:!0,description:"The size of the inode cache. Defaults to 100. A size of 0 or below disables caching."}},l.IndexedDBROTransaction=o,l.IndexedDBRWTransaction=a,l.IndexedDBStore=s,d.add("indexedDB",l),e.providers.IndexedDBProvider=l});
//# sourceMappingURL=../../sourcemaps/providers/indexeddb/indexed-db-provider.js.map
