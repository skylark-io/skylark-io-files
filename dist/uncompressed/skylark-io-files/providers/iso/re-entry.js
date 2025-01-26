define([
    "./system-user-entry"
], function (SystemUseEntry) {
    'use strict';


    /**
     * RockRidge: Records relocated directory.
     * @hidden
     */
    class REEntry extends SystemUseEntry {
        constructor(data) {
            super(data);
        }
    }

    return REEntry;
});