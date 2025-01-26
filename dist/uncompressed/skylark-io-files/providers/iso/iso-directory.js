define([
    "./directory"
], function (Directory) {
    'use strict';

    /**
     * @hidden
     */
    class ISODirectory extends Directory {
        constructor(record, isoData) {
            super(record, isoData);
        }
        _constructDirectoryRecord(data) {
            return new ISODirectoryRecord(data, this._record.getRockRidgeOffset());
        }
    }
    return ISODirectory;
});