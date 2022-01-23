/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./files","./error-codes","./file-error"],function(n,e,c){"use strict";return n.BaseFile=class{sync(n){n(new c(e.ENOTSUP))}syncSync(){throw new c(e.ENOTSUP)}datasync(n){this.sync(n)}datasyncSync(){return this.syncSync()}chown(n,s,r){r(new c(e.ENOTSUP))}chownSync(n,s){throw new c(e.ENOTSUP)}chmod(n,s){s(new c(e.ENOTSUP))}chmodSync(n){throw new c(e.ENOTSUP)}utimes(n,s,r){r(new c(e.ENOTSUP))}utimesSync(n,s){throw new c(e.ENOTSUP)}}});
//# sourceMappingURL=sourcemaps/base-file.js.map
