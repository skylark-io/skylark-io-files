/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./misc","/directory-record"],function(e,t){"use strict";class r extends t{constructor(t,r){super(t,r)}_getString(t,r){return e.getJolietString(this._data,t,r)}_constructDirectory(t){return new JolietDirectory(this,t)}_getGetString(){return e.getJolietString}}return r});
//# sourceMappingURL=../../sourcemaps/providers/iso/joliet-directory-record.js.map
