define([
    "./misc",
    "/directory-record"
], function (misc,DirectoryRecord) {
    'use strict';

    /**
     * @hidden
     */
    class ISODirectoryRecord extends DirectoryRecord {
        constructor(data, rockRidgeOffset) {
            super(data, rockRidgeOffset);
        }
        _getString(i, len) {
            return misc.getASCIIString(this._data, i, len);
        }
        _constructDirectory(isoData) {
            return new ISODirectory(this, isoData);
        }
        _getGetString() {
            return misc.getASCIIString;
        }
    }

    return ISODirectoryRecord;
});