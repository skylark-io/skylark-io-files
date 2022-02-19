/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./files","./file-system","./error-codes","./file-error","./providers/registry"],function(e,n,t,i,o){"use strict";var r=e.fs=new n;function s(e){return r.initialize(e)}return e.configure=function(e,n){!function e(n,r){const s=n.fs;if(!s)return r(new i(t.EPERM,'Missing "fs" property on configuration object.'));const f=n.options;let c=0,l=!1;function u(){if(!l){l=!0;const e=o.get(s);e?e.Create(f,r):r(new i(t.EPERM,`File system ${s} is not available in BrowserFS.`))}}if(null!==f&&"object"==typeof f){let n=!1;const t=Object.keys(f).filter(e=>"fs"!==e);t.forEach(t=>{const i=f[t];null!==i&&"object"==typeof i&&i.fs&&(c++,e(i,function(e,i){if(c--,e){if(l)return;l=!0,r(e)}else f[t]=i,0===c&&n&&u()}))}),n=!0}0===c&&u()}(e,(e,t)=>{t?(s(t),n(t)):n(e)})}});
//# sourceMappingURL=sourcemaps/configure.js.map
