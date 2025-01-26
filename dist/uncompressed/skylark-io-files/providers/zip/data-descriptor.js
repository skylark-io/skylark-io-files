define([], function () {
    'use strict';

    /**
     * 4.3.9  Data descriptor:
     *
     *    crc-32                          4 bytes
     *    compressed size                 4 bytes
     *    uncompressed size               4 bytes
     */
    class DataDescriptor {
        constructor(data) {
            this.data = data;
        }
        crc32() { return this.data.readUInt32LE(0); }
        compressedSize() { return this.data.readUInt32LE(4); }
        uncompressedSize() { return this.data.readUInt32LE(8); }
    }

    return DataDescriptor;

});