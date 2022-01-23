define([
    '../../file-error',
    '../../error-codes',
    "./misc",
    "./primary-or-supplementary-volume-descriptor",
    "./joliet-directory-record"
], function (FileError,ErrorCodes,misc,PrimaryOrSupplementaryVolumeDescriptor,JolietDirectoryRecord) {
    'use strict';
    /**
     * @hidden
     */
    class SupplementaryVolumeDescriptor extends PrimaryOrSupplementaryVolumeDescriptor {
        constructor(data) {
            super(data);
            if (this.type() !== 2 /* SupplementaryVolumeDescriptor */) {
                throw new FileError(ErrorCodes.EIO, `Invalid supplementary volume descriptor.`);
            }
            const escapeSequence = this.escapeSequence();
            const third = escapeSequence[2];
            // Third character identifies what 'level' of the UCS specification to follow.
            // We ignore it.
            if (escapeSequence[0] !== 0x25 || escapeSequence[1] !== 0x2F ||
                (third !== 0x40 && third !== 0x43 && third !== 0x45)) {
                throw new FileError(ErrorCodes.EIO, `Unrecognized escape sequence for SupplementaryVolumeDescriptor: ${escapeSequence.toString()}`);
            }
        }
        name() {
            return "Joliet";
        }
        escapeSequence() {
            return this._data.slice(88, 120);
        }
        _constructRootDirectoryRecord(data) {
            return new JolietDirectoryRecord(data, -1);
        }
        _getString(idx, len) {
            return misc.getJolietString(this._data, idx, len);
        }
    }


    return SupplementaryVolumeDescriptor;
});