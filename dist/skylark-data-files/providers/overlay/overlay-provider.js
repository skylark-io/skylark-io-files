/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-paths","../../files","../registry","../../stats","../../file-type","../../file-error","../../error-codes","../../file-flag","../../action-type","../locked-provider","./unlocked-overlay-provider"],function(e,r,i,t,l,a,s,o,n,d,c){class p extends d{constructor(e,r){super(new c(e,r))}static Create(e,r){try{const i=new p(e.writable,e.readable);i._initialize(e=>{r(e,i)})}catch(e){r(e)}}static isAvailable(){return c.isAvailable()}getOverlayedProviders(){return super.getFSUnlocked().getOverlayedProviders()}unwrap(){return super.getFSUnlocked()}_initialize(e){super.getFSUnlocked()._initialize(e)}}return p.Name="OverlayProvider",p.Options={writable:{type:"object",description:"The file system to write modified files to."},readable:{type:"object",description:"The file system that initially populates this file system."}},i.add("overlay",p),r.providers.OverlayProvider=p});
//# sourceMappingURL=../../sourcemaps/providers/overlay/overlay-provider.js.map
