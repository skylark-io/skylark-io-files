/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./files","./error-codes","./file-error","./action-type"],function(t,i,r,e){"use strict";class a{constructor(t){if(this.flagStr=t,a.validFlagStrs.indexOf(t)<0)throw new r(i.EINVAL,"Invalid flag: "+t)}static getFileFlag(t){return a.flagCache.hasOwnProperty(t)?a.flagCache[t]:a.flagCache[t]=new a(t)}getFlagString(){return this.flagStr}isReadable(){return-1!==this.flagStr.indexOf("r")||-1!==this.flagStr.indexOf("+")}isWriteable(){return-1!==this.flagStr.indexOf("w")||-1!==this.flagStr.indexOf("a")||-1!==this.flagStr.indexOf("+")}isTruncating(){return-1!==this.flagStr.indexOf("w")}isAppendable(){return-1!==this.flagStr.indexOf("a")}isSynchronous(){return-1!==this.flagStr.indexOf("s")}isExclusive(){return-1!==this.flagStr.indexOf("x")}pathExistsAction(){return this.isExclusive()?e.THROW_EXCEPTION:this.isTruncating()?e.TRUNCATE_FILE:e.NOP}pathNotExistsAction(){return(this.isWriteable()||this.isAppendable())&&"r+"!==this.flagStr?e.CREATE_FILE:e.THROW_EXCEPTION}}return a.flagCache={},a.validFlagStrs=["r","r+","rs","rs+","w","wx","w+","wx+","a","ax","a+","ax+"],t.FileFlag=a});
//# sourceMappingURL=sourcemaps/file-flag.js.map
