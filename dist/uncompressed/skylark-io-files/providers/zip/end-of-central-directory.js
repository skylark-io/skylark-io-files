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
     * 4.3.16: end of central directory record
     *  end of central dir signature    4 bytes  (0x06054b50)
     *  number of this disk             2 bytes
     *  number of the disk with the
     *  start of the central directory  2 bytes
     *  total number of entries in the
     *  central directory on this disk  2 bytes
     *  total number of entries in
     *  the central directory           2 bytes
     *  size of the central directory   4 bytes
     *  offset of start of central
     *  directory with respect to
     *  the starting disk number        4 bytes
     *  .ZIP file comment length        2 bytes
     *  .ZIP file comment       (variable size)
     */
    class EndOfCentralDirectory {
        constructor(data) {
            this.data = data;
            if (this.data.readUInt32LE(0) !== 0x06054b50) {
                throw new FileError(ErrorCodes.EINVAL, `Invalid Zip file: End of central directory record has invalid signature: ${this.data.readUInt32LE(0)}`);
            }
        }
        diskNumber() { return this.data.readUInt16LE(4); }
        cdDiskNumber() { return this.data.readUInt16LE(6); }
        cdDiskEntryCount() { return this.data.readUInt16LE(8); }
        cdTotalEntryCount() { return this.data.readUInt16LE(10); }
        cdSize() { return this.data.readUInt32LE(12); }
        cdOffset() { return this.data.readUInt32LE(16); }
        cdZipCommentLength() { return this.data.readUInt16LE(20); }
        cdZipComment() {
            // Assuming UTF-8. The specification doesn't specify.
            return safeToString(this.data, true, 22, this.cdZipCommentLength());
        }
        rawCdZipComment() {
            return this.data.slice(22, 22 + this.cdZipCommentLength());
        }
    }


    return EndOfCentralDirectory;

});