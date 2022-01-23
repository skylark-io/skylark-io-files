define([
    "./system-user-entry"
], function (SystemUseEntry) {
    'use strict';
    /**
     * RockRidge: Records POSIX device number.
     * @hidden
     */
    class PNEntry extends SystemUseEntry {
        constructor(data) {
            super(data);
        }
        devTHigh() {
            return this._data.readUInt32LE(4);
        }
        devTLow() {
            return this._data.readUInt32LE(12);
        }
    }

    return PNEntry;
});