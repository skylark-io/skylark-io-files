define([
    "./system-user-entry",
    "./misc"
], function (SystemUseEntry,misc) {
    'use strict';

    /**
     * RockRidge: Records file timestamps
     * @hidden
     */
    class TFEntry extends SystemUseEntry {
        constructor(data) {
            super(data);
        }
        flags() {
            return this._data[4];
        }
        creation() {
            if (this.flags() & 1 /* CREATION */) {
                if (this._longFormDates()) {
                    return misc.getDate(this._data, 5);
                }
                else {
                    return misc.getShortFormDate(this._data, 5);
                }
            }
            else {
                return null;
            }
        }
        modify() {
            if (this.flags() & 2 /* MODIFY */) {
                const previousDates = (this.flags() & 1 /* CREATION */) ? 1 : 0;
                if (this._longFormDates) {
                    return misc.getDate(this._data, 5 + (previousDates * 17));
                }
                else {
                    return misc.getShortFormDate(this._data, 5 + (previousDates * 7));
                }
            }
            else {
                return null;
            }
        }
        access() {
            if (this.flags() & 4 /* ACCESS */) {
                let previousDates = (this.flags() & 1 /* CREATION */) ? 1 : 0;
                previousDates += (this.flags() & 2 /* MODIFY */) ? 1 : 0;
                if (this._longFormDates) {
                    return misc.getDate(this._data, 5 + (previousDates * 17));
                }
                else {
                    return misc.getShortFormDate(this._data, 5 + (previousDates * 7));
                }
            }
            else {
                return null;
            }
        }
        backup() {
            if (this.flags() & 16 /* BACKUP */) {
                let previousDates = (this.flags() & 1 /* CREATION */) ? 1 : 0;
                previousDates += (this.flags() & 2 /* MODIFY */) ? 1 : 0;
                previousDates += (this.flags() & 4 /* ACCESS */) ? 1 : 0;
                if (this._longFormDates) {
                    return misc.getDate(this._data, 5 + (previousDates * 17));
                }
                else {
                    return misc.getShortFormDate(this._data, 5 + (previousDates * 7));
                }
            }
            else {
                return null;
            }
        }
        expiration() {
            if (this.flags() & 32 /* EXPIRATION */) {
                let previousDates = (this.flags() & 1 /* CREATION */) ? 1 : 0;
                previousDates += (this.flags() & 2 /* MODIFY */) ? 1 : 0;
                previousDates += (this.flags() & 4 /* ACCESS */) ? 1 : 0;
                previousDates += (this.flags() & 16 /* BACKUP */) ? 1 : 0;
                if (this._longFormDates) {
                    return misc.getDate(this._data, 5 + (previousDates * 17));
                }
                else {
                    return misc.getShortFormDate(this._data, 5 + (previousDates * 7));
                }
            }
            else {
                return null;
            }
        }
        effective() {
            if (this.flags() & 64 /* EFFECTIVE */) {
                let previousDates = (this.flags() & 1 /* CREATION */) ? 1 : 0;
                previousDates += (this.flags() & 2 /* MODIFY */) ? 1 : 0;
                previousDates += (this.flags() & 4 /* ACCESS */) ? 1 : 0;
                previousDates += (this.flags() & 16 /* BACKUP */) ? 1 : 0;
                previousDates += (this.flags() & 32 /* EXPIRATION */) ? 1 : 0;
                if (this._longFormDates) {
                    return misc.getDate(this._data, 5 + (previousDates * 17));
                }
                else {
                    return misc.getShortFormDate(this._data, 5 + (previousDates * 7));
                }
            }
            else {
                return null;
            }
        }
        _longFormDates() {
            return !!(this.flags() && 128 /* LONG_FORM */);
        }
    }
    return TFEntry;
});