define([
    "./system-user-entry"
], function (SystemUseEntry) {
    'use strict';

    /**
     * @hidden
     */
    class ESEntry extends SystemUseEntry {
        constructor(data) {
            super(data);
        }
        extensionSequence() {
            return this._data[4];
        }
    }

    return ESEntry;
});