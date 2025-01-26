/**
 * skylark-io-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../../files","../registry","../sync-key-value-provider","./in-memory-store"],function(e,r,n,t){"use strict";class o extends n{name(){return o.Name}constructor(){super({store:new t})}static Create(e,r){r(null,new o)}}return o.Name="InMemory",o.Options={},o.InMemoryStore=t,r.add("inMemory",o),e.providers.InMemoryProvider=o});
//# sourceMappingURL=../../sourcemaps/providers/inmemory/in-memory-provider.js.map
