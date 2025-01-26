define([
  "./files",
  "./error-codes"
],function (files,ErrorCodes) {
  'use strict';

  /* tslint:disable:variable-name */
  /**
   * Strings associated with each error code.
   * @hidden
   */
  const ErrorStrings = {};
  ErrorStrings[ErrorCodes.EPERM] = 'Operation not permitted.';
  ErrorStrings[ErrorCodes.ENOENT] = 'No such file or directory.';
  ErrorStrings[ErrorCodes.EIO] = 'Input/output error.';
  ErrorStrings[ErrorCodes.EBADF] = 'Bad file descriptor.';
  ErrorStrings[ErrorCodes.EACCES] = 'Permission denied.';
  ErrorStrings[ErrorCodes.EBUSY] = 'Resource busy or locked.';
  ErrorStrings[ErrorCodes.EEXIST] = 'File exists.';
  ErrorStrings[ErrorCodes.ENOTDIR] = 'File is not a directory.';
  ErrorStrings[ErrorCodes.EISDIR] = 'File is a directory.';
  ErrorStrings[ErrorCodes.EINVAL] = 'Invalid argument.';
  ErrorStrings[ErrorCodes.EFBIG] = 'File is too big.';
  ErrorStrings[ErrorCodes.ENOSPC] = 'No space left on disk.';
  ErrorStrings[ErrorCodes.EROFS] = 'Cannot modify a read-only file system.';
  ErrorStrings[ErrorCodes.ENOTEMPTY] = 'Directory is not empty.';
  ErrorStrings[ErrorCodes.ENOTSUP] = 'Operation is not supported.';

  return files.ErrorStrings = ErrorStrings;
});
  