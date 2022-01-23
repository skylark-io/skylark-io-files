define([
    "./system-user-entry"
], function (SystemUseEntry) {
    'use strict';
    /**
     * RockRidge: Records POSIX file attributes.
     * @hidden
     */
    class PXEntry extends SystemUseEntry {
        constructor(data) {
            super(data);
        }
        mode() {
            return this._data.readUInt32LE(4);
        }
        fileLinks() {
            return this._data.readUInt32LE(12);
        }
        uid() {
            return this._data.readUInt32LE(20);
        }
        gid() {
            return this._data.readUInt32LE(28);
        }
        inode() {
            return this._data.readUInt32LE(36);
        }
    }

    return PXEntry;
});