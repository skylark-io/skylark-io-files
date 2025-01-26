/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./misc"],function(n){"use strict";return class{constructor(t){this._data=t}flags(){return this._data[0]}length(){return 2+this.componentLength()}componentLength(){return this._data[1]}content(t){return n.getString(this._data,2,this.componentLength())}}});
//# sourceMappingURL=../../sourcemaps/providers/iso/sl-component-record.js.map
