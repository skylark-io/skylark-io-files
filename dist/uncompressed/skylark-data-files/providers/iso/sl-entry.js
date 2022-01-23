define([
    "./system-user-entry",
    "./sl-component-record"
], function (SystemUseEntry,SLComponentRecord) {
    'use strict';
    /**
     * RockRidge: Records symbolic link
     * @hidden
     */
    class SLEntry extends SystemUseEntry {
        constructor(data) {
            super(data);
        }
        flags() {
            return this._data[4];
        }
        continueFlag() {
            return this.flags() & 0x1;
        }
        componentRecords() {
            const records = new Array();
            let i = 5;
            while (i < this.length()) {
                const record = new SLComponentRecord(this._data.slice(i));
                records.push(record);
                i += record.length();
            }
            return records;
        }
    }

    return SLEntry;
});