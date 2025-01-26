define([
    '../../error-codes',
    '../../file-error',
    "./msdos2date",
    "./safe-to-string"
], function (ErrorCodes, FileError,msdos2date,safeToString) {
    'use strict';

    /**
     * 4.3.7  Local file header:
     *
     *     local file header signature     4 bytes  (0x04034b50)
     *     version needed to extract       2 bytes
     *     general purpose bit flag        2 bytes
     *     compression method              2 bytes
     *    last mod file time              2 bytes
     *    last mod file date              2 bytes
     *    crc-32                          4 bytes
     *    compressed size                 4 bytes
     *    uncompressed size               4 bytes
     *    file name length                2 bytes
     *    extra field length              2 bytes
     *
     *    file name (variable size)
     *    extra field (variable size)
     */
    class FileHeader {
        constructor(data) {
            this.data = data;
            if (data.readUInt32LE(0) !== 0x04034b50) {
                throw new FileError(ErrorCodes.EINVAL, "Invalid Zip file: Local file header has invalid signature: " + this.data.readUInt32LE(0));
            }
        }
        versionNeeded() { return this.data.readUInt16LE(4); }
        flags() { return this.data.readUInt16LE(6); }
        compressionMethod() { return this.data.readUInt16LE(8); }
        lastModFileTime() {
            // Time and date is in MS-DOS format.
            return msdos2date(this.data.readUInt16LE(10), this.data.readUInt16LE(12));
        }
        rawLastModFileTime() {
            return this.data.readUInt32LE(10);
        }
        crc32() { return this.data.readUInt32LE(14); }
        /**
         * These two values are COMPLETELY USELESS.
         *
         * Section 4.4.9:
         *   If bit 3 of the general purpose bit flag is set,
         *   these fields are set to zero in the local header and the
         *   correct values are put in the data descriptor and
         *   in the central directory.
         *
         * So we'll just use the central directory's values.
         */
        // public compressedSize(): number { return this.data.readUInt32LE(18); }
        // public uncompressedSize(): number { return this.data.readUInt32LE(22); }
        fileNameLength() { return this.data.readUInt16LE(26); }
        extraFieldLength() { return this.data.readUInt16LE(28); }
        fileName() {
            return safeToString(this.data, this.useUTF8(), 30, this.fileNameLength());
        }
        extraField() {
            const start = 30 + this.fileNameLength();
            return this.data.slice(start, start + this.extraFieldLength());
        }
        totalSize() { return 30 + this.fileNameLength() + this.extraFieldLength(); }
        useUTF8() { return (this.flags() & 0x800) === 0x800; }
    }


    return FileHeader;

});