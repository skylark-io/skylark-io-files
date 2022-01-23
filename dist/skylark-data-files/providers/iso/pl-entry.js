/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./system-user-entry"],function(t){"use strict";return class extends t{constructor(t){super(t)}parentDirectoryLba(){return this._data.readUInt32LE(4)}}});
//# sourceMappingURL=../../sourcemaps/providers/iso/pl-entry.js.map
