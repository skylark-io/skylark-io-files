define([
    '../../error-codes',
    '../../file-error'
], function (ErrorCodes, FileError) {
    'use strict';

    /*
    ` 4.3.10  Archive decryption header:

          4.3.10.1 The Archive Decryption Header is introduced in version 6.2
          of the ZIP format specification.  This record exists in support
          of the Central Directory Encryption Feature implemented as part of
          the Strong Encryption Specification as described in this document.
          When the Central Directory Structure is encrypted, this decryption
          header MUST precede the encrypted data segment.
     */

    /**
     * 4.3.11  Archive extra data record:
     *
     *      archive extra data signature    4 bytes  (0x08064b50)
     *      extra field length              4 bytes
     *      extra field data                (variable size)
     *
     *    4.3.11.1 The Archive Extra Data Record is introduced in version 6.2
     *    of the ZIP format specification.  This record MAY be used in support
     *    of the Central Directory Encryption Feature implemented as part of
     *    the Strong Encryption Specification as described in this document.
     *    When present, this record MUST immediately precede the central
     *    directory data structure.
     */
    class ArchiveExtraDataRecord {
        constructor(data) {
            this.data = data;
            if (this.data.readUInt32LE(0) !== 0x08064b50) {
                throw new FileError(ErrorCodes.EINVAL, "Invalid archive extra data record signature: " + this.data.readUInt32LE(0));
            }
        }
        length() { return this.data.readUInt32LE(4); }
        extraFieldData() { return this.data.slice(8, 8 + this.length()); }
    }

    return ArchiveExtraDataRecord;

});