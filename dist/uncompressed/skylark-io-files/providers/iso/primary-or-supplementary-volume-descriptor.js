define([
    "./misc",
    "./volume-descriptor"
], function (misc,VolumeDescriptor) {
    'use strict';

    /**
     * @hidden
     */
    class PrimaryOrSupplementaryVolumeDescriptor extends VolumeDescriptor {
        constructor(data) {
            super(data);
            this._root = null;
        }
        systemIdentifier() {
            return this._getString32(8);
        }
        volumeIdentifier() {
            return this._getString32(40);
        }
        volumeSpaceSize() {
            return this._data.readUInt32LE(80);
        }
        volumeSetSize() {
            return this._data.readUInt16LE(120);
        }
        volumeSequenceNumber() {
            return this._data.readUInt16LE(124);
        }
        logicalBlockSize() {
            return this._data.readUInt16LE(128);
        }
        pathTableSize() {
            return this._data.readUInt32LE(132);
        }
        locationOfTypeLPathTable() {
            return this._data.readUInt32LE(140);
        }
        locationOfOptionalTypeLPathTable() {
            return this._data.readUInt32LE(144);
        }
        locationOfTypeMPathTable() {
            return this._data.readUInt32BE(148);
        }
        locationOfOptionalTypeMPathTable() {
            return this._data.readUInt32BE(152);
        }
        rootDirectoryEntry(isoData) {
            if (this._root === null) {
                this._root = this._constructRootDirectoryRecord(this._data.slice(156));
                this._root.rootCheckForRockRidge(isoData);
            }
            return this._root;
        }
        volumeSetIdentifier() {
            return this._getString(190, 128);
        }
        publisherIdentifier() {
            return this._getString(318, 128);
        }
        dataPreparerIdentifier() {
            return this._getString(446, 128);
        }
        applicationIdentifier() {
            return this._getString(574, 128);
        }
        copyrightFileIdentifier() {
            return this._getString(702, 38);
        }
        abstractFileIdentifier() {
            return this._getString(740, 36);
        }
        bibliographicFileIdentifier() {
            return this._getString(776, 37);
        }
        volumeCreationDate() {
            return misc.getDate(this._data, 813);
        }
        volumeModificationDate() {
            return misc.getDate(this._data, 830);
        }
        volumeExpirationDate() {
            return misc.getDate(this._data, 847);
        }
        volumeEffectiveDate() {
            return misc.getDate(this._data, 864);
        }
        fileStructureVersion() {
            return this._data[881];
        }
        applicationUsed() {
            return this._data.slice(883, 883 + 512);
        }
        reserved() {
            return this._data.slice(1395, 1395 + 653);
        }
        _getString32(idx) {
            return this._getString(idx, 32);
        }
    }

    return PrimaryOrSupplementaryVolumeDescriptor;
});