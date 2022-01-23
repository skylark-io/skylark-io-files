/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./system-user-entry"],function(t){"use strict";return class extends t{constructor(t){super(t)}flags(){return this._data[4]}name(t){return t(this._data,5,this.length()-5)}}});
//# sourceMappingURL=../../sourcemaps/providers/iso/nm-entry.js.map
