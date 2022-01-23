define([
], function () {
    'use strict';


    /**
     * @hidden
     */
    class DirectoryRecord {
        constructor(data, rockRidgeOffset) {
            this._suEntries = null;
            this._fileOrDir = null;
            this._data = data;
            this._rockRidgeOffset = rockRidgeOffset;
        }
        hasRockRidge() {
            return this._rockRidgeOffset > -1;
        }
        getRockRidgeOffset() {
            return this._rockRidgeOffset;
        }
        /**
         * !!ONLY VALID ON ROOT NODE!!
         * Checks if Rock Ridge is enabled, and sets the offset.
         */
        rootCheckForRockRidge(isoData) {
            const dir = this.getDirectory(isoData);
            this._rockRidgeOffset = dir.getDotEntry(isoData)._getRockRidgeOffset(isoData);
            if (this._rockRidgeOffset > -1) {
                // Wipe out directory. Start over with RR knowledge.
                this._fileOrDir = null;
            }
        }
        length() {
            return this._data[0];
        }
        extendedAttributeRecordLength() {
            return this._data[1];
        }
        lba() {
            return this._data.readUInt32LE(2) * 2048;
        }
        dataLength() {
            return this._data.readUInt32LE(10);
        }
        recordingDate() {
            return getShortFormDate(this._data, 18);
        }
        fileFlags() {
            return this._data[25];
        }
        fileUnitSize() {
            return this._data[26];
        }
        interleaveGapSize() {
            return this._data[27];
        }
        volumeSequenceNumber() {
            return this._data.readUInt16LE(28);
        }
        identifier() {
            return this._getString(33, this._data[32]);
        }
        fileName(isoData) {
            if (this.hasRockRidge()) {
                const fn = this._rockRidgeFilename(isoData);
                if (fn !== null) {
                    return fn;
                }
            }
            const ident = this.identifier();
            if (this.isDirectory(isoData)) {
                return ident;
            }
            // Files:
            // - MUST have 0x2E (.) separating the name from the extension
            // - MUST have 0x3B (;) separating the file name and extension from the version
            // Gets expanded to two-byte char in Unicode directory records.
            const versionSeparator = ident.indexOf(';');
            if (versionSeparator === -1) {
                // Some Joliet filenames lack the version separator, despite the standard
                // specifying that it should be there.
                return ident;
            }
            else if (ident[versionSeparator - 1] === '.') {
                // Empty extension. Do not include '.' in the filename.
                return ident.slice(0, versionSeparator - 1);
            }
            else {
                // Include up to version separator.
                return ident.slice(0, versionSeparator);
            }
        }
        isDirectory(isoData) {
            let rv = !!(this.fileFlags() & 2 /* Directory */);
            // If it lacks the Directory flag, it may still be a directory if we've exceeded the directory
            // depth limit. Rock Ridge marks these as files and adds a special attribute.
            if (!rv && this.hasRockRidge()) {
                rv = this.getSUEntries(isoData).filter((e) => e instanceof CLEntry).length > 0;
            }
            return rv;
        }
        isSymlink(isoData) {
            return this.hasRockRidge() && this.getSUEntries(isoData).filter((e) => e instanceof SLEntry).length > 0;
        }
        getSymlinkPath(isoData) {
            let p = "";
            const entries = this.getSUEntries(isoData);
            const getStr = this._getGetString();
            for (const entry of entries) {
                if (entry instanceof SLEntry) {
                    const components = entry.componentRecords();
                    for (const component of components) {
                        const flags = component.flags();
                        if (flags & 2 /* CURRENT */) {
                            p += "./";
                        }
                        else if (flags & 4 /* PARENT */) {
                            p += "../";
                        }
                        else if (flags & 8 /* ROOT */) {
                            p += "/";
                        }
                        else {
                            p += component.content(getStr);
                            if (!(flags & 1 /* CONTINUE */)) {
                                p += '/';
                            }
                        }
                    }
                    if (!entry.continueFlag()) {
                        // We are done with this link.
                        break;
                    }
                }
            }
            if (p.length > 1 && p[p.length - 1] === '/') {
                // Trim trailing '/'.
                return p.slice(0, p.length - 1);
            }
            else {
                return p;
            }
        }
        getFile(isoData) {
            if (this.isDirectory(isoData)) {
                throw new Error(`Tried to get a File from a directory.`);
            }
            if (this._fileOrDir === null) {
                this._fileOrDir = isoData.slice(this.lba(), this.lba() + this.dataLength());
            }
            return this._fileOrDir;
        }
        getDirectory(isoData) {
            if (!this.isDirectory(isoData)) {
                throw new Error(`Tried to get a Directory from a file.`);
            }
            if (this._fileOrDir === null) {
                this._fileOrDir = this._constructDirectory(isoData);
            }
            return this._fileOrDir;
        }
        getSUEntries(isoData) {
            if (!this._suEntries) {
                this._constructSUEntries(isoData);
            }
            return this._suEntries;
        }
        _rockRidgeFilename(isoData) {
            const nmEntries = this.getSUEntries(isoData).filter((e) => e instanceof NMEntry);
            if (nmEntries.length === 0 || nmEntries[0].flags() & (2 /* CURRENT */ | 4 /* PARENT */)) {
                return null;
            }
            let str = '';
            const getString = this._getGetString();
            for (const e of nmEntries) {
                str += e.name(getString);
                if (!(e.flags() & 1 /* CONTINUE */)) {
                    break;
                }
            }
            return str;
        }
        _constructSUEntries(isoData) {
            let i = 33 + this._data[32];
            if (i % 2 === 1) {
                // Skip padding field.
                i++;
            }
            i += this._rockRidgeOffset;
            this._suEntries = constructSystemUseEntries(this._data, i, this.length(), isoData);
        }
        /**
         * !!ONLY VALID ON FIRST ENTRY OF ROOT DIRECTORY!!
         * Returns -1 if rock ridge is not enabled. Otherwise, returns the offset
         * at which system use fields begin.
         */
        _getRockRidgeOffset(isoData) {
            // In the worst case, we get some garbage SU entries.
            // Fudge offset to 0 before proceeding.
            this._rockRidgeOffset = 0;
            const suEntries = this.getSUEntries(isoData);
            if (suEntries.length > 0) {
                const spEntry = suEntries[0];
                if (spEntry instanceof SPEntry && spEntry.checkBytesPass()) {
                    // SUSP is in use.
                    for (let i = 1; i < suEntries.length; i++) {
                        const entry = suEntries[i];
                        if (entry instanceof RREntry || (entry instanceof EREntry && entry.extensionIdentifier() === rockRidgeIdentifier)) {
                            // Rock Ridge is in use!
                            return spEntry.bytesSkipped();
                        }
                    }
                }
            }
            // Failed.
            this._rockRidgeOffset = -1;
            return -1;
        }
    }


    return DirectoryRecord;
});