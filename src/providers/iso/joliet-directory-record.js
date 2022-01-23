define([
    "./misc",
    "/directory-record"
], function (misc,DirectoryRecord) {
    'use strict';
    /**
     * @hidden
     */
    class JolietDirectoryRecord extends DirectoryRecord {
        constructor(data, rockRidgeOffset) {
            super(data, rockRidgeOffset);
        }
        _getString(i, len) {
            return misc.getJolietString(this._data, i, len);
        }
        _constructDirectory(isoData) {
            return new JolietDirectory(this, isoData);
        }
        _getGetString() {
            return misc.getJolietString;
        }
    }

    return JolietDirectoryRecord;
});