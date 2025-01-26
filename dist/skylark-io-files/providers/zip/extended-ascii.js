/**
 * skylark-io-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(function(){"use strict";class h{static str2byte(r,n){var a,t=(r.length>n.length?n:r).length;for(let e=0;e<t;e++){let t=r.charCodeAt(e);n[t=127<t&&-1<(a=h.extendedChars.indexOf(r.charAt(e)))?a+128:t]=e}return t}static byte2str(e){var r=new Array(e.length);for(let t=0;t<e.length;t++){var n=e[t];r[t]=127<n?h.extendedChars[n-128]:String.fromCharCode(n)}return r.join("")}static byteLength(t){return t.length}}return h.extendedChars=["Ç","ü","é","â","ä","à","å","ç","ê","ë","è","ï","î","ì","Ä","Å","É","æ","Æ","ô","ö","ò","û","ù","ÿ","Ö","Ü","ø","£","Ø","×","ƒ","á","í","ó","ú","ñ","Ñ","ª","º","¿","®","¬","½","¼","¡","«","»","_","_","_","¦","¦","Á","Â","À","©","¦","¦","+","+","¢","¥","+","+","-","-","+","-","+","ã","Ã","+","+","-","-","¦","-","+","¤","ð","Ð","Ê","Ë","È","i","Í","Î","Ï","+","+","_","_","¦","Ì","_","Ó","ß","Ô","Ò","õ","Õ","µ","þ","Þ","Ú","Û","Ù","ý","Ý","¯","´","­","±","_","¾","¶","§","÷","¸","°","¨","·","¹","³","²","_"," "],h});
//# sourceMappingURL=../../sourcemaps/providers/zip/extended-ascii.js.map
