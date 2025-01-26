/**
 * skylark-io-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-binary/buffer","../../error-codes","../../file-error"],function(s,c,a){"use strict";return{fetchIsAvailable:"undefined"!=typeof fetch&&null!==fetch,fetchFileAsync:function(e,n,t){let r;try{r=fetch(e)}catch(e){return t(new a(c.EINVAL,e.message))}r.then(e=>{if(!e.ok)return t(new a(c.EIO,"fetch error: response returned code "+e.status));switch(n){case"buffer":e.arrayBuffer().then(e=>t(null,s.from(e))).catch(e=>t(new a(c.EIO,e.message)));break;case"json":e.json().then(e=>t(null,e)).catch(e=>t(new a(c.EIO,e.message)));break;default:t(new a(c.EINVAL,"Invalid download type: "+n))}}).catch(e=>t(new a(c.EIO,e.message)))},fetchFileSizeAsync:function(e,n){fetch(e,{method:"HEAD"}).then(e=>e.ok?n(null,parseInt(e.headers.get("Content-Length")||"-1",10)):n(new a(c.EIO,"fetch HEAD error: response returned code "+e.status))).catch(e=>n(new a(c.EIO,e.message)))}}});
//# sourceMappingURL=../../sourcemaps/providers/http/fetch.js.map
