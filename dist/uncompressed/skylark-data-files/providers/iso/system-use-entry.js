define([
    "./misc"
], function (misc) {
    'use strict';
    
    /**
     * @hidden
     */
    class SystemUseEntry {
        constructor(data) {
            this._data = data;
        }
        signatureWord() {
            return this._data.readUInt16BE(0);
        }
        signatureWordString() {
            return misc.getASCIIString(this._data, 0, 2);
        }
        length() {
            return this._data[2];
        }
        suVersion() {
            return this._data[3];
        }
    }

    return SystemUseEntry;
});