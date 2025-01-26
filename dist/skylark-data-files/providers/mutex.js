/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-funcs/defer"],function(s){"use strict";return class{constructor(){this._locked=!1,this._waiters=[]}lock(t){this._locked?this._waiters.push(t):(this._locked=!0,t())}unlock(){if(!this._locked)throw new Error("unlock of a non-locked mutex");var t=this._waiters.shift();t?s(t):this._locked=!1}tryLock(){return!this._locked&&(this._locked=!0)}isLocked(){return this._locked}}});
//# sourceMappingURL=../sourcemaps/providers/mutex.js.map
