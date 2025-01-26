/**
 * skylark-io-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./special-arg-type"],function(a){return class{constructor(){this._callbacks={},this._nextId=0}toRemoteArg(t){var e=this._nextId++;return this._callbacks[e]=t,{type:a.CB,id:e}}toLocalArg(t){var e=this._callbacks[t];return delete this._callbacks[t],e}}});
//# sourceMappingURL=../../sourcemaps/providers/worker/callback-argument-converter.js.map
