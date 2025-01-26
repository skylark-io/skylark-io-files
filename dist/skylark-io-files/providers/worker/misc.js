/**
 * skylark-io-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../stats","../../file-type","../../file-error","../../error-codes","../../file-flag","../../action-type","../../utils"],function(r,e,t,o,a,n,f){const{buffer2ArrayBuffer:s,arrayBuffer2Buffer:c}=f;function u(e){return s(e)}function l(e){return c(e)}return{FileErrorLocal2Remote:FileErrorLocal2Remote,errorLocal2Remote:function(e){return{type:SpecialArgType.ERROR,name:e.name,message:e.message,stack:e.stack}},errorRemote2Local:function(e){let r=global[e.name];var t=new(r="function"!=typeof r?Error:r)(e.message);return t.stack=e.stack,t},statsLocal2Remote:function(e){return{type:SpecialArgType.STATS,statsData:u(e.toBuffer())}},statsRemote2Local:function(e){return r.fromBuffer(l(e.statsData))},fileFlagLocal2Remote:function(e){return{type:SpecialArgType.FILEFLAG,flagStr:e.getFlagString()}},fileFlagRemote2Local:function(e){return a.getFileFlag(e.flagStr)},bufferToTransferrableObject:u,transferrableObjectToBuffer:l,bufferLocal2Remote:function(e){return{type:SpecialArgType.BUFFER,data:u(e)}},bufferRemote2Local:function(e){return l(e.data)},isAPIRequest:function(e){return e&&"object"==typeof e&&e.hasOwnProperty("browserfsMessage")&&e.browserfsMessage},isAPIResponse:function(e){return e&&"object"==typeof e&&e.hasOwnProperty("browserfsMessage")&&e.browserfsMessage}}});
//# sourceMappingURL=../../sourcemaps/providers/worker/misc.js.map
