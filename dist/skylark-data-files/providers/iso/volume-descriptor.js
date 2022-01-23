/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./misc"],function(t){"use strict";return class{constructor(t){this._data=t}type(){return this._data[0]}standardIdentifier(){return t.getASCIIString(this._data,1,5)}version(){return this._data[6]}data(){return this._data.slice(7,2048)}}});
//# sourceMappingURL=../../sourcemaps/providers/iso/volume-descriptor.js.map
