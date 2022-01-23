/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./misc","/directory-record"],function(t,r){"use strict";return class extends r{constructor(t,r){super(t,r)}_getString(r,e){return t.getASCIIString(this._data,r,e)}_constructDirectory(t){return new ISODirectory(this,t)}_getGetString(){return t.getASCIIString}}});
//# sourceMappingURL=../../sourcemaps/providers/iso/iso-directory-record.js.map
