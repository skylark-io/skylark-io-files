define([], function () {
    'use strict';

    /**
     * 4.3.13 Digital signature:
     *
     *      header signature                4 bytes  (0x05054b50)
     *      size of data                    2 bytes
     *      signature data (variable size)
     *
     *    With the introduction of the Central Directory Encryption
     *    feature in version 6.2 of this specification, the Central
     *    Directory Structure MAY be stored both compressed and encrypted.
     *    Although not required, it is assumed when encrypting the
     *    Central Directory Structure, that it will be compressed
     *    for greater storage efficiency.  Information on the
     *    Central Directory Encryption feature can be found in the section
     *    describing the Strong Encryption Specification. The Digital
     *    Signature record will be neither compressed nor encrypted.
     */
    class DigitalSignature {
        constructor(data) {
            this.data = data;
            if (this.data.readUInt32LE(0) !== 0x05054b50) {
                throw new FileError(ErrorCodes.EINVAL, "Invalid digital signature signature: " + this.data.readUInt32LE(0));
            }
        }
        size() { return this.data.readUInt16LE(4); }
        signatureData() { return this.data.slice(6, 6 + this.size()); }
    }

    return DigitalSignature;

});