/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../simple-sync-rw-transaction"],function(e){"use strict";return class{constructor(){this.store={}}clear(){this.store={}}beginTransaction(t){return new e(this)}get(t){return this.store[t]}put(t,e,r){return!(!r&&this.store.hasOwnProperty(t)||(this.store[t]=e,0))}del(t){delete this.store[t]}}});
//# sourceMappingURL=../../sourcemaps/providers/inmemory/in-memory-store.js.map
