define([
    "./files",
    './error-codes',
    "./file-error"
], function (files,ErrorCodes, FileError) {
    'use strict';

    /**
     * Base class that contains shared implementations of functions for the file
     * object.
     */
    class BaseFile {
        sync(cb) {
            cb(new FileError(ErrorCodes.ENOTSUP));
        }
        syncSync() {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        datasync(cb) {
            this.sync(cb);
        }
        datasyncSync() {
            return this.syncSync();
        }
        chown(uid, gid, cb) {
            cb(new FileError(ErrorCodes.ENOTSUP));
        }
        chownSync(uid, gid) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        chmod(mode, cb) {
            cb(new FileError(ErrorCodes.ENOTSUP));
        }
        chmodSync(mode) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        utimes(atime, mtime, cb) {
            cb(new FileError(ErrorCodes.ENOTSUP));
        }
        utimesSync(atime, mtime) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
    }
    return files.BaseFile = BaseFile;
});