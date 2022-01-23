define([
    "../../preload-file",
    "./special-arg-type",
    "./misc"
], function (PreloadFile,SpecialArgType,misc) {

    /**
     * Represents a remote file in a different worker/thread.
     */
    class WorkerFile extends PreloadFile {
        constructor(_fs, _path, _flag, _stat, remoteFdId, contents) {
            super(_fs, _path, _flag, _stat, contents);
            this._remoteFdId = remoteFdId;
        }
        getRemoteFdId() {
            return this._remoteFdId;
        }
        /**
         * @hidden
         */
        toRemoteArg() {
            return {
                type: SpecialArgType.FD,
                id: this._remoteFdId,
                data: misc.bufferToTransferrableObject(this.getBuffer()),
                stat: misc.bufferToTransferrableObject(this.getStats().toBuffer()),
                path: this.getPath(),
                flag: this.getFlag().getFlagString()
            };
        }
        sync(cb) {
            this._syncClose('sync', cb);
        }
        close(cb) {
            this._syncClose('close', cb);
        }
        _syncClose(type, cb) {
            if (this.isDirty()) {
                this._fs.syncClose(type, this, (e) => {
                    if (!e) {
                        this.resetDirty();
                    }
                    cb(e);
                });
            }
            else {
                cb();
            }
        }
    }


    return WorkerFile;
});