define([
    "./directory",
    "./joliet-directory-record"
], function (Directory,JolietDirectoryRecord) {
    'use strict';

    /**
     * @hidden
     */
    class JolietDirectory extends Directory {
        constructor(record, isoData) {
            super(record, isoData);
        }
        _constructDirectoryRecord(data) {
            return new JolietDirectoryRecord(data, this._record.getRockRidgeOffset());
        }
    }
    return JolietDirectory;
});