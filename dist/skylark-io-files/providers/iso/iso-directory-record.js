/**
 * skylark-io-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./misc","/directory-record"],function(e,t){"use strict";class r extends t{constructor(t,r){super(t,r)}_getString(t,r){return e.getASCIIString(this._data,t,r)}_constructDirectory(t){return new ISODirectory(this,t)}_getGetString(){return e.getASCIIString}}return r});
//# sourceMappingURL=../../sourcemaps/providers/iso/iso-directory-record.js.map
