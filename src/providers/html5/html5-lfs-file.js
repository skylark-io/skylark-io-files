define([
    "../../utils",
    '../../preload-file'
], function (utils,PreloadFile) {
    'use strict';

    const { buffer2ArrayBuffer, arrayBuffer2Buffer } = utils;

    // A note about getFile and getDirectory options:
    // These methods are called at numerous places in this file, and are passed
    // some combination of these two options:
    //   - create: If true, the entry will be created if it doesn't exist.
    //             If false, an error will be thrown if it doesn't exist.
    //   - exclusive: If true, only create the entry if it doesn't already exist,
    //                and throw an error if it does.
    class Html5LfsFile extends PreloadFile {
        constructor(fs, entry, path, flag, stat, contents) {
            super(fs, path, flag, stat, contents);
            this._entry = entry;
        }
        sync(cb) {
            if (!this.isDirty()) {
                return cb();
            }
            this._entry.createWriter((writer) => {
                const buffer = this.getBuffer();
                const blob = new Blob([buffer2ArrayBuffer(buffer)]);
                const length = blob.size;
                writer.onwriteend = (err) => {
                    writer.onwriteend = null;
                    writer.onerror = null;
                    writer.truncate(length);
                    this.resetDirty();
                    cb();
                };
                writer.onerror = (err) => {
                    cb(convertError(err, this.getPath(), false));
                };
                writer.write(blob);
            });
        }
        close(cb) {
            this.sync(cb);
        }
    }


    return Html5LfsFile;
});