define([
  "./files"
],function (files) {
  'use strict';

  /**
   * Standard libc error codes. Add more to this enum and ErrorStrings as they are
   * needed.
   * @url http://www.gnu.org/software/libc/manual/html_node/Error-Codes.html
   */
  var ErrorCodes;
  (function (ErrorCodes) {
      ErrorCodes[ErrorCodes["EPERM"] = 1] = "EPERM";
      ErrorCodes[ErrorCodes["ENOENT"] = 2] = "ENOENT";
      ErrorCodes[ErrorCodes["EIO"] = 5] = "EIO";
      ErrorCodes[ErrorCodes["EBADF"] = 9] = "EBADF";
      ErrorCodes[ErrorCodes["EACCES"] = 13] = "EACCES";
      ErrorCodes[ErrorCodes["EBUSY"] = 16] = "EBUSY";
      ErrorCodes[ErrorCodes["EEXIST"] = 17] = "EEXIST";
      ErrorCodes[ErrorCodes["ENOTDIR"] = 20] = "ENOTDIR";
      ErrorCodes[ErrorCodes["EISDIR"] = 21] = "EISDIR";
      ErrorCodes[ErrorCodes["EINVAL"] = 22] = "EINVAL";
      ErrorCodes[ErrorCodes["EFBIG"] = 27] = "EFBIG";
      ErrorCodes[ErrorCodes["ENOSPC"] = 28] = "ENOSPC";
      ErrorCodes[ErrorCodes["EROFS"] = 30] = "EROFS";
      ErrorCodes[ErrorCodes["ENOTEMPTY"] = 39] = "ENOTEMPTY";
      ErrorCodes[ErrorCodes["ENOTSUP"] = 95] = "ENOTSUP";
  })(ErrorCodes || (ErrorCodes = {}));

  return files.ErrorCodes = ErrorCodes;
});
  