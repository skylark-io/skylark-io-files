/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./system-user-entry","./sl-component-record"],function(t,e){"use strict";return class extends t{constructor(t){super(t)}flags(){return this._data[4]}continueFlag(){return 1&this.flags()}componentRecords(){const t=new Array;let n=5;for(;n<this.length();){const s=new e(this._data.slice(n));t.push(s),n+=s.length()}return t}}});
//# sourceMappingURL=../../sourcemaps/providers/iso/sl-entry.js.map
