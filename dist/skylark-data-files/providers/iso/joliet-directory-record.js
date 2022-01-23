/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./misc","/directory-record"],function(t,r){"use strict";return class extends r{constructor(t,r){super(t,r)}_getString(r,e){return t.getJolietString(this._data,r,e)}_constructDirectory(t){return new JolietDirectory(this,t)}_getGetString(){return t.getJolietString}}});
//# sourceMappingURL=../../sourcemaps/providers/iso/joliet-directory-record.js.map
