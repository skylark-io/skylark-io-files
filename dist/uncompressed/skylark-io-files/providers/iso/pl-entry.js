define([
    "./system-user-entry"
], function (SystemUseEntry) {
    'use strict';

    /**
     * RockRidge: Records parent link.
     * @hidden
     */
    class PLEntry extends SystemUseEntry {
        constructor(data) {
            super(data);
        }
        parentDirectoryLba() {
            return this._data.readUInt32LE(4);
        }
    }

    return PLEntry;
});