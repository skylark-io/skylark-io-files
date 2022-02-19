/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../files","../error-codes","../file-error"],function(t,i,s){"use strict";return t.providers.SimpleSyncRWTransaction=class{constructor(t){this.store=t,this.originalData={},this.modifiedKeys=[]}get(t){const i=this.store.get(t);return this.stashOldValue(t,i),i}put(t,i,s){return this.markModified(t),this.store.put(t,i,s)}del(t){this.markModified(t),this.store.del(t)}commit(){}abort(){for(const t of this.modifiedKeys){const i=this.originalData[t];i?this.store.put(t,i,!0):this.store.del(t)}}stashOldValue(t,i){this.originalData.hasOwnProperty(t)||(this.originalData[t]=i)}markModified(t){-1===this.modifiedKeys.indexOf(t)&&(this.modifiedKeys.push(t),this.originalData.hasOwnProperty(t)||(this.originalData[t]=this.store.get(t)))}}});
//# sourceMappingURL=../sourcemaps/providers/simple-sync-rw-transaction.js.map
