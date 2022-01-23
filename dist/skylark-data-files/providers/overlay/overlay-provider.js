/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-paths","../../stats","../../file-type","../../file-error","../../error-codes","../../file-flag","../../action-type","../locked-provider","./unlocked-overlay-provider"],function(e,t,i,r,l,a,s,o,n){class d extends o{constructor(e,t){super(new n(e,t))}static Create(e,t){try{const i=new d(e.writable,e.readable);i._initialize(e=>{t(e,i)})}catch(e){t(e)}}static isAvailable(){return n.isAvailable()}getOverlayedProviders(){return super.getFSUnlocked().getOverlayedProviders()}unwrap(){return super.getFSUnlocked()}_initialize(e){super.getFSUnlocked()._initialize(e)}}return d.Name="OverlayProvider",d.Options={writable:{type:"object",description:"The file system to write modified files to."},readable:{type:"object",description:"The file system that initially populates this file system."}},d});
//# sourceMappingURL=../../sourcemaps/providers/overlay/overlay-provider.js.map
