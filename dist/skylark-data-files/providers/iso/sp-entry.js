/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./system-user-entry"],function(t){"use strict";return class extends t{constructor(t){super(t)}checkBytesPass(){return 190===this._data[4]&&239===this._data[5]}bytesSkipped(){return this._data[6]}}});
//# sourceMappingURL=../../sourcemaps/providers/iso/sp-entry.js.map
