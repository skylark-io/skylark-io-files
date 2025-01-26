define([
    "../files",
    '../preload-file'
], function (files, PreloadFile) {
    'use strict';

    class SyncKeyValueFile extends PreloadFile {
        constructor(_fs, _path, _flag, _stat, contents) {
            super(_fs, _path, _flag, _stat, contents);
        }

        syncSync() {
            if (this.isDirty()) {
                this._fs._syncSync(this.getPath(), this.getBuffer(), this.getStats());
                this.resetDirty();
            }
        }
        
        closeSync() {
            this.syncSync();
        }
    }



    return files.providers.SyncKeyValueFile = SyncKeyValueFile;
    
});