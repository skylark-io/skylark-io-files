/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-binary/buffer","skylark-langx-paths/path","../files","../error-codes","../file-error","../action-type","../file-flag","../utils","./base-provider"],function(t,c,r,n,i,s,h,y){"use strict";const{fail:a}=util;return file.providers.SynchronousProvider=class extends y{supportsSynch(){return!0}rename(t,c,r){try{this.renameSync(t,c),r()}catch(t){r(t)}}stat(t,c,r){try{r(null,this.statSync(t,c))}catch(t){r(t)}}open(t,c,r,n){try{n(null,this.openSync(t,c,r))}catch(t){n(t)}}unlink(t,c){try{this.unlinkSync(t),c()}catch(t){c(t)}}rmdir(t,c){try{this.rmdirSync(t),c()}catch(t){c(t)}}mkdir(t,c,r){try{this.mkdirSync(t,c),r()}catch(t){r(t)}}readdir(t,c){try{c(null,this.readdirSync(t))}catch(t){c(t)}}chmod(t,c,r,n){try{this.chmodSync(t,c,r),n()}catch(t){n(t)}}chown(t,c,r,n,i){try{this.chownSync(t,c,r,n),i()}catch(t){i(t)}}utimes(t,c,r,n){try{this.utimesSync(t,c,r),n()}catch(t){n(t)}}link(t,c,r){try{this.linkSync(t,c),r()}catch(t){r(t)}}symlink(t,c,r,n){try{this.symlinkSync(t,c,r),n()}catch(t){n(t)}}readlink(t,c){try{c(null,this.readlinkSync(t))}catch(t){c(t)}}}});
//# sourceMappingURL=../sourcemaps/providers/synchronous-provider.js.map
