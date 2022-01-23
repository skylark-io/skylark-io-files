define([
    "./system-user-entry"
], function (SystemUseEntry) {
    'use strict';

    /**
     * Identifies that SUSP is in-use.
     * @hidden
     */
    class SPEntry extends SystemUseEntry {
        constructor(data) {
            super(data);
        }
        checkBytesPass() {
            return this._data[4] === 0xBE && this._data[5] === 0xEF;
        }
        bytesSkipped() {
            return this._data[6];
        }
    }


    return SPEntry;
});