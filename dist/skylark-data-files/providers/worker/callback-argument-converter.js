/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./special-arg-type"],function(t){return class{constructor(){this._callbacks={},this._nextId=0}toRemoteArg(c){const s=this._nextId++;return this._callbacks[s]=c,{type:t.CB,id:s}}toLocalArg(t){const c=this._callbacks[t];return delete this._callbacks[t],c}}});
//# sourceMappingURL=../../sourcemaps/providers/worker/callback-argument-converter.js.map
