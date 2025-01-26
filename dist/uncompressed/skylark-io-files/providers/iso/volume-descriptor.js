define([
	"./misc"
], function (misc) {
    'use strict';

    /**
     * @hidden
     */
    class VolumeDescriptor {
        constructor(data) {
            this._data = data;
        }
        type() {
            return this._data[0];
        }
        standardIdentifier() {
            return misc.getASCIIString(this._data, 1, 5);
        }
        version() {
            return this._data[6];
        }
        data() {
            return this._data.slice(7, 2048);
        }
    }


    return VolumeDescriptor;
});