/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define([],function(){"use strict";return class{constructor(t,e){this._suEntries=null,this._fileOrDir=null,this._data=t,this._rockRidgeOffset=e}hasRockRidge(){return this._rockRidgeOffset>-1}getRockRidgeOffset(){return this._rockRidgeOffset}rootCheckForRockRidge(t){const e=this.getDirectory(t);this._rockRidgeOffset=e.getDotEntry(t)._getRockRidgeOffset(t),this._rockRidgeOffset>-1&&(this._fileOrDir=null)}length(){return this._data[0]}extendedAttributeRecordLength(){return this._data[1]}lba(){return 2048*this._data.readUInt32LE(2)}dataLength(){return this._data.readUInt32LE(10)}recordingDate(){return getShortFormDate(this._data,18)}fileFlags(){return this._data[25]}fileUnitSize(){return this._data[26]}interleaveGapSize(){return this._data[27]}volumeSequenceNumber(){return this._data.readUInt16LE(28)}identifier(){return this._getString(33,this._data[32])}fileName(t){if(this.hasRockRidge()){const e=this._rockRidgeFilename(t);if(null!==e)return e}const e=this.identifier();if(this.isDirectory(t))return e;const i=e.indexOf(";");return-1===i?e:"."===e[i-1]?e.slice(0,i-1):e.slice(0,i)}isDirectory(t){let e=!!(2&this.fileFlags());return!e&&this.hasRockRidge()&&(e=this.getSUEntries(t).filter(t=>t instanceof CLEntry).length>0),e}isSymlink(t){return this.hasRockRidge()&&this.getSUEntries(t).filter(t=>t instanceof SLEntry).length>0}getSymlinkPath(t){let e="";const i=this.getSUEntries(t),r=this._getGetString();for(const t of i)if(t instanceof SLEntry){const i=t.componentRecords();for(const t of i){const i=t.flags();2&i?e+="./":4&i?e+="../":8&i?e+="/":(e+=t.content(r),1&i||(e+="/"))}if(!t.continueFlag())break}return e.length>1&&"/"===e[e.length-1]?e.slice(0,e.length-1):e}getFile(t){if(this.isDirectory(t))throw new Error("Tried to get a File from a directory.");return null===this._fileOrDir&&(this._fileOrDir=t.slice(this.lba(),this.lba()+this.dataLength())),this._fileOrDir}getDirectory(t){if(!this.isDirectory(t))throw new Error("Tried to get a Directory from a file.");return null===this._fileOrDir&&(this._fileOrDir=this._constructDirectory(t)),this._fileOrDir}getSUEntries(t){return this._suEntries||this._constructSUEntries(t),this._suEntries}_rockRidgeFilename(t){const e=this.getSUEntries(t).filter(t=>t instanceof NMEntry);if(0===e.length||6&e[0].flags())return null;let i="";const r=this._getGetString();for(const t of e)if(i+=t.name(r),!(1&t.flags()))break;return i}_constructSUEntries(t){let e=33+this._data[32];e%2==1&&e++,e+=this._rockRidgeOffset,this._suEntries=constructSystemUseEntries(this._data,e,this.length(),t)}_getRockRidgeOffset(t){this._rockRidgeOffset=0;const e=this.getSUEntries(t);if(e.length>0){const t=e[0];if(t instanceof SPEntry&&t.checkBytesPass())for(let i=1;i<e.length;i++){const r=e[i];if(r instanceof RREntry||r instanceof EREntry&&r.extensionIdentifier()===rockRidgeIdentifier)return t.bytesSkipped()}}return this._rockRidgeOffset=-1,-1}}});
//# sourceMappingURL=../../sourcemaps/providers/iso/directory-record.js.map
