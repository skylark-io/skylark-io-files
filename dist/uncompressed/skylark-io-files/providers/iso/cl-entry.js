define([
    "./system-user-entry"
], function (SystemUseEntry) {
    'use strict';

    /**
     * RockRidge: Records child link
     * @hidden
     */
    class CLEntry extends SystemUseEntry {
        constructor(data) {
            super(data);
        }
        childDirectoryLba() {
            return this._data.readUInt32LE(4);
        }
    }

    return CLEntry;
});