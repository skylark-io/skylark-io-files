define([], function () {
    'use strict';

    /**
     * Contains the table of contents of a Zip file.
     */
    class ZipTOC {
        constructor(index, directoryEntries, eocd, data) {
            this.index = index;
            this.directoryEntries = directoryEntries;
            this.eocd = eocd;
            this.data = data;
        }
    }
    return ZipTOC;

});