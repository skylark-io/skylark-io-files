/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define([],function(){"use strict";function i(r,n,e){return r.toString("ascii",n,n+e).trim()}function c(r,n){var e=r.slice(n),t=new SystemUseEntry(e);switch(t.signatureWord()){case 17221:return new CEEntry(e);case 20548:return new PDEntry(e);case 21328:return new SPEntry(e);case 21332:return new STEntry(e);case 17746:return new EREntry(e);case 17747:return new ESEntry(e);case 20568:return new PXEntry(e);case 20558:return new PNEntry(e);case 21324:return new SLEntry(e);case 20045:return new NMEntry(e);case 17228:return new CLEntry(e);case 20556:return new PLEntry(e);case 21061:return new REEntry(e);case 21574:return new TFEntry(e);case 21318:return new SFEntry(e);case 21074:return new RREntry(e);default:return t}}return{getASCIIString:i,getJolietString:function(n,e,r){if(1===r)return String.fromCharCode(n[e]);var t=Math.floor(r/2),a=new Array(t);for(let r=0;r<t;r++){var s=e+(r<<1);a[r]=String.fromCharCode(n[s+1]|n[s]<<8)}return a.join("")},getDate:function(r,n){var e=parseInt(i(r,n,4),10),t=parseInt(i(r,n+4,2),10),a=parseInt(i(r,n+6,2),10),s=parseInt(i(r,n+8,2),10),u=parseInt(i(r,n+10,2),10),c=parseInt(i(r,n+12,2),10),r=parseInt(i(r,n+14,2),10);return new Date(e,t,a,s,u,c,100*r)},getShortFormDate:function(r,n){var e=r[n],t=r[n+1],a=r[n+2],s=r[n+3],u=r[n+4],r=r[n+5];return new Date(e,t-1,a,s,u,r)},constructSystemUseEntry:c,constructSystemUseEntries:function(r,n,e,t){e-=4;let a=new Array;for(;n<e;){var s=c(r,n),u=s.length();if(0===u)return a;if(n+=u,s instanceof STEntry)break;s instanceof CEEntry?a=a.concat(s.getEntries(t)):a.push(s)}return a}}});
//# sourceMappingURL=../../sourcemaps/providers/iso/misc.js.map
