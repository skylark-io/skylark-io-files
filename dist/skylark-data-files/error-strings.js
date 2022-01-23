/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./files","./error-codes"],function(e,i){"use strict";const r={};return r[i.EPERM]="Operation not permitted.",r[i.ENOENT]="No such file or directory.",r[i.EIO]="Input/output error.",r[i.EBADF]="Bad file descriptor.",r[i.EACCES]="Permission denied.",r[i.EBUSY]="Resource busy or locked.",r[i.EEXIST]="File exists.",r[i.ENOTDIR]="File is not a directory.",r[i.EISDIR]="File is a directory.",r[i.EINVAL]="Invalid argument.",r[i.EFBIG]="File is too big.",r[i.ENOSPC]="No space left on disk.",r[i.EROFS]="Cannot modify a read-only file system.",r[i.ENOTEMPTY]="Directory is not empty.",r[i.ENOTSUP]="Operation is not supported.",e.ErrorStrings=r});
//# sourceMappingURL=sourcemaps/error-strings.js.map
