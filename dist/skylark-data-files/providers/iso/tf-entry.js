/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./system-user-entry","./misc"],function(t,s){"use strict";return class extends t{constructor(t){super(t)}flags(){return this._data[4]}creation(){return 1&this.flags()?this._longFormDates()?s.getDate(this._data,5):s.getShortFormDate(this._data,5):null}modify(){if(2&this.flags()){const t=1&this.flags()?1:0;return this._longFormDates?s.getDate(this._data,5+17*t):s.getShortFormDate(this._data,5+7*t)}return null}access(){if(4&this.flags()){let t=1&this.flags()?1:0;return t+=2&this.flags()?1:0,this._longFormDates?s.getDate(this._data,5+17*t):s.getShortFormDate(this._data,5+7*t)}return null}backup(){if(16&this.flags()){let t=1&this.flags()?1:0;return t+=2&this.flags()?1:0,t+=4&this.flags()?1:0,this._longFormDates?s.getDate(this._data,5+17*t):s.getShortFormDate(this._data,5+7*t)}return null}expiration(){if(32&this.flags()){let t=1&this.flags()?1:0;return t+=2&this.flags()?1:0,t+=4&this.flags()?1:0,t+=16&this.flags()?1:0,this._longFormDates?s.getDate(this._data,5+17*t):s.getShortFormDate(this._data,5+7*t)}return null}effective(){if(64&this.flags()){let t=1&this.flags()?1:0;return t+=2&this.flags()?1:0,t+=4&this.flags()?1:0,t+=16&this.flags()?1:0,t+=32&this.flags()?1:0,this._longFormDates?s.getDate(this._data,5+17*t):s.getShortFormDate(this._data,5+7*t)}return null}_longFormDates(){return!!this.flags()}}});
//# sourceMappingURL=../../sourcemaps/providers/iso/tf-entry.js.map
