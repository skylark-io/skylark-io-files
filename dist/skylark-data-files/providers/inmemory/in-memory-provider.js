/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../sync-key-value-provider","./in-memory-store"],function(e,r){"use strict";class n extends e{name(){return n.Name}constructor(){super({store:new r})}static Create(e,r){r(null,new n)}}return n.Name="InMemory",n.Options={},n.InMemoryStore=r,n});
//# sourceMappingURL=../../sourcemaps/providers/inmemory/in-memory-provider.js.map
