/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-binary/buffer","../../error-codes","../../file-error"],function(e,n,t){"use strict";return{fetchIsAvailable:"undefined"!=typeof fetch&&null!==fetch,fetchFileAsync:function(r,s,c){let a;try{a=fetch(r)}catch(e){return c(new t(n.EINVAL,e.message))}a.then(r=>{if(!r.ok)return c(new t(n.EIO,`fetch error: response returned code ${r.status}`));switch(s){case"buffer":r.arrayBuffer().then(n=>c(null,e.from(n))).catch(e=>c(new t(n.EIO,e.message)));break;case"json":r.json().then(e=>c(null,e)).catch(e=>c(new t(n.EIO,e.message)));break;default:c(new t(n.EINVAL,"Invalid download type: "+s))}}).catch(e=>c(new t(n.EIO,e.message)))},fetchFileSizeAsync:function(e,r){fetch(e,{method:"HEAD"}).then(e=>e.ok?r(null,parseInt(e.headers.get("Content-Length")||"-1",10)):r(new t(n.EIO,`fetch HEAD error: response returned code ${e.status}`))).catch(e=>r(new t(n.EIO,e.message)))}}});
//# sourceMappingURL=../../sourcemaps/providers/http/fetch.js.map
