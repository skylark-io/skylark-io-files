define([
    "skylark-langx-funcs/defer",
    "skylark-langx-async",
    "skylark-langx-paths",
    "skylark-data-compression/inflate-raw",
    "../../inodes/dir-inode",
    "../../inodes/file-inode",    
    "../../inodes/file-index",    
    '../../no-sync-file',
    "../synchronous-provider",
    '../../error-codes',
    '../../file-error',
    '../../action-type',
    '../../stats',
    '../../file-type',
    '../core/global',
    '../core/util',
    "./extended_ascii",
    "./central-directory",
    "./compression-method",
    "./end-of-central-directory",
    "./zip-toc"
], function (
    setImmediate,
    async,
    paths,
    inflateRaw,
    DirInode,
    FileInode,
    FIleIndex,
    NoSyncFile, 
    BaseProvider, 
    ErrorCodes, 
    FileError,
    ActionType, 
    Stats,
    FileType, 
    global, 
    util,
    ExtendedASCII,
    CentralDirectory,
    CompressionMethod,
    EndOfCentralDirectory,
    ZipTOC
) {

    const { arrayish2Buffer, copyingSlice, bufferValidator }  = util;


    /*
       4.3.6 Overall .ZIP file format:

          [local file header 1]
          [encryption header 1]
          [file data 1]
          [data descriptor 1]
          .
          .
          .
          [local file header n]
          [encryption header n]
          [file data n]
          [data descriptor n]
          [archive decryption header]
          [archive extra data record]
          [central directory header 1]
          .
          .
          .
          [central directory header n]
          [zip64 end of central directory record]
          [zip64 end of central directory locator]
          [end of central directory record]
    */



    /**
     * Zip file-backed filesystem
     * Implemented according to the standard:
     * http://www.pkware.com/documents/casestudies/APPNOTE.TXT
     *
     * While there are a few zip libraries for JavaScript (e.g. JSZip and zip.js),
     * they are not a good match for BrowserFS. In particular, these libraries
     * perform a lot of unneeded data copying, and eagerly decompress every file
     * in the zip file upon loading to check the CRC32. They also eagerly decode
     * strings. Furthermore, these libraries duplicate functionality already present
     * in BrowserFS (e.g. UTF-8 decoding and binary data manipulation).
     *
     * This filesystem takes advantage of BrowserFS's Buffer implementation, which
     * efficiently represents the zip file in memory (in both ArrayBuffer-enabled
     * browsers *and* non-ArrayBuffer browsers), and which can neatly be 'sliced'
     * without copying data. Each struct defined in the standard is represented with
     * a buffer slice pointing to an offset in the zip file, and has getters for
     * each field. As we anticipate that this data will not be read often, we choose
     * not to store each struct field in the JavaScript object; instead, to reduce
     * memory consumption, we retrieve it directly from the binary data each time it
     * is requested.
     *
     * When the filesystem is instantiated, we determine the directory structure
     * of the zip file as quickly as possible. We lazily decompress and check the
     * CRC32 of files. We do not cache decompressed files; if this is a desired
     * feature, it is best implemented as a generic file system wrapper that can
     * cache data from arbitrary file systems.
     *
     * For inflation, we use `pako`'s implementation:
     * https://github.com/nodeca/pako
     *
     * Current limitations:
     * * No encryption.
     * * No ZIP64 support.
     * * Read-only.
     *   Write support would require that we:
     *   - Keep track of changed/new files.
     *   - Compress changed files, and generate appropriate metadata for each.
     *   - Update file offsets for other files in the zip file.
     *   - Stream it out to a location.
     *   This isn't that bad, so we might do this at a later date.
     */
    class ZipProvider extends SynchronousProvider {
        constructor(input, name = '') {
            super();
            this.name = name;
            this._index = new FileIndex();
            this._directoryEntries = [];
            this._eocd = null;
            this._index = input.index;
            this._directoryEntries = input.directoryEntries;
            this._eocd = input.eocd;
            this.data = input.data;
        }
        /**
         * Constructs a ZipProvider instance with the given options.
         */
        static Create(opts, cb) {
            try {
                ZipProvider._computeIndex(opts.zipData, (e, zipTOC) => {
                    if (zipTOC) {
                        const fs = new ZipProvider(zipTOC, opts.name);
                        cb(null, fs);
                    }
                    else {
                        cb(e);
                    }
                });
            }
            catch (e) {
                cb(e);
            }
        }
        static isAvailable() { return true; }

        /**
         * Locates the end of central directory record at the end of the file.
         * Throws an exception if it cannot be found.
         */
        static _getEOCD(data) {
            // Unfortunately, the comment is variable size and up to 64K in size.
            // We assume that the magic signature does not appear in the comment, and
            // in the bytes between the comment and the signature. Other ZIP
            // implementations make this same assumption, since the alternative is to
            // read thread every entry in the file to get to it. :(
            // These are *negative* offsets from the end of the file.
            const startOffset = 22;
            const endOffset = Math.min(startOffset + 0xFFFF, data.length - 1);
            // There's not even a byte alignment guarantee on the comment so we need to
            // search byte by byte. *grumble grumble*
            for (let i = startOffset; i < endOffset; i++) {
                // Magic number: EOCD Signature
                if (data.readUInt32LE(data.length - i) === 0x06054b50) {
                    return new EndOfCentralDirectory(data.slice(data.length - i));
                }
            }
            throw new FileError(ErrorCodes.EINVAL, "Invalid ZIP file: Could not locate End of Central Directory signature.");
        }
        static _addToIndex(cd, index) {
            // Paths must be absolute, yet zip file paths are always relative to the
            // zip root. So we append '/' and call it a day.
            let filename = cd.fileName();
            if (filename.charAt(0) === '/') {
                throw new FileError(ErrorCodes.EPERM, `Unexpectedly encountered an absolute path in a zip file. Please file a bug.`);
            }
            // XXX: For the file index, strip the trailing '/'.
            if (filename.charAt(filename.length - 1) === '/') {
                filename = filename.substr(0, filename.length - 1);
            }
            if (cd.isDirectory()) {
                index.addPathFast('/' + filename, new DirInode(cd));
            }
            else {
                index.addPathFast('/' + filename, new FileInode(cd));
            }
        }
        static _computeIndex(data, cb) {
            try {
                const index = new FileIndex();
                const eocd = ZipProvider._getEOCD(data);
                if (eocd.diskNumber() !== eocd.cdDiskNumber()) {
                    return cb(new FileError(ErrorCodes.EINVAL, "ZipProvider does not support spanned zip files."));
                }
                const cdPtr = eocd.cdOffset();
                if (cdPtr === 0xFFFFFFFF) {
                    return cb(new FileError(ErrorCodes.EINVAL, "ZipProvider does not support Zip64."));
                }
                const cdEnd = cdPtr + eocd.cdSize();
                ZipProvider._computeIndexResponsive(data, index, cdPtr, cdEnd, cb, [], eocd);
            }
            catch (e) {
                cb(e);
            }
        }
        static _computeIndexResponsiveTrampoline(data, index, cdPtr, cdEnd, cb, cdEntries, eocd) {
            try {
                ZipProvider._computeIndexResponsive(data, index, cdPtr, cdEnd, cb, cdEntries, eocd);
            }
            catch (e) {
                cb(e);
            }
        }
        static _computeIndexResponsive(data, index, cdPtr, cdEnd, cb, cdEntries, eocd) {
            if (cdPtr < cdEnd) {
                let count = 0;
                while (count++ < 200 && cdPtr < cdEnd) {
                    const cd = new CentralDirectory(data, data.slice(cdPtr));
                    ZipProvider._addToIndex(cd, index);
                    cdPtr += cd.totalSize();
                    cdEntries.push(cd);
                }
                setImmediate(() => {
                    ZipProvider._computeIndexResponsiveTrampoline(data, index, cdPtr, cdEnd, cb, cdEntries, eocd);
                });
            }
            else {
                cb(null, new ZipTOC(index, cdEntries, eocd, data));
            }
        }
        getName() {
            return ZipProvider.Name + (this.name !== '' ? ` ${this.name}` : '');
        }
        /**
         * Get the CentralDirectory object for the given path.
         */
        getCentralDirectoryEntry(path) {
            const inode = this._index.getInode(path);
            if (inode === null) {
                throw FileError.ENOENT(path);
            }
            if (FileInode.isFileInode(inode)) {
                return inode.getData();
            }
            else if (DirInode.isDirInode(inode)) {
                return inode.getData();
            }
            else {
                // Should never occur.
                throw FileError.EPERM(`Invalid inode: ${inode}`);
            }
        }
        getCentralDirectoryEntryAt(index) {
            const dirEntry = this._directoryEntries[index];
            if (!dirEntry) {
                throw new RangeError(`Invalid directory index: ${index}.`);
            }
            return dirEntry;
        }
        getNumberOfCentralDirectoryEntries() {
            return this._directoryEntries.length;
        }
        getEndOfCentralDirectory() {
            return this._eocd;
        }
        diskSpace(path, cb) {
            // Read-only file system.
            cb(this.data.length, 0);
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
        statSync(path, isLstat) {
            const inode = this._index.getInode(path);
            if (inode === null) {
                throw FileError.ENOENT(path);
            }
            let stats;
            if (FileInode.isFileInode(inode)) {
                stats = inode.getData().getStats();
            }
            else if (DirInode.isDirInode(inode)) {
                stats = inode.getStats();
            }
            else {
                throw new FileError(ErrorCodes.EINVAL, "Invalid inode.");
            }
            return stats;
        }
        openSync(path, flags, mode) {
            // INVARIANT: Cannot write to RO file systems.
            if (flags.isWriteable()) {
                throw new FileError(ErrorCodes.EPERM, path);
            }
            // Check if the path exists, and is a file.
            const inode = this._index.getInode(path);
            if (!inode) {
                throw FileError.ENOENT(path);
            }
            else if (FileInode.isFileInode(inode)) {
                const cdRecord = inode.getData();
                const stats = cdRecord.getStats();
                switch (flags.pathExistsAction()) {
                    case ActionType.THROW_EXCEPTION:
                    case ActionType.TRUNCATE_FILE:
                        throw FileError.EEXIST(path);
                    case ActionType.NOP:
                        return new NoSyncFile(this, path, flags, stats, cdRecord.getData());
                    default:
                        throw new FileError(ErrorCodes.EINVAL, 'Invalid FileMode object.');
                }
            }
            else {
                throw FileError.EISDIR(path);
            }
        }
        readdirSync(path) {
            // Check if it exists.
            const inode = this._index.getInode(path);
            if (!inode) {
                throw FileError.ENOENT(path);
            }
            else if (DirInode.isDirInode(inode)) {
                return inode.getListing();
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
    }
    
    ZipProvider.Name = "ZipProvider";
    ZipProvider.Options = {
        zipData: {
            type: "object",
            description: "The zip file as a Buffer object.",
            validator: bufferValidator
        },
        name: {
            type: "string",
            optional: true,
            description: "The name of the zip file (optional)."
        }
    };
    ZipProvider.CompressionMethod = CompressionMethod;
    ZipProvider.RegisterDecompressionMethod(CompressionMethod.DEFLATE, (data, compressedSize, uncompressedSize) => {
        return arrayish2Buffer(inflateRaw(data.slice(0, compressedSize), { chunkSize: uncompressedSize }));
    });
    ZipProvider.RegisterDecompressionMethod(CompressionMethod.STORED, (data, compressedSize, uncompressedSize) => {
        return copyingSlice(data, 0, uncompressedSize);
    });

    return ZipProvider;

});