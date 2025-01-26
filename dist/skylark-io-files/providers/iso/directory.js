/**
 * skylark-io-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define([],function(){"use strict";return class{constructor(t,e){this._fileList=[],this._fileMap={};let i=(this._record=t).lba(),r=i+t.dataLength();var s,c;for(2&t.fileFlags()||(t=t.getSUEntries(e).filter(t=>t instanceof CLEntry)[0],i=2048*t.childDirectoryLba(),r=1/0);i<r;)0===e[i]?i++:("\0"!==(c=(s=this._constructDirectoryRecord(e.slice(i))).fileName(e))&&""!==c?s.hasRockRidge()&&0!==s.getSUEntries(e).filter(t=>t instanceof REEntry).length||(this._fileMap[c]=s,this._fileList.push(c)):r===1/0&&(r=i+s.dataLength()),i+=s.length())}getRecord(t){return this._fileMap[t]}getFileList(){return this._fileList}getDotEntry(t){return this._constructDirectoryRecord(t.slice(this._record.lba()))}}});
//# sourceMappingURL=../../sourcemaps/providers/iso/directory.js.map
