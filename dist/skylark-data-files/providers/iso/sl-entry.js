/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./system-user-entry","./sl-component-record"],function(e,n){"use strict";class t extends e{constructor(e){super(e)}flags(){return this._data[4]}continueFlag(){return 1&this.flags()}componentRecords(){var e=new Array;let t=5;for(;t<this.length();){var r=new n(this._data.slice(t));e.push(r),t+=r.length()}return e}}return t});
//# sourceMappingURL=../../sourcemaps/providers/iso/sl-entry.js.map
