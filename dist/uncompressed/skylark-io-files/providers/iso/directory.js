define([
], function () {
    'use strict';

    /**
     * @hidden
     */
    class Directory {
        constructor(record, isoData) {
            this._fileList = [];
            this._fileMap = {};
            this._record = record;
            let i = record.lba();
            let iLimit = i + record.dataLength();
            if (!(record.fileFlags() & 2 /* Directory */)) {
                // Must have a CL entry.
                const cl = record.getSUEntries(isoData).filter((e) => e instanceof CLEntry)[0];
                i = cl.childDirectoryLba() * 2048;
                iLimit = Infinity;
            }
            while (i < iLimit) {
                const len = isoData[i];
                // Zero-padding between sectors.
                // TODO: Could optimize this to seek to nearest-sector upon
                // seeing a 0.
                if (len === 0) {
                    i++;
                    continue;
                }
                const r = this._constructDirectoryRecord(isoData.slice(i));
                const fname = r.fileName(isoData);
                // Skip '.' and '..' entries.
                if (fname !== '\u0000' && fname !== '\u0001') {
                    // Skip relocated entries.
                    if (!r.hasRockRidge() || r.getSUEntries(isoData).filter((e) => e instanceof REEntry).length === 0) {
                        this._fileMap[fname] = r;
                        this._fileList.push(fname);
                    }
                }
                else if (iLimit === Infinity) {
                    // First entry contains needed data.
                    iLimit = i + r.dataLength();
                }
                i += r.length();
            }
        }
        /**
         * Get the record with the given name.
         * Returns undefined if not present.
         */
        getRecord(name) {
            return this._fileMap[name];
        }
        getFileList() {
            return this._fileList;
        }
        getDotEntry(isoData) {
            return this._constructDirectoryRecord(isoData.slice(this._record.lba()));
        }
    }

    return Directory;
});