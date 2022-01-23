/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../stats","../../file-type","../../file-error","../../error-codes","../../file-flag","../../action-type","../../utils"],function(e,r,t,o,a,f,n){const{buffer2ArrayBuffer:s,arrayBuffer2Buffer:c,emptyBuffer:u}=n;function l(e){return s(e)}function i(e){return c(e)}return{FileErrorLocal2Remote:FileErrorLocal2Remote,errorLocal2Remote:function(e){return{type:SpecialArgType.ERROR,name:e.name,message:e.message,stack:e.stack}},errorRemote2Local:function(e){let r=global[e.name];"function"!=typeof r&&(r=Error);const t=new r(e.message);return t.stack=e.stack,t},statsLocal2Remote:function(e){return{type:SpecialArgType.STATS,statsData:l(e.toBuffer())}},statsRemote2Local:function(r){return e.fromBuffer(i(r.statsData))},fileFlagLocal2Remote:function(e){return{type:SpecialArgType.FILEFLAG,flagStr:e.getFlagString()}},fileFlagRemote2Local:function(e){return a.getFileFlag(e.flagStr)},bufferToTransferrableObject:l,transferrableObjectToBuffer:i,bufferLocal2Remote:function(e){return{type:SpecialArgType.BUFFER,data:l(e)}},bufferRemote2Local:function(e){return i(e.data)},isAPIRequest:function(e){return e&&"object"==typeof e&&e.hasOwnProperty("browserfsMessage")&&e.browserfsMessage},isAPIResponse:function(e){return e&&"object"==typeof e&&e.hasOwnProperty("browserfsMessage")&&e.browserfsMessage}}});
//# sourceMappingURL=../../sourcemaps/providers/worker/misc.js.map
