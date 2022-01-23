/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define([],function(){"use strict";return class{constructor(t,e){this._fileList=[],this._fileMap={},this._record=t;let i=t.lba(),r=i+t.dataLength();for(2&t.fileFlags()||(i=2048*t.getSUEntries(e).filter(t=>t instanceof CLEntry)[0].childDirectoryLba(),r=1/0);i<r;){if(0===e[i]){i++;continue}const t=this._constructDirectoryRecord(e.slice(i)),s=t.fileName(e);"\0"!==s&&""!==s?t.hasRockRidge()&&0!==t.getSUEntries(e).filter(t=>t instanceof REEntry).length||(this._fileMap[s]=t,this._fileList.push(s)):r===1/0&&(r=i+t.dataLength()),i+=t.length()}}getRecord(t){return this._fileMap[t]}getFileList(){return this._fileList}getDotEntry(t){return this._constructDirectoryRecord(t.slice(this._record.lba()))}}});
//# sourceMappingURL=../../sourcemaps/providers/iso/directory.js.map
