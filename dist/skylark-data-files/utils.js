/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-binary/buffer","skylark-langx-paths","./file-error","./error-codes"],function(e,t,n,r){"use strict";function i(e){return e instanceof Uint8Array?e:new Uint8Array(e)}function o(t){return t instanceof e?t:0===t.byteOffset&&t.byteLength===t.buffer.byteLength?f(t.buffer):e.from(t.buffer,t.byteOffset,t.byteLength)}function f(t){return e.from(t)}let s=null;function a(){return s||(s=e.alloc(0))}return{deprecationMessage:function(e,t,n){e&&console.warn(`[${t}] Direct file system constructor usage is deprecated for this file system, and will be removed in the next major version. Please use the '${t}.Create(${JSON.stringify(n)}, callback)' method instead. See https://github.com/jvilk/BrowserFS/issues/176 for more details.`)},isIE:"undefined"!=typeof navigator&&!(!/(msie) ([\w.]+)/.exec(navigator.userAgent.toLowerCase())&&-1===navigator.userAgent.indexOf("Trident")),isWebWorker:"undefined"==typeof window,fail:function(){throw new Error("BFS has reached an impossible code path; please file a bug.")},mkdirpSync:function e(t,n,r){r.existsSync(t)||(e(path.dirname(t),n,r),r.mkdirSync(t,n))},buffer2ArrayBuffer:function(e){const t=i(e),n=t.byteOffset,r=t.byteLength;return 0===n&&r===t.buffer.byteLength?t.buffer:t.buffer.slice(n,n+r)},buffer2Uint8array:i,arrayish2Buffer:function(t){return t instanceof e?t:t instanceof Uint8Array?o(t):e.from(t)},uint8Array2Buffer:o,arrayBuffer2Buffer:f,copyingSlice:function(e,t=0,n=e.length){if(t<0||n<0||n>e.length||t>n)throw new TypeError(`Invalid slice bounds on buffer of length ${e.length}: [${t}, ${n}]`);if(0===e.length)return a();{const r=i(e),f=e[0],s=(f+1)%255;return e[0]=s,r[0]===s?(r[0]=f,o(r.slice(t,n))):(e[0]=f,o(r.subarray(t,n)))}},emptyBuffer:a,bufferValidator:function(t,i){e.isBuffer(t)?i():i(new n(r.EINVAL,"option must be a Buffer."))},checkOptions:function(e,t,i){const o=e.Options,f=e.Name;let s=0,a=!1,u=!1;function c(e){a||(e&&(a=!0,i(e)),0==--s&&u&&i())}for(const e in o)if(o.hasOwnProperty(e)){const u=o[e],y=t[e];if(void 0===y||null===y){if(!u.optional){const s=Object.keys(t).filter(e=>!(e in o)).map(t=>({str:t,distance:levenshtein(e,t)})).filter(e=>e.distance<5).sort((e,t)=>e.distance-t.distance);if(a)return;return a=!0,i(new n(r.EINVAL,`[${f}] Required option '${e}' not provided.${s.length>0?` You provided unrecognized option '${s[0].str}'; perhaps you meant to type '${e}'.`:""}\nOption description: ${u.description}`))}}else{let t=!1;if(!(t=Array.isArray(u.type)?-1!==u.type.indexOf(typeof y):typeof y===u.type)){if(a)return;return a=!0,i(new n(r.EINVAL,`[${f}] Value provided for option ${e} is not the proper type. Expected ${Array.isArray(u.type)?`one of {${u.type.join(", ")}}`:u.type}, but received ${typeof y}\nOption description: ${u.description}`))}u.validator&&(s++,u.validator(y,c))}}u=!0,0!==s||a||i()}}});
//# sourceMappingURL=sourcemaps/utils.js.map
