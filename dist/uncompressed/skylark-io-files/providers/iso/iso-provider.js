define([
    "skylark-langx-paths",
    '../synchronous-provider',
    "../../no-sync-file",
    '../../stats',
    '../../file-type',
    '../../action-type',
    '../../file-error',
    '../../error-codes',
    '../../utils'
], function (paths,SynchronousProvider,NoSyncFile, Stats,FileType, ActionType,FileError, ErrorCodes, utils) {

    'use strict';

    const { copyingSlice, bufferValidator }  = utils;



    /**
     * Mounts an ISO file as a read-only file system.
     *
     * Supports:
     * * Vanilla ISO9660 ISOs
     * * Microsoft Joliet and Rock Ridge extensions to the ISO9660 standard
     */
    class IsoProvider extends SynchronousProvider {
        /**
         * **Deprecated. Please use IsoProvider.Create() method instead.**
         *
         * Constructs a read-only file system from the given ISO.
         * @param data The ISO file in a buffer.
         * @param name The name of the ISO (optional; used for debug messages / identification via getName()).
         */
        constructor(data, name = "") {
            super();
            this._data = data;
            // Skip first 16 sectors.
            let vdTerminatorFound = false;
            let i = 16 * 2048;
            const candidateVDs = new Array();
            while (!vdTerminatorFound) {
                const slice = data.slice(i);
                const vd = new VolumeDescriptor(slice);
                switch (vd.type()) {
                    case 1 /* PrimaryVolumeDescriptor */:
                        candidateVDs.push(new PrimaryVolumeDescriptor(slice));
                        break;
                    case 2 /* SupplementaryVolumeDescriptor */:
                        candidateVDs.push(new SupplementaryVolumeDescriptor(slice));
                        break;
                    case 255 /* VolumeDescriptorSetTerminator */:
                        vdTerminatorFound = true;
                        break;
                }
                i += 2048;
            }
            if (candidateVDs.length === 0) {
                throw new FileError(ErrorCodes.EIO, `Unable to find a suitable volume descriptor.`);
            }
            candidateVDs.forEach((v) => {
                // Take an SVD over a PVD.
                if (!this._pvd || this._pvd.type() !== 2 /* SupplementaryVolumeDescriptor */) {
                    this._pvd = v;
                }
            });
            this._root = this._pvd.rootDirectoryEntry(data);
            this._name = name;
        }
        /**
         * Creates an IsoProvider instance with the given options.
         */
        static Create(opts, cb) {
            try {
                cb(null, new IsoProvider(opts.data, opts.name));
            }
            catch (e) {
                cb(e);
            }
        }
        static isAvailable() {
            return true;
        }
        getName() {
            let name = `IsoProvider${this._name}${this._pvd ? `-${this._pvd.name()}` : ''}`;
            if (this._root && this._root.hasRockRidge()) {
                name += `-RockRidge`;
            }
            return name;
        }
        diskSpace(path, cb) {
            // Read-only file system.
            cb(this._data.length, 0);
        }
        isReadOnly() {
            return true;
        }
        supportsLinks() {
            return false;
        }
        supportsProps() {
            return false;
        }
        supportsSynch() {
            return true;
        }
        statSync(p, isLstat) {
            const record = this._getDirectoryRecord(p);
            if (record === null) {
                throw FileError.ENOENT(p);
            }
            return this._getStats(p, record);
        }
        openSync(p, flags, mode) {
            // INVARIANT: Cannot write to RO file systems.
            if (flags.isWriteable()) {
                throw new FileError(ErrorCodes.EPERM, p);
            }
            // Check if the path exists, and is a file.
            const record = this._getDirectoryRecord(p);
            if (!record) {
                throw FileError.ENOENT(p);
            }
            else if (record.isSymlink(this._data)) {
                return this.openSync(paths.resolve(p, record.getSymlinkPath(this._data)), flags, mode);
            }
            else if (!record.isDirectory(this._data)) {
                const data = record.getFile(this._data);
                const stats = this._getStats(p, record);
                switch (flags.pathExistsAction()) {
                    case ActionType.THROW_EXCEPTION:
                    case ActionType.TRUNCATE_FILE:
                        throw FileError.EEXIST(p);
                    case ActionType.NOP:
                        return new NoSyncFile(this, p, flags, stats, data);
                    default:
                        throw new FileError(ErrorCodes.EINVAL, 'Invalid FileMode object.');
                }
            }
            else {
                throw FileError.EISDIR(p);
            }
        }
        readdirSync(path) {
            // Check if it exists.
            const record = this._getDirectoryRecord(path);
            if (!record) {
                throw FileError.ENOENT(path);
            }
            else if (record.isDirectory(this._data)) {
                return record.getDirectory(this._data).getFileList().slice(0);
            }
            else {
                throw FileError.ENOTDIR(path);
            }
        }
        /**
         * Specially-optimized readfile.
         */
        readFileSync(fname, encoding, flag) {
            // Get file.
            const fd = this.openSync(fname, flag, 0x1a4);
            try {
                const fdCast = fd;
                const fdBuff = fdCast.getBuffer();
                if (encoding === null) {
                    return copyingSlice(fdBuff);
                }
                return fdBuff.toString(encoding);
            }
            finally {
                fd.closeSync();
            }
        }
        _getDirectoryRecord(path) {
            // Special case.
            if (path === '/') {
                return this._root;
            }
            const components = path.split('/').slice(1);
            let dir = this._root;
            for (const component of components) {
                if (dir.isDirectory(this._data)) {
                    dir = dir.getDirectory(this._data).getRecord(component);
                    if (!dir) {
                        return null;
                    }
                }
                else {
                    return null;
                }
            }
            return dir;
        }
        _getStats(p, record) {
            if (record.isSymlink(this._data)) {
                const newP = paths.resolve(p, record.getSymlinkPath(this._data));
                const dirRec = this._getDirectoryRecord(newP);
                if (!dirRec) {
                    return null;
                }
                return this._getStats(newP, dirRec);
            }
            else {
                const len = record.dataLength();
                let mode = 0x16D;
                const date = record.recordingDate().getTime();
                let atime = date;
                let mtime = date;
                let ctime = date;
                if (record.hasRockRidge()) {
                    const entries = record.getSUEntries(this._data);
                    for (const entry of entries) {
                        if (entry instanceof PXEntry) {
                            mode = entry.mode();
                        }
                        else if (entry instanceof TFEntry) {
                            const flags = entry.flags();
                            if (flags & 4 /* ACCESS */) {
                                atime = entry.access().getTime();
                            }
                            if (flags & 2 /* MODIFY */) {
                                mtime = entry.modify().getTime();
                            }
                            if (flags & 1 /* CREATION */) {
                                ctime = entry.creation().getTime();
                            }
                        }
                    }
                }
                // Mask out writeable flags. This is a RO file system.
                mode = mode & 0x16D;
                return new Stats(record.isDirectory(this._data) ? FileType.DIRECTORY : FileType.FILE, len, mode, atime, mtime, ctime);
            }
        }
    }
    IsoProvider.Name = "Iso";
    IsoProvider.Options = {
        data: {
            type: "object",
            description: "The ISO file in a buffer",
            validator: bufferValidator
        }
    };


    return IsoProvider;
});