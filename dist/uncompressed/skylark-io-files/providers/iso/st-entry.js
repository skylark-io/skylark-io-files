define([
    "./system-user-entry"
], function (SystemUseEntry) {
    'use strict';

    /**
     * Identifies the end of the SUSP entries.
     * @hidden
     */
    class STEntry extends SystemUseEntry {
        constructor(data) {
            super(data);
        }
    }

    return STEntry;
});