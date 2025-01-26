/**
 * skylark-io-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./files","./file-system","./error-codes","./file-error","./providers/registry"],function(e,t,i,u,a){"use strict";var o=e.fs=new t;return e.configure=function(e,n){!function t(e,o){const n=e.fs;if(!n)return o(new u(i.EPERM,'Missing "fs" property on configuration object.'));const s=e.options;let r=0;let f=!1;function c(){if(!f){f=!0;const e=a.get(n);e?e.Create(s,o):o(new u(i.EPERM,`File system ${n} is not available in BrowserFS.`))}}if(null!==s&&"object"==typeof s){let i=!1;const l=Object.keys(s).filter(e=>"fs"!==e);l.forEach(n=>{const e=s[n];null!==e&&"object"==typeof e&&e.fs&&(r++,t(e,function(e,t){r--,e?f||(f=!0,o(e)):(s[n]=t,0===r&&i&&c())}))}),i=!0}0===r&&c()}(e,(e,t)=>{t?(o.initialize(t),n(null,o)):n(e)})}});
//# sourceMappingURL=sourcemaps/configure.js.map
