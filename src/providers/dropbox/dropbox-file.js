define([
    '../../preload-file'
], function (PreloadFile) {
    'use strict';

    class DropboxFile extends PreloadFile {
        constructor(_fs, _path, _flag, _stat, contents) {
            super(_fs, _path, _flag, _stat, contents);
        }
        sync(cb) {
            this._fs._syncFile(this.getPath(), this.getBuffer(), cb);
        }
        close(cb) {
            this.sync(cb);
        }
    }

    return  DropboxFile;
    
});