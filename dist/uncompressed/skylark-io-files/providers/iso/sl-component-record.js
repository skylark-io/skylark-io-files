define([
    "./misc"
], function (misc) {
    'use strict';

    /**
     * @hidden
     */
    class SLComponentRecord {
        constructor(data) {
            this._data = data;
        }
        flags() {
            return this._data[0];
        }
        length() {
            return 2 + this.componentLength();
        }
        componentLength() {
            return this._data[1];
        }
        content(getString) {
            return misc.getString(this._data, 2, this.componentLength());
        }
    }

    return SLComponentRecord;
});