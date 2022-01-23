define([
    "./system-user-entry"
], function (SystemUseEntry) {
    'use strict';
   /**
     * Continuation entry.
     * @hidden
     */
    class CEEntry extends SystemUseEntry {
        constructor(data) {
            super(data);
            this._entries = null;
        }
        /**
         * Logical block address of the continuation area.
         */
        continuationLba() {
            return this._data.readUInt32LE(4);
        }
        /**
         * Offset into the logical block.
         */
        continuationLbaOffset() {
            return this._data.readUInt32LE(12);
        }
        /**
         * Length of the continuation area.
         */
        continuationLength() {
            return this._data.readUInt32LE(20);
        }
        getEntries(isoData) {
            if (!this._entries) {
                const start = this.continuationLba() * 2048 + this.continuationLbaOffset();
                this._entries = constructSystemUseEntries(isoData, start, this.continuationLength(), isoData);
            }
            return this._entries;
        }
    }

    return CEEntry;
});