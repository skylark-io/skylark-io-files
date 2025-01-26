/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./system-user-entry","./misc"],function(t,s){"use strict";class a extends t{constructor(t){super(t)}flags(){return this._data[4]}creation(){return 1&this.flags()?this._longFormDates()?s.getDate(this._data,5):s.getShortFormDate(this._data,5):null}modify(){var t;return 2&this.flags()?(t=1&this.flags()?1:0,this._longFormDates?s.getDate(this._data,5+17*t):s.getShortFormDate(this._data,5+7*t)):null}access(){var t;return 4&this.flags()?(t=1&this.flags()?1:0,t+=2&this.flags()?1:0,this._longFormDates?s.getDate(this._data,5+17*t):s.getShortFormDate(this._data,5+7*t)):null}backup(){var t;return 16&this.flags()?(t=1&this.flags()?1:0,t=(t+=2&this.flags()?1:0)+(4&this.flags()?1:0),this._longFormDates?s.getDate(this._data,5+17*t):s.getShortFormDate(this._data,5+7*t)):null}expiration(){var t;return 32&this.flags()?(t=1&this.flags()?1:0,t=(t=(t+=2&this.flags()?1:0)+(4&this.flags()?1:0))+(16&this.flags()?1:0),this._longFormDates?s.getDate(this._data,5+17*t):s.getShortFormDate(this._data,5+7*t)):null}effective(){var t;return 64&this.flags()?(t=1&this.flags()?1:0,t=(t=(t=(t+=2&this.flags()?1:0)+(4&this.flags()?1:0))+(16&this.flags()?1:0))+(32&this.flags()?1:0),this._longFormDates?s.getDate(this._data,5+17*t):s.getShortFormDate(this._data,5+7*t)):null}_longFormDates(){return!!this.flags()}}return a});
//# sourceMappingURL=../../sourcemaps/providers/iso/tf-entry.js.map
