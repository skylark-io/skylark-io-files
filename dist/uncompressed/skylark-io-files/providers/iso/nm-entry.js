define([
    "./system-user-entry"
], function (SystemUseEntry) {
    'use strict';
    /**
     * RockRidge: Records alternate file name
     * @hidden
     */
    class NMEntry extends SystemUseEntry {
        constructor(data) {
            super(data);
        }
        flags() {
            return this._data[4];
        }
        name(getString) {
            return getString(this._data, 5, this.length() - 5);
        }
    }
    return NMEntry;
});