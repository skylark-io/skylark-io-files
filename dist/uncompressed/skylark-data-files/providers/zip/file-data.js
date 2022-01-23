define([
    '../../error-codes',
    '../../file-error',
    "./compression-method",
], function (ErrorCodes, FileError,CompressionMethod) {
    'use strict';

    /**
     * Maps CompressionMethod => function that decompresses.
     * @hidden
     */
    const decompressionMethods = {};

    /**
     * 4.3.8  File data
     *
     *   Immediately following the local header for a file
     *   SHOULD be placed the compressed or stored data for the file.
     *   If the file is encrypted, the encryption header for the file
     *   SHOULD be placed after the local header and before the file
     *   data. The series of [local file header][encryption header]
     *   [file data][data descriptor] repeats for each file in the
     *   .ZIP archive.
     *
     *   Zero-byte files, directories, and other file types that
     *   contain no content MUST not include file data.
     */
    class FileData {
        constructor(header, record, data) {
            this.header = header;
            this.record = record;
            this.data = data;
        }
        decompress() {
            // Check the compression
            const compressionMethod = this.header.compressionMethod();
            const fcn = decompressionMethods[compressionMethod];
            if (fcn) {
                return fcn(this.data, this.record.compressedSize(), this.record.uncompressedSize(), this.record.flag());
            }
            else {
                let name = CompressionMethod[compressionMethod];
                if (!name) {
                    name = `Unknown: ${compressionMethod}`;
                }
                throw new FileError(ErrorCodes.EINVAL, `Invalid compression method on file '${this.header.fileName()}': ${name}`);
            }
        }
        getHeader() {
            return this.header;
        }
        getRecord() {
            return this.record;
        }
        getRawData() {
            return this.data;
        }
        static RegisterDecompressionMethod(m, fcn) {
            decompressionMethods[m] = fcn;
        }
    }


    return FileData;

});