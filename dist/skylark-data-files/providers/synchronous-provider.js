/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-binary/buffer","skylark-langx-paths","../files","../error-codes","../file-error","../action-type","../file-flag","../utils","./base-provider"],function(t,r,c,n,i,s,y,h,a){"use strict";var{}=h;class e extends a{supportsSynch(){return!0}rename(t,r,c){try{this.renameSync(t,r),c()}catch(t){c(t)}}stat(t,r,c){try{c(null,this.statSync(t,r))}catch(t){c(t)}}open(t,r,c,n){try{n(null,this.openSync(t,r,c))}catch(t){n(t)}}unlink(t,r){try{this.unlinkSync(t),r()}catch(t){r(t)}}rmdir(t,r){try{this.rmdirSync(t),r()}catch(t){r(t)}}mkdir(t,r,c){try{this.mkdirSync(t,r),c()}catch(t){c(t)}}readdir(t,r){try{r(null,this.readdirSync(t))}catch(t){r(t)}}chmod(t,r,c,n){try{this.chmodSync(t,r,c),n()}catch(t){n(t)}}chown(t,r,c,n,i){try{this.chownSync(t,r,c,n),i()}catch(t){i(t)}}utimes(t,r,c,n){try{this.utimesSync(t,r,c),n()}catch(t){n(t)}}link(t,r,c){try{this.linkSync(t,r),c()}catch(t){c(t)}}symlink(t,r,c,n){try{this.symlinkSync(t,r,c),n()}catch(t){n(t)}}readlink(t,r){try{r(null,this.readlinkSync(t))}catch(t){r(t)}}}return c.providers.SynchronousProvider=e});
//# sourceMappingURL=../sourcemaps/providers/synchronous-provider.js.map
