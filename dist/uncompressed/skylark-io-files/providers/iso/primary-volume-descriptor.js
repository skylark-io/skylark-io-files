define([
    '../../file-error',
    '../../error-codes',
    "./primary-or-supplementary-volume-descriptor",
    "./iso-directory-record"
], function (FileError,ErrorCodes,PrimaryOrSupplementaryVolumeDescriptor,ISODirectoryRecord) {
    'use strict';


    /**
     * @hidden
     */
    class PrimaryVolumeDescriptor extends PrimaryOrSupplementaryVolumeDescriptor {
        constructor(data) {
            super(data);
            if (this.type() !== 1 /* PrimaryVolumeDescriptor */) {
                throw new FileError(ErrorCodes.EIO, `Invalid primary volume descriptor.`);
            }
        }
        name() {
            return "ISO9660";
        }
        _constructRootDirectoryRecord(data) {
            return new ISODirectoryRecord(data, -1);
        }
        _getString(idx, len) {
            return this._getString(idx, len);
        }
    }

    return PrimaryVolumeDescriptor;
});