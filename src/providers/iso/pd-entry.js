define([
    "./system-user-entry"
], function (SystemUseEntry) {
    'use strict';

    /**
     * Padding entry.
     * @hidden
     */
    class PDEntry extends SystemUseEntry {
        constructor(data) {
            super(data);
        }
    }


    return PDEntry;
});