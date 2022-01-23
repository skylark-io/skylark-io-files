define([
    '../../error-codes',
    '../../file-error',
    '../../stats',
    "./msdos2date",
    "./safe-to-string",
    "./file-header",
    "./file-data"
], function (ErrorCodes, FileError, Stats, msdos2date,safeToString,FileHeader,FileData) {
    'use strict';



    /**
     * 4.3.12  Central directory structure:
     *
     *  central file header signature   4 bytes  (0x02014b50)
     *  version made by                 2 bytes
     *  version needed to extract       2 bytes
     *  general purpose bit flag        2 bytes
     *  compression method              2 bytes
     *  last mod file time              2 bytes
     *  last mod file date              2 bytes
     *  crc-32                          4 bytes
     *  compressed size                 4 bytes
     *  uncompressed size               4 bytes
     *  file name length                2 bytes
     *  extra field length              2 bytes
     *  file comment length             2 bytes
     *  disk number start               2 bytes
     *  internal file attributes        2 bytes
     *  external file attributes        4 bytes
     *  relative offset of local header 4 bytes
     *
     *  file name (variable size)
     *  extra field (variable size)
     *  file comment (variable size)
     */
    class CentralDirectory {
        constructor(zipData, data) {
            this.zipData = zipData;
            this.data = data;
            // Sanity check.
            if (this.data.readUInt32LE(0) !== 0x02014b50) {
                throw new FileError(ErrorCodes.EINVAL, `Invalid Zip file: Central directory record has invalid signature: ${this.data.readUInt32LE(0)}`);
            }
            this._filename = this.produceFilename();
        }
        versionMadeBy() { return this.data.readUInt16LE(4); }
        versionNeeded() { return this.data.readUInt16LE(6); }
        flag() { return this.data.readUInt16LE(8); }
        compressionMethod() { return this.data.readUInt16LE(10); }
        lastModFileTime() {
            // Time and date is in MS-DOS format.
            return msdos2date(this.data.readUInt16LE(12), this.data.readUInt16LE(14));
        }
        rawLastModFileTime() {
            return this.data.readUInt32LE(12);
        }
        crc32() { return this.data.readUInt32LE(16); }
        compressedSize() { return this.data.readUInt32LE(20); }
        uncompressedSize() { return this.data.readUInt32LE(24); }
        fileNameLength() { return this.data.readUInt16LE(28); }
        extraFieldLength() { return this.data.readUInt16LE(30); }
        fileCommentLength() { return this.data.readUInt16LE(32); }
        diskNumberStart() { return this.data.readUInt16LE(34); }
        internalAttributes() { return this.data.readUInt16LE(36); }
        externalAttributes() { return this.data.readUInt32LE(38); }
        headerRelativeOffset() { return this.data.readUInt32LE(42); }
        produceFilename() {
            /*
              4.4.17.1 claims:
              * All slashes are forward ('/') slashes.
              * Filename doesn't begin with a slash.
              * No drive letters or any nonsense like that.
              * If filename is missing, the input came from standard input.
        
              Unfortunately, this isn't true in practice. Some Windows zip utilities use
              a backslash here, but the correct Unix-style path in file headers.
        
              To avoid seeking all over the file to recover the known-good filenames
              from file headers, we simply convert '/' to '\' here.
            */
            const fileName = safeToString(this.data, this.useUTF8(), 46, this.fileNameLength());
            return fileName.replace(/\\/g, "/");
        }
        fileName() {
            return this._filename;
        }
        rawFileName() {
            return this.data.slice(46, 46 + this.fileNameLength());
        }
        extraField() {
            const start = 44 + this.fileNameLength();
            return this.data.slice(start, start + this.extraFieldLength());
        }
        fileComment() {
            const start = 46 + this.fileNameLength() + this.extraFieldLength();
            return safeToString(this.data, this.useUTF8(), start, this.fileCommentLength());
        }
        rawFileComment() {
            const start = 46 + this.fileNameLength() + this.extraFieldLength();
            return this.data.slice(start, start + this.fileCommentLength());
        }
        totalSize() {
            return 46 + this.fileNameLength() + this.extraFieldLength() + this.fileCommentLength();
        }
        isDirectory() {
            // NOTE: This assumes that the zip file implementation uses the lower byte
            //       of external attributes for DOS attributes for
            //       backwards-compatibility. This is not mandated, but appears to be
            //       commonplace.
            //       According to the spec, the layout of external attributes is
            //       platform-dependent.
            //       If that fails, we also check if the name of the file ends in '/',
            //       which is what Java's ZipFile implementation does.
            const fileName = this.fileName();
            return (this.externalAttributes() & 0x10 ? true : false) || (fileName.charAt(fileName.length - 1) === '/');
        }
        isFile() { return !this.isDirectory(); }
        useUTF8() { return (this.flag() & 0x800) === 0x800; }
        isEncrypted() { return (this.flag() & 0x1) === 0x1; }
        getFileData() {
            // Need to grab the header before we can figure out where the actual
            // compressed data starts.
            const start = this.headerRelativeOffset();
            const header = new FileHeader(this.zipData.slice(start));
            return new FileData(header, this, this.zipData.slice(start + header.totalSize()));
        }
        getData() {
            return this.getFileData().decompress();
        }
        getRawData() {
            return this.getFileData().getRawData();
        }
        getStats() {
            return new Stats(FileType.FILE, this.uncompressedSize(), 0x16D, Date.now(), this.lastModFileTime().getTime());
        }
    }


    return CentralDirectory;

});