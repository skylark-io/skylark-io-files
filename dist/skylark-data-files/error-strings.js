/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./files","./error-codes"],function(e,r){"use strict";var i={};return i[r.EPERM]="Operation not permitted.",i[r.ENOENT]="No such file or directory.",i[r.EIO]="Input/output error.",i[r.EBADF]="Bad file descriptor.",i[r.EACCES]="Permission denied.",i[r.EBUSY]="Resource busy or locked.",i[r.EEXIST]="File exists.",i[r.ENOTDIR]="File is not a directory.",i[r.EISDIR]="File is a directory.",i[r.EINVAL]="Invalid argument.",i[r.EFBIG]="File is too big.",i[r.ENOSPC]="No space left on disk.",i[r.EROFS]="Cannot modify a read-only file system.",i[r.ENOTEMPTY]="Directory is not empty.",i[r.ENOTSUP]="Operation is not supported.",e.ErrorStrings=i});
//# sourceMappingURL=sourcemaps/error-strings.js.map
