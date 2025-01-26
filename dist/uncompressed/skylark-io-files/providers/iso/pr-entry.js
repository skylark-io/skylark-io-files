define([
    "./system-user-entry"
], function (SystemUseEntry) {
    'use strict';

    /**
     * RockRidge: Marks that RockRidge is in use [deprecated]
     * @hidden
     */
    class RREntry extends SystemUseEntry {
        constructor(data) {
            super(data);
        }
    }

    return RREntry;
});