/**
 * skylark-io-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./files","./error-codes","./file-error"],function(n,s,r){"use strict";return n.BaseFile=class{sync(n){n(new r(s.ENOTSUP))}syncSync(){throw new r(s.ENOTSUP)}datasync(n){this.sync(n)}datasyncSync(){return this.syncSync()}chown(n,e,c){c(new r(s.ENOTSUP))}chownSync(n,e){throw new r(s.ENOTSUP)}chmod(n,e){e(new r(s.ENOTSUP))}chmodSync(n){throw new r(s.ENOTSUP)}utimes(n,e,c){c(new r(s.ENOTSUP))}utimesSync(n,e){throw new r(s.ENOTSUP)}}});
//# sourceMappingURL=sourcemaps/base-file.js.map
