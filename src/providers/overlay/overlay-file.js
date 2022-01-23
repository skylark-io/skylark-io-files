define([
    '../../preload-file'
], function (PreloadFile) {

    /**
     * Overlays a RO file to make it writable.
     */
    class OverlayFile extends PreloadFile {
        constructor(fs, path, flag, stats, data) {
            super(fs, path, flag, stats, data);
        }
        sync(cb) {
            if (!this.isDirty()) {
                cb(null);
                return;
            }
            this._fs._syncAsync(this, (err) => {
                this.resetDirty();
                cb(err);
            });
        }
        syncSync() {
            if (this.isDirty()) {
                this._fs._syncSync(this);
                this.resetDirty();
            }
        }
        close(cb) {
            this.sync(cb);
        }
        closeSync() {
            this.syncSync();
        }
    }


    return OverlayFile;
});