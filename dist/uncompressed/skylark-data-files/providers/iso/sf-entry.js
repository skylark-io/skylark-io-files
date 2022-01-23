define([
    "./system-user-entry"
], function (SystemUseEntry) {
    'use strict';

    /**
     * RockRidge: File data in sparse format.
     * @hidden
     */
    class SFEntry extends SystemUseEntry {
        constructor(data) {
            super(data);
        }
        virtualSizeHigh() {
            return this._data.readUInt32LE(4);
        }
        virtualSizeLow() {
            return this._data.readUInt32LE(12);
        }
        tableDepth() {
            return this._data[20];
        }
    }

    return SFEntry;
});