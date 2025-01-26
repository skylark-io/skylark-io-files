/**
 * skylark-io-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../files","../error-codes","../file-error"],function(i,t,s){"use strict";return i.providers.SimpleSyncRWTransaction=class{constructor(i){this.store=i,this.originalData={},this.modifiedKeys=[]}get(i){var t=this.store.get(i);return this.stashOldValue(i,t),t}put(i,t,s){return this.markModified(i),this.store.put(i,t,s)}del(i){this.markModified(i),this.store.del(i)}commit(){}abort(){for(const t of this.modifiedKeys){var i=this.originalData[t];i?this.store.put(t,i,!0):this.store.del(t)}}stashOldValue(i,t){this.originalData.hasOwnProperty(i)||(this.originalData[i]=t)}markModified(i){-1===this.modifiedKeys.indexOf(i)&&(this.modifiedKeys.push(i),this.originalData.hasOwnProperty(i)||(this.originalData[i]=this.store.get(i)))}}});
//# sourceMappingURL=../sourcemaps/providers/simple-sync-rw-transaction.js.map
