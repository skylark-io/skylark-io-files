define([
    "./system-user-entry",
    "./misc"
], function (SystemUseEntry,misc) {
    'use strict';

    /**
     * Specifies system-specific extensions to SUSP.
     * @hidden
     */
    class EREntry extends SystemUseEntry {
        constructor(data) {
            super(data);
        }
        identifierLength() {
            return this._data[4];
        }
        descriptorLength() {
            return this._data[5];
        }
        sourceLength() {
            return this._data[6];
        }
        extensionVersion() {
            return this._data[7];
        }
        extensionIdentifier() {
            return misc.getASCIIString(this._data, 8, this.identifierLength());
        }
        extensionDescriptor() {
            return misc.getASCIIString(this._data, 8 + this.identifierLength(), this.descriptorLength());
        }
        extensionSource() {
            return misc.getASCIIString(this._data, 8 + this.identifierLength() + this.descriptorLength(), this.sourceLength());
        }
    }

    return EREntry;
});