/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-data-files/files',[],function(){
	
});
define('skylark-data-files/action-type',[
  "./files"
],function (files) {
  'use strict';

  var ActionType;
  (function (ActionType) {
      // Indicates that the code should not do anything.
      ActionType[ActionType["NOP"] = 0] = "NOP";
      // Indicates that the code should throw an exception.
      ActionType[ActionType["THROW_EXCEPTION"] = 1] = "THROW_EXCEPTION";
      // Indicates that the code should truncate the file, but only if it is a file.
      ActionType[ActionType["TRUNCATE_FILE"] = 2] = "TRUNCATE_FILE";
      // Indicates that the code should create the file.
      ActionType[ActionType["CREATE_FILE"] = 3] = "CREATE_FILE";
  })(ActionType || (ActionType = {}));

  return files.ActionType = ActionType;
});
  
define('skylark-data-files/error-codes',[
  "./files"
],function (files) {
  'use strict';

  /**
   * Standard libc error codes. Add more to this enum and ErrorStrings as they are
   * needed.
   * @url http://www.gnu.org/software/libc/manual/html_node/Error-Codes.html
   */
  var ErrorCodes;
  (function (ErrorCodes) {
      ErrorCodes[ErrorCodes["EPERM"] = 1] = "EPERM";
      ErrorCodes[ErrorCodes["ENOENT"] = 2] = "ENOENT";
      ErrorCodes[ErrorCodes["EIO"] = 5] = "EIO";
      ErrorCodes[ErrorCodes["EBADF"] = 9] = "EBADF";
      ErrorCodes[ErrorCodes["EACCES"] = 13] = "EACCES";
      ErrorCodes[ErrorCodes["EBUSY"] = 16] = "EBUSY";
      ErrorCodes[ErrorCodes["EEXIST"] = 17] = "EEXIST";
      ErrorCodes[ErrorCodes["ENOTDIR"] = 20] = "ENOTDIR";
      ErrorCodes[ErrorCodes["EISDIR"] = 21] = "EISDIR";
      ErrorCodes[ErrorCodes["EINVAL"] = 22] = "EINVAL";
      ErrorCodes[ErrorCodes["EFBIG"] = 27] = "EFBIG";
      ErrorCodes[ErrorCodes["ENOSPC"] = 28] = "ENOSPC";
      ErrorCodes[ErrorCodes["EROFS"] = 30] = "EROFS";
      ErrorCodes[ErrorCodes["ENOTEMPTY"] = 39] = "ENOTEMPTY";
      ErrorCodes[ErrorCodes["ENOTSUP"] = 95] = "ENOTSUP";
  })(ErrorCodes || (ErrorCodes = {}));

  return files.ErrorCodes = ErrorCodes;
});
  
define('skylark-data-files/error-strings',[
  "./files",
  "./error-codes"
],function (files,ErrorCodes) {
  'use strict';

  /* tslint:disable:variable-name */
  /**
   * Strings associated with each error code.
   * @hidden
   */
  const ErrorStrings = {};
  ErrorStrings[ErrorCodes.EPERM] = 'Operation not permitted.';
  ErrorStrings[ErrorCodes.ENOENT] = 'No such file or directory.';
  ErrorStrings[ErrorCodes.EIO] = 'Input/output error.';
  ErrorStrings[ErrorCodes.EBADF] = 'Bad file descriptor.';
  ErrorStrings[ErrorCodes.EACCES] = 'Permission denied.';
  ErrorStrings[ErrorCodes.EBUSY] = 'Resource busy or locked.';
  ErrorStrings[ErrorCodes.EEXIST] = 'File exists.';
  ErrorStrings[ErrorCodes.ENOTDIR] = 'File is not a directory.';
  ErrorStrings[ErrorCodes.EISDIR] = 'File is a directory.';
  ErrorStrings[ErrorCodes.EINVAL] = 'Invalid argument.';
  ErrorStrings[ErrorCodes.EFBIG] = 'File is too big.';
  ErrorStrings[ErrorCodes.ENOSPC] = 'No space left on disk.';
  ErrorStrings[ErrorCodes.EROFS] = 'Cannot modify a read-only file system.';
  ErrorStrings[ErrorCodes.ENOTEMPTY] = 'Directory is not empty.';
  ErrorStrings[ErrorCodes.ENOTSUP] = 'Operation is not supported.';

  return files.ErrorStrings = ErrorStrings;
});
  
define('skylark-data-files/file-error',[
    "skylark-langx-binary/buffer",
    "./files",
    "./error-codes",
    "./error-strings"
],function (Buffer,files,ErrorCodes,ErrorStrings) {
   'use strict';
   

    /* tslint:enable:variable-name */
    /**
     * Represents a BrowserFS error. Passed back to applications after a failed
     * call to the BrowserFS API.
     */
    class FileError extends Error {
        /**
         * Represents a BrowserFS error. Passed back to applications after a failed
         * call to the BrowserFS API.
         *
         * Error codes mirror those returned by regular Unix file operations, which is
         * what Node returns.
         * @constructor FileError
         * @param type The type of the error.
         * @param [message] A descriptive error message.
         */
        constructor(type, message = ErrorStrings[type], path) {
            super(message);
            // Unsupported.
            this.syscall = "";
            this.errno = type;
            this.code = ErrorCodes[type];
            this.path = path;
            this.stack = new Error().stack;
            this.message = `Error: ${this.code}: ${message}${this.path ? `, '${this.path}'` : ''}`;
        }
        static fromJSON(json) {
            const err = new FileError(0);
            err.errno = json.errno;
            err.code = json.code;
            err.path = json.path;
            err.stack = json.stack;
            err.message = json.message;
            return err;
        }
        /**
         * Creates an FileError object from a buffer.
         */
        static fromBuffer(buffer, i = 0) {
            return FileError.fromJSON(JSON.parse(buffer.toString('utf8', i + 4, i + 4 + buffer.readUInt32LE(i))));
        }
        static create(code, p) {
            return new FileError(code, ErrorStrings[code], p);
        }
        static ENOENT(path) {
            return this.create(ErrorCodes.ENOENT, path);
        }
        static EEXIST(path) {
            return this.create(ErrorCodes.EEXIST, path);
        }
        static EISDIR(path) {
            return this.create(ErrorCodes.EISDIR, path);
        }
        static ENOTDIR(path) {
            return this.create(ErrorCodes.ENOTDIR, path);
        }
        static EPERM(path) {
            return this.create(ErrorCodes.EPERM, path);
        }
        static ENOTEMPTY(path) {
            return this.create(ErrorCodes.ENOTEMPTY, path);
        }
        /**
         * @return A friendly error message.
         */
        toString() {
            return this.message;
        }
        toJSON() {
            return {
                errno: this.errno,
                code: this.code,
                path: this.path,
                stack: this.stack,
                message: this.message
            };
        }
        /**
         * Writes the API error into a buffer.
         */
        writeToBuffer(buffer = Buffer.alloc(this.bufferSize()), i = 0) {
            const bytesWritten = buffer.write(JSON.stringify(this.toJSON()), i + 4);
            buffer.writeUInt32LE(bytesWritten, i);
            return buffer;
        }
        /**
         * The size of the API error in buffer-form in bytes.
         */
        bufferSize() {
            // 4 bytes for string length.
            return 4 + Buffer.byteLength(JSON.stringify(this.toJSON()));
        }
    }

    return files.FileError = FileError;

});
define('skylark-data-files/base-file',[
    "./files",
    './error-codes',
    "./file-error"
], function (files,ErrorCodes, FileError) {
    'use strict';

    /**
     * Base class that contains shared implementations of functions for the file
     * object.
     */
    class BaseFile {
        sync(cb) {
            cb(new FileError(ErrorCodes.ENOTSUP));
        }
        syncSync() {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        datasync(cb) {
            this.sync(cb);
        }
        datasyncSync() {
            return this.syncSync();
        }
        chown(uid, gid, cb) {
            cb(new FileError(ErrorCodes.ENOTSUP));
        }
        chownSync(uid, gid) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        chmod(mode, cb) {
            cb(new FileError(ErrorCodes.ENOTSUP));
        }
        chmodSync(mode) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        utimes(atime, mtime, cb) {
            cb(new FileError(ErrorCodes.ENOTSUP));
        }
        utimesSync(atime, mtime) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
    }
    return files.BaseFile = BaseFile;
});
define('skylark-data-files/file-flag',[
  "./files",
  './error-codes',
  "./file-error",
  "./action-type"
], function (files,ErrorCodes,FileError,ActionType) {
    'use strict';



  /**
   * Represents one of the following file flags. A convenience object.
   *
   * * `'r'` - Open file for reading. An exception occurs if the file does not exist.
   * * `'r+'` - Open file for reading and writing. An exception occurs if the file does not exist.
   * * `'rs'` - Open file for reading in synchronous mode. Instructs the filesystem to not cache writes.
   * * `'rs+'` - Open file for reading and writing, and opens the file in synchronous mode.
   * * `'w'` - Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
   * * `'wx'` - Like 'w' but opens the file in exclusive mode.
   * * `'w+'` - Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists).
   * * `'wx+'` - Like 'w+' but opens the file in exclusive mode.
   * * `'a'` - Open file for appending. The file is created if it does not exist.
   * * `'ax'` - Like 'a' but opens the file in exclusive mode.
   * * `'a+'` - Open file for reading and appending. The file is created if it does not exist.
   * * `'ax+'` - Like 'a+' but opens the file in exclusive mode.
   *
   * Exclusive mode ensures that the file path is newly created.
   */
  class FileFlag {
      /**
       * This should never be called directly.
       * @param modeStr The string representing the mode
       * @throw when the mode string is invalid
       */
      constructor(flagStr) {
          this.flagStr = flagStr;
          if (FileFlag.validFlagStrs.indexOf(flagStr) < 0) {
              throw new FileError(ErrorCodes.EINVAL, "Invalid flag: " + flagStr);
          }
      }
      /**
       * Get an object representing the given file flag.
       * @param modeStr The string representing the flag
       * @return The FileFlag object representing the flag
       * @throw when the flag string is invalid
       */
      static getFileFlag(flagStr) {
          // Check cache first.
          if (FileFlag.flagCache.hasOwnProperty(flagStr)) {
              return FileFlag.flagCache[flagStr];
          }
          return FileFlag.flagCache[flagStr] = new FileFlag(flagStr);
      }
      /**
       * Get the underlying flag string for this flag.
       */
      getFlagString() {
          return this.flagStr;
      }
      /**
       * Returns true if the file is readable.
       */
      isReadable() {
          return this.flagStr.indexOf('r') !== -1 || this.flagStr.indexOf('+') !== -1;
      }
      /**
       * Returns true if the file is writeable.
       */
      isWriteable() {
          return this.flagStr.indexOf('w') !== -1 || this.flagStr.indexOf('a') !== -1 || this.flagStr.indexOf('+') !== -1;
      }
      /**
       * Returns true if the file mode should truncate.
       */
      isTruncating() {
          return this.flagStr.indexOf('w') !== -1;
      }
      /**
       * Returns true if the file is appendable.
       */
      isAppendable() {
          return this.flagStr.indexOf('a') !== -1;
      }
      /**
       * Returns true if the file is open in synchronous mode.
       */
      isSynchronous() {
          return this.flagStr.indexOf('s') !== -1;
      }
      /**
       * Returns true if the file is open in exclusive mode.
       */
      isExclusive() {
          return this.flagStr.indexOf('x') !== -1;
      }
      /**
       * Returns one of the static fields on this object that indicates the
       * appropriate response to the path existing.
       */
      pathExistsAction() {
          if (this.isExclusive()) {
              return ActionType.THROW_EXCEPTION;
          }
          else if (this.isTruncating()) {
              return ActionType.TRUNCATE_FILE;
          }
          else {
              return ActionType.NOP;
          }
      }
      /**
       * Returns one of the static fields on this object that indicates the
       * appropriate response to the path not existing.
       */
      pathNotExistsAction() {
          if ((this.isWriteable() || this.isAppendable()) && this.flagStr !== 'r+') {
              return ActionType.CREATE_FILE;
          }
          else {
              return ActionType.THROW_EXCEPTION;
          }
      }
  }
  // Contains cached FileMode instances.
  FileFlag.flagCache = {};
  // Array of valid mode strings.
  FileFlag.validFlagStrs = ['r', 'r+', 'rs', 'rs+', 'w', 'wx', 'w+', 'wx+', 'a', 'ax', 'a+', 'ax+'];



  return files.FileFlag = FileFlag;
});
define('skylark-data-files/file-type',[
  "./files"
],function (files) {
  'use strict';

  /**
    * Indicates the type of the given file. Applied to 'mode'.
    */
  var FileType;
  (function (FileType) {
      FileType[FileType["FILE"] = 32768] = "FILE";
      FileType[FileType["DIRECTORY"] = 16384] = "DIRECTORY";
      FileType[FileType["SYMLINK"] = 40960] = "SYMLINK";
  })(FileType || (FileType = {}));

  return files.FileType = FileType;
});
  
define('skylark-data-files/stats',[
    'skylark-langx-binary/buffer',
    "./file-type"
],function (Buffer,FileType) {
    'use strict';

    /**
     * Emulation of Node's `fs.Stats` object.
     *
     * Attribute descriptions are from `man 2 stat'
     * @see http://nodejs.org/api/fs.html#fs_class_fs_stats
     * @see http://man7.org/linux/man-pages/man2/stat.2.html
     */
    class Stats {
        /**
         * Provides information about a particular entry in the file system.
         * @param itemType Type of the item (FILE, DIRECTORY, SYMLINK, or SOCKET)
         * @param size Size of the item in bytes. For directories/symlinks,
         *   this is normally the size of the struct that represents the item.
         * @param mode Unix-style file mode (e.g. 0o644)
         * @param atimeMs time of last access, in milliseconds since epoch
         * @param mtimeMs time of last modification, in milliseconds since epoch
         * @param ctimeMs time of last time file status was changed, in milliseconds since epoch
         * @param birthtimeMs time of file creation, in milliseconds since epoch
         */
        constructor(itemType, size, mode, atimeMs, mtimeMs, ctimeMs, birthtimeMs) {
            /**
             * UNSUPPORTED ATTRIBUTES
             * I assume no one is going to need these details, although we could fake
             * appropriate values if need be.
             */
            // ID of device containing file
            this.dev = 0;
            // inode number
            this.ino = 0;
            // device ID (if special file)
            this.rdev = 0;
            // number of hard links
            this.nlink = 1;
            // blocksize for file system I/O
            this.blksize = 4096;
            // @todo Maybe support these? atm, it's a one-user filesystem.
            // user ID of owner
            this.uid = 0;
            // group ID of owner
            this.gid = 0;
            // XXX: Some file systems stash data on stats objects.
            this.fileData = null;
            this.size = size;
            let currentTime = 0;
            if (typeof (atimeMs) !== 'number') {
                currentTime = Date.now();
                atimeMs = currentTime;
            }
            if (typeof (mtimeMs) !== 'number') {
                if (!currentTime) {
                    currentTime = Date.now();
                }
                mtimeMs = currentTime;
            }
            if (typeof (ctimeMs) !== 'number') {
                if (!currentTime) {
                    currentTime = Date.now();
                }
                ctimeMs = currentTime;
            }
            if (typeof (birthtimeMs) !== 'number') {
                if (!currentTime) {
                    currentTime = Date.now();
                }
                birthtimeMs = currentTime;
            }
            this.atimeMs = atimeMs;
            this.ctimeMs = ctimeMs;
            this.mtimeMs = mtimeMs;
            this.birthtimeMs = birthtimeMs;
            if (!mode) {
                switch (itemType) {
                    case FileType.FILE:
                        this.mode = 0x1a4;
                        break;
                    case FileType.DIRECTORY:
                    default:
                        this.mode = 0x1ff;
                }
            }
            else {
                this.mode = mode;
            }
            // number of 512B blocks allocated
            this.blocks = Math.ceil(size / 512);
            // Check if mode also includes top-most bits, which indicate the file's
            // type.
            if (this.mode < 0x1000) {
                this.mode |= itemType;
            }
        }
        static fromBuffer(buffer) {
            const size = buffer.readUInt32LE(0), mode = buffer.readUInt32LE(4), atime = buffer.readDoubleLE(8), mtime = buffer.readDoubleLE(16), ctime = buffer.readDoubleLE(24);
            return new Stats(mode & 0xF000, size, mode & 0xFFF, atime, mtime, ctime);
        }
        /**
         * Clones the stats object.
         */
        static clone(s) {
            return new Stats(s.mode & 0xF000, s.size, s.mode & 0xFFF, s.atimeMs, s.mtimeMs, s.ctimeMs, s.birthtimeMs);
        }
        get atime() {
            return new Date(this.atimeMs);
        }
        get mtime() {
            return new Date(this.mtimeMs);
        }
        get ctime() {
            return new Date(this.ctimeMs);
        }
        get birthtime() {
            return new Date(this.birthtimeMs);
        }
        toBuffer() {
            const buffer = Buffer.alloc(32);
            buffer.writeUInt32LE(this.size, 0);
            buffer.writeUInt32LE(this.mode, 4);
            buffer.writeDoubleLE(this.atime.getTime(), 8);
            buffer.writeDoubleLE(this.mtime.getTime(), 16);
            buffer.writeDoubleLE(this.ctime.getTime(), 24);
            return buffer;
        }
        /**
         * @return [Boolean] True if this item is a file.
         */
        isFile() {
            return (this.mode & 0xF000) === FileType.FILE;
        }
        /**
         * @return [Boolean] True if this item is a directory.
         */
        isDirectory() {
            return (this.mode & 0xF000) === FileType.DIRECTORY;
        }
        /**
         * @return [Boolean] True if this item is a symbolic link (only valid through lstat)
         */
        isSymbolicLink() {
            return (this.mode & 0xF000) === FileType.SYMLINK;
        }
        /**
         * Change the mode of the file. We use this helper function to prevent messing
         * up the type of the file, which is encoded in mode.
         */
        chmod(mode) {
            this.mode = (this.mode & 0xF000) | mode;
        }
        // We don't support the following types of files.
        isSocket() {
            return false;
        }
        isBlockDevice() {
            return false;
        }
        isCharacterDevice() {
            return false;
        }
        isFIFO() {
            return false;
        }
    }


    return files.Stats = Stats;
});
define('skylark-data-files/file-system',[
    "skylark-langx-funcs/defer",
    "skylark-langx-binary/buffer",
    "skylark-langx-paths/path",
    "./files",
    './error-codes',
    "./file-error",
    './file-flag',
    './stats'
], function (setImmediate,Buffer, path, files,ErrorCodes,FileError, FileFlag,  Stats) {
    'use strict';


    /** Used for unit testing. Defaults to a NOP. */
    let wrapCbHook = function (cb, numArgs) {
        return cb;
    };
    /**
     * Wraps a callback function, ensuring it is invoked through setImmediate.
     * @hidden
     */
    function wrapCb(cb, numArgs) {
        if (typeof cb !== 'function') {
            throw new Error('Callback must be a function.');
        }
        const hookedCb = wrapCbHook(cb, numArgs);
        // We could use `arguments`, but Function.call/apply is expensive. And we only
        // need to handle 1-3 arguments
        switch (numArgs) {
            case 1:
                return function (arg1) {
                    setImmediate(function () {
                        return hookedCb(arg1);
                    });
                };
            case 2:
                return function (arg1, arg2) {
                    setImmediate(function () {
                        return hookedCb(arg1, arg2);
                    });
                };
            case 3:
                return function (arg1, arg2, arg3) {
                    setImmediate(function () {
                        return hookedCb(arg1, arg2, arg3);
                    });
                };
            default:
                throw new Error('Invalid invocation of wrapCb.');
        }
    }
    /**
     * @hidden
     */
    function assertRoot(fs) {
        if (fs) {
            return fs;
        }
        throw new FileError(ErrorCodes.EIO, `Initialize BrowserFS with a file system using BrowserFS.initialize(filesystem)`);
    }
    /**
     * @hidden
     */
    function normalizeMode(mode, def) {
        switch (typeof mode) {
            case 'number':
                // (path, flag, mode, cb?)
                return mode;
            case 'string':
                // (path, flag, modeString, cb?)
                const trueMode = parseInt(mode, 8);
                if (!isNaN(trueMode)) {
                    return trueMode;
                }
                // Invalid string.
                return def;
            default:
                return def;
        }
    }
    /**
     * @hidden
     */
    function normalizeTime(time) {
        if (time instanceof Date) {
            return time;
        }
        else if (typeof time === 'number') {
            return new Date(time * 1000);
        }
        else {
            throw new FileError(ErrorCodes.EINVAL, `Invalid time.`);
        }
    }
    /**
     * @hidden
     */
    function normalizePath(p) {
        // Node doesn't allow null characters in paths.
        if (p.indexOf('\u0000') >= 0) {
            throw new FileError(ErrorCodes.EINVAL, 'Path must be a string without null bytes.');
        }
        else if (p === '') {
            throw new FileError(ErrorCodes.EINVAL, 'Path must not be empty.');
        }
        return path.resolve(p);
    }
    /**
     * @hidden
     */
    function normalizeOptions(options, defEnc, defFlag, defMode) {
        // typeof null === 'object' so special-case handing is needed.
        switch (options === null ? 'null' : typeof options) {
            case 'object':
                return {
                    encoding: typeof options['encoding'] !== 'undefined' ? options['encoding'] : defEnc,
                    flag: typeof options['flag'] !== 'undefined' ? options['flag'] : defFlag,
                    mode: normalizeMode(options['mode'], defMode)
                };
            case 'string':
                return {
                    encoding: options,
                    flag: defFlag,
                    mode: defMode
                };
            case 'null':
            case 'undefined':
            case 'function':
                return {
                    encoding: defEnc,
                    flag: defFlag,
                    mode: defMode
                };
            default:
                throw new TypeError(`"options" must be a string or an object, got ${typeof options} instead.`);
        }
    }
    /**
     * The default callback is a NOP.
     * @hidden
     * @private
     */
    function nopCb() {
        // NOP.
    }
    /**
     * The node frontend to all filesystems.
     * This layer handles:
     *
     * * Sanity checking inputs.
     * * Normalizing paths.
     * * Resetting stack depth for asynchronous operations which may not go through
     *   the browser by wrapping all input callbacks using `setImmediate`.
     * * Performing the requested operation through the filesystem or the file
     *   descriptor, as appropriate.
     * * Handling optional arguments and setting default arguments.
     * @see http://nodejs.org/api/fs.html
     */
    class FileSystem {
        constructor() {
            /* tslint:enable:variable-name */
            this.F_OK = 0;
            this.R_OK = 4;
            this.W_OK = 2;
            this.X_OK = 1;
            this.root = null;
            this.fdMap = {};
            this.nextFd = 100;
        }
        initialize(rootFS) {
            if (!rootFS.constructor.isAvailable()) {
                throw new FileError(ErrorCodes.EINVAL, 'Tried to instantiate BrowserFS with an unavailable file system.');
            }
            return this.root = rootFS;
        }
        /**
         * converts Date or number to a fractional UNIX timestamp
         * Grabbed from NodeJS sources (lib/fs.js)
         */
        _toUnixTimestamp(time) {
            if (typeof time === 'number') {
                return time;
            }
            else if (time instanceof Date) {
                return time.getTime() / 1000;
            }
            throw new Error("Cannot parse time: " + time);
        }
        /**
         * **NONSTANDARD**: Grab the FileSystem instance that backs this API.
         * @return [BrowserFS.FileSystem | null] Returns null if the file system has
         *   not been initialized.
         */
        getRootFS() {
            if (this.root) {
                return this.root;
            }
            else {
                return null;
            }
        }
        // FILE OR DIRECTORY METHODS
        /**
         * Asynchronous rename. No arguments other than a possible exception are given
         * to the completion callback.
         * @param oldPath
         * @param newPath
         * @param callback
         */
        rename(oldPath, newPath, cb = nopCb) {
            const newCb = wrapCb(cb, 1);
            try {
                assertRoot(this.root).rename(normalizePath(oldPath), normalizePath(newPath), newCb);
            }
            catch (e) {
                newCb(e);
            }
        }
        /**
         * Synchronous rename.
         * @param oldPath
         * @param newPath
         */
        renameSync(oldPath, newPath) {
            assertRoot(this.root).renameSync(normalizePath(oldPath), normalizePath(newPath));
        }
        /**
         * Test whether or not the given path exists by checking with the file system.
         * Then call the callback argument with either true or false.
         * @example Sample invocation
         *   fs.exists('/etc/passwd', function (exists) {
         *     util.debug(exists ? "it's there" : "no passwd!");
         *   });
         * @param path
         * @param callback
         */
        exists(path, cb = nopCb) {
            const newCb = wrapCb(cb, 1);
            try {
                return assertRoot(this.root).exists(normalizePath(path), newCb);
            }
            catch (e) {
                // Doesn't return an error. If something bad happens, we assume it just
                // doesn't exist.
                return newCb(false);
            }
        }
        /**
         * Test whether or not the given path exists by checking with the file system.
         * @param path
         * @return [boolean]
         */
        existsSync(path) {
            try {
                return assertRoot(this.root).existsSync(normalizePath(path));
            }
            catch (e) {
                // Doesn't return an error. If something bad happens, we assume it just
                // doesn't exist.
                return false;
            }
        }
        /**
         * Asynchronous `stat`.
         * @param path
         * @param callback
         */
        stat(path, cb = nopCb) {
            const newCb = wrapCb(cb, 2);
            try {
                return assertRoot(this.root).stat(normalizePath(path), false, newCb);
            }
            catch (e) {
                return newCb(e);
            }
        }
        /**
         * Synchronous `stat`.
         * @param path
         * @return [BrowserFS.node.fs.Stats]
         */
        statSync(path) {
            return assertRoot(this.root).statSync(normalizePath(path), false);
        }
        /**
         * Asynchronous `lstat`.
         * `lstat()` is identical to `stat()`, except that if path is a symbolic link,
         * then the link itself is stat-ed, not the file that it refers to.
         * @param path
         * @param callback
         */
        lstat(path, cb = nopCb) {
            const newCb = wrapCb(cb, 2);
            try {
                return assertRoot(this.root).stat(normalizePath(path), true, newCb);
            }
            catch (e) {
                return newCb(e);
            }
        }
        /**
         * Synchronous `lstat`.
         * `lstat()` is identical to `stat()`, except that if path is a symbolic link,
         * then the link itself is stat-ed, not the file that it refers to.
         * @param path
         * @return [BrowserFS.node.fs.Stats]
         */
        lstatSync(path) {
            return assertRoot(this.root).statSync(normalizePath(path), true);
        }
        truncate(path, arg2 = 0, cb = nopCb) {
            let len = 0;
            if (typeof arg2 === 'function') {
                cb = arg2;
            }
            else if (typeof arg2 === 'number') {
                len = arg2;
            }
            const newCb = wrapCb(cb, 1);
            try {
                if (len < 0) {
                    throw new FileError(ErrorCodes.EINVAL);
                }
                return assertRoot(this.root).truncate(normalizePath(path), len, newCb);
            }
            catch (e) {
                return newCb(e);
            }
        }
        /**
         * Synchronous `truncate`.
         * @param path
         * @param len
         */
        truncateSync(path, len = 0) {
            if (len < 0) {
                throw new FileError(ErrorCodes.EINVAL);
            }
            return assertRoot(this.root).truncateSync(normalizePath(path), len);
        }
        /**
         * Asynchronous `unlink`.
         * @param path
         * @param callback
         */
        unlink(path, cb = nopCb) {
            const newCb = wrapCb(cb, 1);
            try {
                return assertRoot(this.root).unlink(normalizePath(path), newCb);
            }
            catch (e) {
                return newCb(e);
            }
        }
        /**
         * Synchronous `unlink`.
         * @param path
         */
        unlinkSync(path) {
            return assertRoot(this.root).unlinkSync(normalizePath(path));
        }
        open(path, flag, arg2, cb = nopCb) {
            const mode = normalizeMode(arg2, 0x1a4);
            cb = typeof arg2 === 'function' ? arg2 : cb;
            const newCb = wrapCb(cb, 2);
            try {
                assertRoot(this.root).open(normalizePath(path), FileFlag.getFileFlag(flag), mode, (e, file) => {
                    if (file) {
                        newCb(e, this.getFdForFile(file));
                    }
                    else {
                        newCb(e);
                    }
                });
            }
            catch (e) {
                newCb(e);
            }
        }
        /**
         * Synchronous file open.
         * @see http://www.manpagez.com/man/2/open/
         * @param path
         * @param flags
         * @param mode defaults to `0644`
         * @return [BrowserFS.File]
         */
        openSync(path, flag, mode = 0x1a4) {
            return this.getFdForFile(assertRoot(this.root).openSync(normalizePath(path), FileFlag.getFileFlag(flag), normalizeMode(mode, 0x1a4)));
        }
        readFile(filename, arg2 = {}, cb = nopCb) {
            const options = normalizeOptions(arg2, null, 'r', null);
            cb = typeof arg2 === 'function' ? arg2 : cb;
            const newCb = wrapCb(cb, 2);
            try {
                const flag = FileFlag.getFileFlag(options['flag']);
                if (!flag.isReadable()) {
                    return newCb(new FileError(ErrorCodes.EINVAL, 'Flag passed to readFile must allow for reading.'));
                }
                return assertRoot(this.root).readFile(normalizePath(filename), options.encoding, flag, newCb);
            }
            catch (e) {
                return newCb(e);
            }
        }
        readFileSync(filename, arg2 = {}) {
            const options = normalizeOptions(arg2, null, 'r', null);
            const flag = FileFlag.getFileFlag(options.flag);
            if (!flag.isReadable()) {
                throw new FileError(ErrorCodes.EINVAL, 'Flag passed to readFile must allow for reading.');
            }
            return assertRoot(this.root).readFileSync(normalizePath(filename), options.encoding, flag);
        }
        writeFile(filename, data, arg3 = {}, cb = nopCb) {
            const options = normalizeOptions(arg3, 'utf8', 'w', 0x1a4);
            cb = typeof arg3 === 'function' ? arg3 : cb;
            const newCb = wrapCb(cb, 1);
            try {
                const flag = FileFlag.getFileFlag(options.flag);
                if (!flag.isWriteable()) {
                    return newCb(new FileError(ErrorCodes.EINVAL, 'Flag passed to writeFile must allow for writing.'));
                }
                return assertRoot(this.root).writeFile(normalizePath(filename), data, options.encoding, flag, options.mode, newCb);
            }
            catch (e) {
                return newCb(e);
            }
        }
        writeFileSync(filename, data, arg3) {
            const options = normalizeOptions(arg3, 'utf8', 'w', 0x1a4);
            const flag = FileFlag.getFileFlag(options.flag);
            if (!flag.isWriteable()) {
                throw new FileError(ErrorCodes.EINVAL, 'Flag passed to writeFile must allow for writing.');
            }
            return assertRoot(this.root).writeFileSync(normalizePath(filename), data, options.encoding, flag, options.mode);
        }
        appendFile(filename, data, arg3, cb = nopCb) {
            const options = normalizeOptions(arg3, 'utf8', 'a', 0x1a4);
            cb = typeof arg3 === 'function' ? arg3 : cb;
            const newCb = wrapCb(cb, 1);
            try {
                const flag = FileFlag.getFileFlag(options.flag);
                if (!flag.isAppendable()) {
                    return newCb(new FileError(ErrorCodes.EINVAL, 'Flag passed to appendFile must allow for appending.'));
                }
                assertRoot(this.root).appendFile(normalizePath(filename), data, options.encoding, flag, options.mode, newCb);
            }
            catch (e) {
                newCb(e);
            }
        }
        appendFileSync(filename, data, arg3) {
            const options = normalizeOptions(arg3, 'utf8', 'a', 0x1a4);
            const flag = FileFlag.getFileFlag(options.flag);
            if (!flag.isAppendable()) {
                throw new FileError(ErrorCodes.EINVAL, 'Flag passed to appendFile must allow for appending.');
            }
            return assertRoot(this.root).appendFileSync(normalizePath(filename), data, options.encoding, flag, options.mode);
        }
        // FILE DESCRIPTOR METHODS
        /**
         * Asynchronous `fstat`.
         * `fstat()` is identical to `stat()`, except that the file to be stat-ed is
         * specified by the file descriptor `fd`.
         * @param fd
         * @param callback
         */
        fstat(fd, cb = nopCb) {
            const newCb = wrapCb(cb, 2);
            try {
                const file = this.fd2file(fd);
                file.stat(newCb);
            }
            catch (e) {
                newCb(e);
            }
        }
        /**
         * Synchronous `fstat`.
         * `fstat()` is identical to `stat()`, except that the file to be stat-ed is
         * specified by the file descriptor `fd`.
         * @param fd
         * @return [BrowserFS.node.fs.Stats]
         */
        fstatSync(fd) {
            return this.fd2file(fd).statSync();
        }
        /**
         * Asynchronous close.
         * @param fd
         * @param callback
         */
        close(fd, cb = nopCb) {
            const newCb = wrapCb(cb, 1);
            try {
                this.fd2file(fd).close((e) => {
                    if (!e) {
                        this.closeFd(fd);
                    }
                    newCb(e);
                });
            }
            catch (e) {
                newCb(e);
            }
        }
        /**
         * Synchronous close.
         * @param fd
         */
        closeSync(fd) {
            this.fd2file(fd).closeSync();
            this.closeFd(fd);
        }
        ftruncate(fd, arg2, cb = nopCb) {
            const length = typeof arg2 === 'number' ? arg2 : 0;
            cb = typeof arg2 === 'function' ? arg2 : cb;
            const newCb = wrapCb(cb, 1);
            try {
                const file = this.fd2file(fd);
                if (length < 0) {
                    throw new FileError(ErrorCodes.EINVAL);
                }
                file.truncate(length, newCb);
            }
            catch (e) {
                newCb(e);
            }
        }
        /**
         * Synchronous ftruncate.
         * @param fd
         * @param len
         */
        ftruncateSync(fd, len = 0) {
            const file = this.fd2file(fd);
            if (len < 0) {
                throw new FileError(ErrorCodes.EINVAL);
            }
            file.truncateSync(len);
        }
        /**
         * Asynchronous fsync.
         * @param fd
         * @param callback
         */
        fsync(fd, cb = nopCb) {
            const newCb = wrapCb(cb, 1);
            try {
                this.fd2file(fd).sync(newCb);
            }
            catch (e) {
                newCb(e);
            }
        }
        /**
         * Synchronous fsync.
         * @param fd
         */
        fsyncSync(fd) {
            this.fd2file(fd).syncSync();
        }
        /**
         * Asynchronous fdatasync.
         * @param fd
         * @param callback
         */
        fdatasync(fd, cb = nopCb) {
            const newCb = wrapCb(cb, 1);
            try {
                this.fd2file(fd).datasync(newCb);
            }
            catch (e) {
                newCb(e);
            }
        }
        /**
         * Synchronous fdatasync.
         * @param fd
         */
        fdatasyncSync(fd) {
            this.fd2file(fd).datasyncSync();
        }
        write(fd, arg2, arg3, arg4, arg5, cb = nopCb) {
            let buffer, offset, length, position = null;
            if (typeof arg2 === 'string') {
                // Signature 1: (fd, string, [position?, [encoding?]], cb?)
                let encoding = 'utf8';
                switch (typeof arg3) {
                    case 'function':
                        // (fd, string, cb)
                        cb = arg3;
                        break;
                    case 'number':
                        // (fd, string, position, encoding?, cb?)
                        position = arg3;
                        encoding = typeof arg4 === 'string' ? arg4 : 'utf8';
                        cb = typeof arg5 === 'function' ? arg5 : cb;
                        break;
                    default:
                        // ...try to find the callback and get out of here!
                        cb = typeof arg4 === 'function' ? arg4 : typeof arg5 === 'function' ? arg5 : cb;
                        return cb(new FileError(ErrorCodes.EINVAL, 'Invalid arguments.'));
                }
                buffer = Buffer.from(arg2, encoding);
                offset = 0;
                length = buffer.length;
            }
            else {
                // Signature 2: (fd, buffer, offset, length, position?, cb?)
                buffer = arg2;
                offset = arg3;
                length = arg4;
                position = typeof arg5 === 'number' ? arg5 : null;
                cb = typeof arg5 === 'function' ? arg5 : cb;
            }
            const newCb = wrapCb(cb, 3);
            try {
                const file = this.fd2file(fd);
                if (position === undefined || position === null) {
                    position = file.getPos();
                }
                file.write(buffer, offset, length, position, newCb);
            }
            catch (e) {
                newCb(e);
            }
        }
        writeSync(fd, arg2, arg3, arg4, arg5) {
            let buffer, offset = 0, length, position;
            if (typeof arg2 === 'string') {
                // Signature 1: (fd, string, [position?, [encoding?]])
                position = typeof arg3 === 'number' ? arg3 : null;
                const encoding = typeof arg4 === 'string' ? arg4 : 'utf8';
                offset = 0;
                buffer = Buffer.from(arg2, encoding);
                length = buffer.length;
            }
            else {
                // Signature 2: (fd, buffer, offset, length, position?)
                buffer = arg2;
                offset = arg3;
                length = arg4;
                position = typeof arg5 === 'number' ? arg5 : null;
            }
            const file = this.fd2file(fd);
            if (position === undefined || position === null) {
                position = file.getPos();
            }
            return file.writeSync(buffer, offset, length, position);
        }
        read(fd, arg2, arg3, arg4, arg5, cb = nopCb) {
            let position, offset, length, buffer, newCb;
            if (typeof arg2 === 'number') {
                // legacy interface
                // (fd, length, position, encoding, callback)
                length = arg2;
                position = arg3;
                const encoding = arg4;
                cb = typeof arg5 === 'function' ? arg5 : cb;
                offset = 0;
                buffer = Buffer.alloc(length);
                // XXX: Inefficient.
                // Wrap the cb so we shelter upper layers of the API from these
                // shenanigans.
                newCb = wrapCb((err, bytesRead, buf) => {
                    if (err) {
                        return cb(err);
                    }
                    cb(err, buf.toString(encoding), bytesRead);
                }, 3);
            }
            else {
                buffer = arg2;
                offset = arg3;
                length = arg4;
                position = arg5;
                newCb = wrapCb(cb, 3);
            }
            try {
                const file = this.fd2file(fd);
                if (position === undefined || position === null) {
                    position = file.getPos();
                }
                file.read(buffer, offset, length, position, newCb);
            }
            catch (e) {
                newCb(e);
            }
        }
        readSync(fd, arg2, arg3, arg4, arg5) {
            let shenanigans = false;
            let buffer, offset, length, position, encoding = 'utf8';
            if (typeof arg2 === 'number') {
                length = arg2;
                position = arg3;
                encoding = arg4;
                offset = 0;
                buffer = Buffer.alloc(length);
                shenanigans = true;
            }
            else {
                buffer = arg2;
                offset = arg3;
                length = arg4;
                position = arg5;
            }
            const file = this.fd2file(fd);
            if (position === undefined || position === null) {
                position = file.getPos();
            }
            const rv = file.readSync(buffer, offset, length, position);
            if (!shenanigans) {
                return rv;
            }
            else {
                return [buffer.toString(encoding), rv];
            }
        }
        /**
         * Asynchronous `fchown`.
         * @param fd
         * @param uid
         * @param gid
         * @param callback
         */
        fchown(fd, uid, gid, callback = nopCb) {
            const newCb = wrapCb(callback, 1);
            try {
                this.fd2file(fd).chown(uid, gid, newCb);
            }
            catch (e) {
                newCb(e);
            }
        }
        /**
         * Synchronous `fchown`.
         * @param fd
         * @param uid
         * @param gid
         */
        fchownSync(fd, uid, gid) {
            this.fd2file(fd).chownSync(uid, gid);
        }
        /**
         * Asynchronous `fchmod`.
         * @param fd
         * @param mode
         * @param callback
         */
        fchmod(fd, mode, cb) {
            const newCb = wrapCb(cb, 1);
            try {
                const numMode = typeof mode === 'string' ? parseInt(mode, 8) : mode;
                this.fd2file(fd).chmod(numMode, newCb);
            }
            catch (e) {
                newCb(e);
            }
        }
        /**
         * Synchronous `fchmod`.
         * @param fd
         * @param mode
         */
        fchmodSync(fd, mode) {
            const numMode = typeof mode === 'string' ? parseInt(mode, 8) : mode;
            this.fd2file(fd).chmodSync(numMode);
        }
        /**
         * Change the file timestamps of a file referenced by the supplied file
         * descriptor.
         * @param fd
         * @param atime
         * @param mtime
         * @param callback
         */
        futimes(fd, atime, mtime, cb = nopCb) {
            const newCb = wrapCb(cb, 1);
            try {
                const file = this.fd2file(fd);
                if (typeof atime === 'number') {
                    atime = new Date(atime * 1000);
                }
                if (typeof mtime === 'number') {
                    mtime = new Date(mtime * 1000);
                }
                file.utimes(atime, mtime, newCb);
            }
            catch (e) {
                newCb(e);
            }
        }
        /**
         * Change the file timestamps of a file referenced by the supplied file
         * descriptor.
         * @param fd
         * @param atime
         * @param mtime
         */
        futimesSync(fd, atime, mtime) {
            this.fd2file(fd).utimesSync(normalizeTime(atime), normalizeTime(mtime));
        }
        // DIRECTORY-ONLY METHODS
        /**
         * Asynchronous `rmdir`.
         * @param path
         * @param callback
         */
        rmdir(path, cb = nopCb) {
            const newCb = wrapCb(cb, 1);
            try {
                path = normalizePath(path);
                assertRoot(this.root).rmdir(path, newCb);
            }
            catch (e) {
                newCb(e);
            }
        }
        /**
         * Synchronous `rmdir`.
         * @param path
         */
        rmdirSync(path) {
            path = normalizePath(path);
            return assertRoot(this.root).rmdirSync(path);
        }
        /**
         * Asynchronous `mkdir`.
         * @param path
         * @param mode defaults to `0777`
         * @param callback
         */
        mkdir(path, mode, cb = nopCb) {
            if (typeof mode === 'function') {
                cb = mode;
                mode = 0x1ff;
            }
            const newCb = wrapCb(cb, 1);
            try {
                path = normalizePath(path);
                assertRoot(this.root).mkdir(path, mode, newCb);
            }
            catch (e) {
                newCb(e);
            }
        }
        /**
         * Synchronous `mkdir`.
         * @param path
         * @param mode defaults to `0777`
         */
        mkdirSync(path, mode) {
            assertRoot(this.root).mkdirSync(normalizePath(path), normalizeMode(mode, 0x1ff));
        }
        /**
         * Asynchronous `readdir`. Reads the contents of a directory.
         * The callback gets two arguments `(err, files)` where `files` is an array of
         * the names of the files in the directory excluding `'.'` and `'..'`.
         * @param path
         * @param callback
         */
        readdir(path, cb = nopCb) {
            const newCb = wrapCb(cb, 2);
            try {
                path = normalizePath(path);
                assertRoot(this.root).readdir(path, newCb);
            }
            catch (e) {
                newCb(e);
            }
        }
        /**
         * Synchronous `readdir`. Reads the contents of a directory.
         * @param path
         * @return [String[]]
         */
        readdirSync(path) {
            path = normalizePath(path);
            return assertRoot(this.root).readdirSync(path);
        }
        // SYMLINK METHODS
        /**
         * Asynchronous `link`.
         * @param srcpath
         * @param dstpath
         * @param callback
         */
        link(srcpath, dstpath, cb = nopCb) {
            const newCb = wrapCb(cb, 1);
            try {
                srcpath = normalizePath(srcpath);
                dstpath = normalizePath(dstpath);
                assertRoot(this.root).link(srcpath, dstpath, newCb);
            }
            catch (e) {
                newCb(e);
            }
        }
        /**
         * Synchronous `link`.
         * @param srcpath
         * @param dstpath
         */
        linkSync(srcpath, dstpath) {
            srcpath = normalizePath(srcpath);
            dstpath = normalizePath(dstpath);
            return assertRoot(this.root).linkSync(srcpath, dstpath);
        }
        symlink(srcpath, dstpath, arg3, cb = nopCb) {
            const type = typeof arg3 === 'string' ? arg3 : 'file';
            cb = typeof arg3 === 'function' ? arg3 : cb;
            const newCb = wrapCb(cb, 1);
            try {
                if (type !== 'file' && type !== 'dir') {
                    return newCb(new FileError(ErrorCodes.EINVAL, "Invalid type: " + type));
                }
                srcpath = normalizePath(srcpath);
                dstpath = normalizePath(dstpath);
                assertRoot(this.root).symlink(srcpath, dstpath, type, newCb);
            }
            catch (e) {
                newCb(e);
            }
        }
        /**
         * Synchronous `symlink`.
         * @param srcpath
         * @param dstpath
         * @param type can be either `'dir'` or `'file'` (default is `'file'`)
         */
        symlinkSync(srcpath, dstpath, type) {
            if (!type) {
                type = 'file';
            }
            else if (type !== 'file' && type !== 'dir') {
                throw new FileError(ErrorCodes.EINVAL, "Invalid type: " + type);
            }
            srcpath = normalizePath(srcpath);
            dstpath = normalizePath(dstpath);
            return assertRoot(this.root).symlinkSync(srcpath, dstpath, type);
        }
        /**
         * Asynchronous readlink.
         * @param path
         * @param callback
         */
        readlink(path, cb = nopCb) {
            const newCb = wrapCb(cb, 2);
            try {
                path = normalizePath(path);
                assertRoot(this.root).readlink(path, newCb);
            }
            catch (e) {
                newCb(e);
            }
        }
        /**
         * Synchronous readlink.
         * @param path
         * @return [String]
         */
        readlinkSync(path) {
            path = normalizePath(path);
            return assertRoot(this.root).readlinkSync(path);
        }
        // PROPERTY OPERATIONS
        /**
         * Asynchronous `chown`.
         * @param path
         * @param uid
         * @param gid
         * @param callback
         */
        chown(path, uid, gid, cb = nopCb) {
            const newCb = wrapCb(cb, 1);
            try {
                path = normalizePath(path);
                assertRoot(this.root).chown(path, false, uid, gid, newCb);
            }
            catch (e) {
                newCb(e);
            }
        }
        /**
         * Synchronous `chown`.
         * @param path
         * @param uid
         * @param gid
         */
        chownSync(path, uid, gid) {
            path = normalizePath(path);
            assertRoot(this.root).chownSync(path, false, uid, gid);
        }
        /**
         * Asynchronous `lchown`.
         * @param path
         * @param uid
         * @param gid
         * @param callback
         */
        lchown(path, uid, gid, cb = nopCb) {
            const newCb = wrapCb(cb, 1);
            try {
                path = normalizePath(path);
                assertRoot(this.root).chown(path, true, uid, gid, newCb);
            }
            catch (e) {
                newCb(e);
            }
        }
        /**
         * Synchronous `lchown`.
         * @param path
         * @param uid
         * @param gid
         */
        lchownSync(path, uid, gid) {
            path = normalizePath(path);
            assertRoot(this.root).chownSync(path, true, uid, gid);
        }
        /**
         * Asynchronous `chmod`.
         * @param path
         * @param mode
         * @param callback
         */
        chmod(path, mode, cb = nopCb) {
            const newCb = wrapCb(cb, 1);
            try {
                const numMode = normalizeMode(mode, -1);
                if (numMode < 0) {
                    throw new FileError(ErrorCodes.EINVAL, `Invalid mode.`);
                }
                assertRoot(this.root).chmod(normalizePath(path), false, numMode, newCb);
            }
            catch (e) {
                newCb(e);
            }
        }
        /**
         * Synchronous `chmod`.
         * @param path
         * @param mode
         */
        chmodSync(path, mode) {
            const numMode = normalizeMode(mode, -1);
            if (numMode < 0) {
                throw new FileError(ErrorCodes.EINVAL, `Invalid mode.`);
            }
            path = normalizePath(path);
            assertRoot(this.root).chmodSync(path, false, numMode);
        }
        /**
         * Asynchronous `lchmod`.
         * @param path
         * @param mode
         * @param callback
         */
        lchmod(path, mode, cb = nopCb) {
            const newCb = wrapCb(cb, 1);
            try {
                const numMode = normalizeMode(mode, -1);
                if (numMode < 0) {
                    throw new FileError(ErrorCodes.EINVAL, `Invalid mode.`);
                }
                assertRoot(this.root).chmod(normalizePath(path), true, numMode, newCb);
            }
            catch (e) {
                newCb(e);
            }
        }
        /**
         * Synchronous `lchmod`.
         * @param path
         * @param mode
         */
        lchmodSync(path, mode) {
            const numMode = normalizeMode(mode, -1);
            if (numMode < 1) {
                throw new FileError(ErrorCodes.EINVAL, `Invalid mode.`);
            }
            assertRoot(this.root).chmodSync(normalizePath(path), true, numMode);
        }
        /**
         * Change file timestamps of the file referenced by the supplied path.
         * @param path
         * @param atime
         * @param mtime
         * @param callback
         */
        utimes(path, atime, mtime, cb = nopCb) {
            const newCb = wrapCb(cb, 1);
            try {
                assertRoot(this.root).utimes(normalizePath(path), normalizeTime(atime), normalizeTime(mtime), newCb);
            }
            catch (e) {
                newCb(e);
            }
        }
        /**
         * Change file timestamps of the file referenced by the supplied path.
         * @param path
         * @param atime
         * @param mtime
         */
        utimesSync(path, atime, mtime) {
            assertRoot(this.root).utimesSync(normalizePath(path), normalizeTime(atime), normalizeTime(mtime));
        }
        realpath(path, arg2, cb = nopCb) {
            const cache = typeof (arg2) === 'object' ? arg2 : {};
            cb = typeof (arg2) === 'function' ? arg2 : nopCb;
            const newCb = wrapCb(cb, 2);
            try {
                path = normalizePath(path);
                assertRoot(this.root).realpath(path, cache, newCb);
            }
            catch (e) {
                newCb(e);
            }
        }
        /**
         * Synchronous `realpath`.
         * @param path
         * @param cache An object literal of mapped paths that can be used to
         *   force a specific path resolution or avoid additional `fs.stat` calls for
         *   known real paths.
         * @return [String]
         */
        realpathSync(path, cache = {}) {
            path = normalizePath(path);
            return assertRoot(this.root).realpathSync(path, cache);
        }
        watchFile(filename, arg2, listener = nopCb) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        unwatchFile(filename, listener = nopCb) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        watch(filename, arg2, listener = nopCb) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        access(path, arg2, cb = nopCb) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        accessSync(path, mode) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        createReadStream(path, options) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        createWriteStream(path, options) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        /**
         * For unit testing. Passes all incoming callbacks to cbWrapper for wrapping.
         */
        wrapCallbacks(cbWrapper) {
            wrapCbHook = cbWrapper;
        }
        getFdForFile(file) {
            const fd = this.nextFd++;
            this.fdMap[fd] = file;
            return fd;
        }
        fd2file(fd) {
            const rv = this.fdMap[fd];
            if (rv) {
                return rv;
            }
            else {
                throw new FileError(ErrorCodes.EBADF, 'Invalid file descriptor.');
            }
        }
        closeFd(fd) {
            delete this.fdMap[fd];
        }
    }
    
    return files.FileSystem = FileSystem;
});
define('skylark-data-files/utils',[
    "skylark-langx-binary/buffer",
    "skylark-langx-paths",
    './file-error',
    './error-codes'
], function (Buffer,paths, FileError, ErrorCodes) {
    'use strict';

    function deprecationMessage(print, fsName, opts) {
        if (print) {
            // tslint:disable-next-line:no-console
            console.warn(`[${fsName}] Direct file system constructor usage is deprecated for this file system, and will be removed in the next major version. Please use the '${fsName}.Create(${JSON.stringify(opts)}, callback)' method instead. See https://github.com/jvilk/BrowserFS/issues/176 for more details.`);
            // tslint:enable-next-line:no-console
        }
    }
    /**
     * Checks for any IE version, including IE11 which removed MSIE from the
     * userAgent string.
     * @hidden
     */
    const isIE = typeof navigator !== "undefined" && !!(/(msie) ([\w.]+)/.exec(navigator.userAgent.toLowerCase()) || navigator.userAgent.indexOf('Trident') !== -1);
    /**
     * Check if we're in a web worker.
     * @hidden
     */
    const isWebWorker = typeof window === "undefined";
    /**
     * Throws an exception. Called on code paths that should be impossible.
     * @hidden
     */
    function fail() {
        throw new Error("BFS has reached an impossible code path; please file a bug.");
    }
    /**
     * Synchronous recursive makedir.
     * @hidden
     */
    function mkdirpSync(p, mode, fs) {
        if (!fs.existsSync(p)) {
            mkdirpSync(path.dirname(p), mode, fs);
            fs.mkdirSync(p, mode);
        }
    }
    /**
     * Converts a buffer into an array buffer. Attempts to do so in a
     * zero-copy manner, e.g. the array references the same memory.
     * @hidden
     */
    function buffer2ArrayBuffer(buff) {
        const u8 = buffer2Uint8array(buff), u8offset = u8.byteOffset, u8Len = u8.byteLength;
        if (u8offset === 0 && u8Len === u8.buffer.byteLength) {
            return u8.buffer;
        }
        else {
            return u8.buffer.slice(u8offset, u8offset + u8Len);
        }
    }
    /**
     * Converts a buffer into a Uint8Array. Attempts to do so in a
     * zero-copy manner, e.g. the array references the same memory.
     * @hidden
     */
    function buffer2Uint8array(buff) {
        if (buff instanceof Uint8Array) {
            // BFS & Node v4.0 buffers *are* Uint8Arrays.
            return buff;
        }
        else {
            // Uint8Arrays can be constructed from arrayish numbers.
            // At this point, we assume this isn't a BFS array.
            return new Uint8Array(buff);
        }
    }
    /**
     * Converts the given arrayish object into a Buffer. Attempts to
     * be zero-copy.
     * @hidden
     */
    function arrayish2Buffer(arr) {
        if (arr instanceof Buffer) {
            return arr;
        }
        else if (arr instanceof Uint8Array) {
            return uint8Array2Buffer(arr);
        }
        else {
            return Buffer.from(arr);
        }
    }
    /**
     * Converts the given Uint8Array into a Buffer. Attempts to be zero-copy.
     * @hidden
     */
    function uint8Array2Buffer(u8) {
        if (u8 instanceof Buffer) {
            return u8;
        }
        else if (u8.byteOffset === 0 && u8.byteLength === u8.buffer.byteLength) {
            return arrayBuffer2Buffer(u8.buffer);
        }
        else {
            return Buffer.from(u8.buffer, u8.byteOffset, u8.byteLength);
        }
    }
    /**
     * Converts the given array buffer into a Buffer. Attempts to be
     * zero-copy.
     * @hidden
     */
    function arrayBuffer2Buffer(ab) {
        return Buffer.from(ab);
    }
    /**
     * Copies a slice of the given buffer
     * @hidden
     */
    function copyingSlice(buff, start = 0, end = buff.length) {
        if (start < 0 || end < 0 || end > buff.length || start > end) {
            throw new TypeError(`Invalid slice bounds on buffer of length ${buff.length}: [${start}, ${end}]`);
        }
        if (buff.length === 0) {
            // Avoid s0 corner case in ArrayBuffer case.
            return emptyBuffer();
        }
        else {
            const u8 = buffer2Uint8array(buff), s0 = buff[0], newS0 = (s0 + 1) % 0xFF;
            buff[0] = newS0;
            if (u8[0] === newS0) {
                // Same memory. Revert & copy.
                u8[0] = s0;
                return uint8Array2Buffer(u8.slice(start, end));
            }
            else {
                // Revert.
                buff[0] = s0;
                return uint8Array2Buffer(u8.subarray(start, end));
            }
        }
    }
    /**
     * @hidden
     */
    let emptyBuff = null;
    /**
     * Returns an empty buffer.
     * @hidden
     */
    function emptyBuffer() {
        if (emptyBuff) {
            return emptyBuff;
        }
        return emptyBuff = Buffer.alloc(0);
    }
    /**
     * Option validator for a Buffer file system option.
     * @hidden
     */
    function bufferValidator(v, cb) {
        if (Buffer.isBuffer(v)) {
            cb();
        }
        else {
            cb(new FileError(ErrorCodes.EINVAL, `option must be a Buffer.`));
        }
    }
    /**
     * Checks that the given options object is valid for the file system options.
     * @hidden
     */
    function checkOptions(fsType, opts, cb) {
        const optsInfo = fsType.Options;
        const fsName = fsType.Name;
        let pendingValidators = 0;
        let callbackCalled = false;
        let loopEnded = false;
        function validatorCallback(e) {
            if (!callbackCalled) {
                if (e) {
                    callbackCalled = true;
                    cb(e);
                }
                pendingValidators--;
                if (pendingValidators === 0 && loopEnded) {
                    cb();
                }
            }
        }
        // Check for required options.
        for (const optName in optsInfo) {
            if (optsInfo.hasOwnProperty(optName)) {
                const opt = optsInfo[optName];
                const providedValue = opts[optName];
                if (providedValue === undefined || providedValue === null) {
                    if (!opt.optional) {
                        // Required option, not provided.
                        // Any incorrect options provided? Which ones are close to the provided one?
                        // (edit distance 5 === close)
                        const incorrectOptions = Object.keys(opts).filter((o) => !(o in optsInfo)).map((a) => {
                            return { str: a, distance: levenshtein(optName, a) };
                        }).filter((o) => o.distance < 5).sort((a, b) => a.distance - b.distance);
                        // Validators may be synchronous.
                        if (callbackCalled) {
                            return;
                        }
                        callbackCalled = true;
                        return cb(new FileError(ErrorCodes.EINVAL, `[${fsName}] Required option '${optName}' not provided.${incorrectOptions.length > 0 ? ` You provided unrecognized option '${incorrectOptions[0].str}'; perhaps you meant to type '${optName}'.` : ''}\nOption description: ${opt.description}`));
                    }
                    // Else: Optional option, not provided. That is OK.
                }
                else {
                    // Option provided! Check type.
                    let typeMatches = false;
                    if (Array.isArray(opt.type)) {
                        typeMatches = opt.type.indexOf(typeof (providedValue)) !== -1;
                    }
                    else {
                        typeMatches = typeof (providedValue) === opt.type;
                    }
                    if (!typeMatches) {
                        // Validators may be synchronous.
                        if (callbackCalled) {
                            return;
                        }
                        callbackCalled = true;
                        return cb(new FileError(ErrorCodes.EINVAL, `[${fsName}] Value provided for option ${optName} is not the proper type. Expected ${Array.isArray(opt.type) ? `one of {${opt.type.join(", ")}}` : opt.type}, but received ${typeof (providedValue)}\nOption description: ${opt.description}`));
                    }
                    else if (opt.validator) {
                        pendingValidators++;
                        opt.validator(providedValue, validatorCallback);
                    }
                    // Otherwise: All good!
                }
            }
        }
        loopEnded = true;
        if (pendingValidators === 0 && !callbackCalled) {
            cb();
        }
    }

    return {
        deprecationMessage: deprecationMessage,
        isIE: isIE,
        isWebWorker: isWebWorker,
        fail: fail,
        mkdirpSync: mkdirpSync,
        buffer2ArrayBuffer: buffer2ArrayBuffer,
        buffer2Uint8array: buffer2Uint8array,
        arrayish2Buffer: arrayish2Buffer,
        uint8Array2Buffer: uint8Array2Buffer,
        arrayBuffer2Buffer: arrayBuffer2Buffer,
        copyingSlice: copyingSlice,
        emptyBuffer: emptyBuffer,
        bufferValidator: bufferValidator,
        checkOptions: checkOptions
    };
});
define('skylark-data-files/preload-file',[
    "skylark-langx-binary/buffer",
    "./files",
    "./error-codes",
    './file-error',
    "./stats",
    "./base-file",
    './utils'
], function (Buffer,file,ErrorCodes,FileError,Stats,BaseFile, utils) {
    'use strict';

    ////fs     '../core/node_fs',

    const { emptyBuffer } = utils;

    /**
     * An implementation of the File interface that operates on a file that is
     * completely in-memory. PreloadFiles are backed by a Buffer.
     *
     * This is also an abstract class, as it lacks an implementation of 'sync' and
     * 'close'. Each filesystem that wishes to use this file representation must
     * extend this class and implement those two methods.
     * @todo 'close' lever that disables functionality once closed.
     */
    class PreloadFile extends BaseFile {
        /**
         * Creates a file with the given path and, optionally, the given contents. Note
         * that, if contents is specified, it will be mutated by the file!
         * @param _fs The file system that created the file.
         * @param _path
         * @param _mode The mode that the file was opened using.
         *   Dictates permissions and where the file pointer starts.
         * @param _stat The stats object for the given file.
         *   PreloadFile will mutate this object. Note that this object must contain
         *   the appropriate mode that the file was opened as.
         * @param contents A buffer containing the entire
         *   contents of the file. PreloadFile will mutate this buffer. If not
         *   specified, we assume it is a new file.
         */
        constructor(_fs, _path, _flag, _stat, contents) {
            super();
            this._pos = 0;
            this._dirty = false;
            this._fs = _fs;
            this._path = _path;
            this._flag = _flag;
            this._stat = _stat;
            this._buffer = contents ? contents : emptyBuffer();
            // Note: This invariant is *not* maintained once the file starts getting
            // modified.
            // Note: Only actually matters if file is readable, as writeable modes may
            // truncate/append to file.
            if (this._stat.size !== this._buffer.length && this._flag.isReadable()) {
                throw new Error(`Invalid buffer: Buffer is ${this._buffer.length} long, yet Stats object specifies that file is ${this._stat.size} long.`);
            }
        }
        /**
         * NONSTANDARD: Get the underlying buffer for this file. !!DO NOT MUTATE!! Will mess up dirty tracking.
         */
        getBuffer() {
            return this._buffer;
        }
        /**
         * NONSTANDARD: Get underlying stats for this file. !!DO NOT MUTATE!!
         */
        getStats() {
            return this._stat;
        }
        getFlag() {
            return this._flag;
        }
        /**
         * Get the path to this file.
         * @return [String] The path to the file.
         */
        getPath() {
            return this._path;
        }
        /**
         * Get the current file position.
         *
         * We emulate the following bug mentioned in the Node documentation:
         * > On Linux, positional writes don't work when the file is opened in append
         *   mode. The kernel ignores the position argument and always appends the data
         *   to the end of the file.
         * @return [Number] The current file position.
         */
        getPos() {
            if (this._flag.isAppendable()) {
                return this._stat.size;
            }
            return this._pos;
        }
        /**
         * Advance the current file position by the indicated number of positions.
         * @param [Number] delta
         */
        advancePos(delta) {
            return this._pos += delta;
        }
        /**
         * Set the file position.
         * @param [Number] newPos
         */
        setPos(newPos) {
            return this._pos = newPos;
        }
        /**
         * **Core**: Asynchronous sync. Must be implemented by subclasses of this
         * class.
         * @param [Function(BrowserFS.FileError)] cb
         */
        sync(cb) {
            try {
                this.syncSync();
                cb();
            }
            catch (e) {
                cb(e);
            }
        }
        /**
         * **Core**: Synchronous sync.
         */
        syncSync() {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        /**
         * **Core**: Asynchronous close. Must be implemented by subclasses of this
         * class.
         * @param [Function(BrowserFS.FileError)] cb
         */
        close(cb) {
            try {
                this.closeSync();
                cb();
            }
            catch (e) {
                cb(e);
            }
        }
        /**
         * **Core**: Synchronous close.
         */
        closeSync() {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        /**
         * Asynchronous `stat`.
         * @param [Function(BrowserFS.FileError, BrowserFS.node.fs.Stats)] cb
         */
        stat(cb) {
            try {
                cb(null, Stats.clone(this._stat));
            }
            catch (e) {
                cb(e);
            }
        }
        /**
         * Synchronous `stat`.
         */
        statSync() {
            return Stats.clone(this._stat);
        }
        /**
         * Asynchronous truncate.
         * @param [Number] len
         * @param [Function(BrowserFS.FileError)] cb
         */
        truncate(len, cb) {
            try {
                this.truncateSync(len);
                if (this._flag.isSynchronous() && !fs.getRootFS().supportsSynch()) {
                    this.sync(cb);
                }
                cb();
            }
            catch (e) {
                return cb(e);
            }
        }
        /**
         * Synchronous truncate.
         * @param [Number] len
         */
        truncateSync(len) {
            this._dirty = true;
            if (!this._flag.isWriteable()) {
                throw new FileError(ErrorCodes.EPERM, 'File not opened with a writeable mode.');
            }
            this._stat.mtimeMs = Date.now();
            if (len > this._buffer.length) {
                const buf = Buffer.alloc(len - this._buffer.length, 0);
                // Write will set @_stat.size for us.
                this.writeSync(buf, 0, buf.length, this._buffer.length);
                if (this._flag.isSynchronous() && fs.getRootFS().supportsSynch()) {
                    this.syncSync();
                }
                return;
            }
            this._stat.size = len;
            // Truncate buffer to 'len'.
            const newBuff = Buffer.alloc(len);
            this._buffer.copy(newBuff, 0, 0, len);
            this._buffer = newBuff;
            if (this._flag.isSynchronous() && fs.getRootFS().supportsSynch()) {
                this.syncSync();
            }
        }
        /**
         * Write buffer to the file.
         * Note that it is unsafe to use fs.write multiple times on the same file
         * without waiting for the callback.
         * @param [BrowserFS.node.Buffer] buffer Buffer containing the data to write to
         *  the file.
         * @param [Number] offset Offset in the buffer to start reading data from.
         * @param [Number] length The amount of bytes to write to the file.
         * @param [Number] position Offset from the beginning of the file where this
         *   data should be written. If position is null, the data will be written at
         *   the current position.
         * @param [Function(BrowserFS.FileError, Number, BrowserFS.node.Buffer)]
         *   cb The number specifies the number of bytes written into the file.
         */
        write(buffer, offset, length, position, cb) {
            try {
                cb(null, this.writeSync(buffer, offset, length, position), buffer);
            }
            catch (e) {
                cb(e);
            }
        }
        /**
         * Write buffer to the file.
         * Note that it is unsafe to use fs.writeSync multiple times on the same file
         * without waiting for the callback.
         * @param [BrowserFS.node.Buffer] buffer Buffer containing the data to write to
         *  the file.
         * @param [Number] offset Offset in the buffer to start reading data from.
         * @param [Number] length The amount of bytes to write to the file.
         * @param [Number] position Offset from the beginning of the file where this
         *   data should be written. If position is null, the data will be written at
         *   the current position.
         * @return [Number]
         */
        writeSync(buffer, offset, length, position) {
            this._dirty = true;
            if (position === undefined || position === null) {
                position = this.getPos();
            }
            if (!this._flag.isWriteable()) {
                throw new FileError(ErrorCodes.EPERM, 'File not opened with a writeable mode.');
            }
            const endFp = position + length;
            if (endFp > this._stat.size) {
                this._stat.size = endFp;
                if (endFp > this._buffer.length) {
                    // Extend the buffer!
                    const newBuff = Buffer.alloc(endFp);
                    this._buffer.copy(newBuff);
                    this._buffer = newBuff;
                }
            }
            const len = buffer.copy(this._buffer, position, offset, offset + length);
            this._stat.mtimeMs = Date.now();
            if (this._flag.isSynchronous()) {
                this.syncSync();
                return len;
            }
            this.setPos(position + len);
            return len;
        }
        /**
         * Read data from the file.
         * @param [BrowserFS.node.Buffer] buffer The buffer that the data will be
         *   written to.
         * @param [Number] offset The offset within the buffer where writing will
         *   start.
         * @param [Number] length An integer specifying the number of bytes to read.
         * @param [Number] position An integer specifying where to begin reading from
         *   in the file. If position is null, data will be read from the current file
         *   position.
         * @param [Function(BrowserFS.FileError, Number, BrowserFS.node.Buffer)] cb The
         *   number is the number of bytes read
         */
        read(buffer, offset, length, position, cb) {
            try {
                cb(null, this.readSync(buffer, offset, length, position), buffer);
            }
            catch (e) {
                cb(e);
            }
        }
        /**
         * Read data from the file.
         * @param [BrowserFS.node.Buffer] buffer The buffer that the data will be
         *   written to.
         * @param [Number] offset The offset within the buffer where writing will
         *   start.
         * @param [Number] length An integer specifying the number of bytes to read.
         * @param [Number] position An integer specifying where to begin reading from
         *   in the file. If position is null, data will be read from the current file
         *   position.
         * @return [Number]
         */
        readSync(buffer, offset, length, position) {
            if (!this._flag.isReadable()) {
                throw new FileError(ErrorCodes.EPERM, 'File not opened with a readable mode.');
            }
            if (position === undefined || position === null) {
                position = this.getPos();
            }
            const endRead = position + length;
            if (endRead > this._stat.size) {
                length = this._stat.size - position;
            }
            const rv = this._buffer.copy(buffer, offset, position, position + length);
            this._stat.atimeMs = Date.now();
            this._pos = position + length;
            return rv;
        }
        /**
         * Asynchronous `fchmod`.
         * @param [Number|String] mode
         * @param [Function(BrowserFS.FileError)] cb
         */
        chmod(mode, cb) {
            try {
                this.chmodSync(mode);
                cb();
            }
            catch (e) {
                cb(e);
            }
        }
        /**
         * Asynchronous `fchmod`.
         * @param [Number] mode
         */
        chmodSync(mode) {
            if (!this._fs.supportsProps()) {
                throw new FileError(ErrorCodes.ENOTSUP);
            }
            this._dirty = true;
            this._stat.chmod(mode);
            this.syncSync();
        }
        isDirty() {
            return this._dirty;
        }
        /**
         * Resets the dirty bit. Should only be called after a sync has completed successfully.
         */
        resetDirty() {
            this._dirty = false;
        }
    }

    return files.PreloadFile = PreloadFile;
});
define('skylark-data-files/no-sync-file',[
     "./preload-file"
], function (PreloadFile) {
    'use strict';
    /**
     * File class for the InMemory and XHR file systems.
     * Doesn't sync to anything, so it works nicely for memory-only files.
     */
    class NoSyncFile extends PreloadFile {
        constructor(_fs, _path, _flag, _stat, contents) {
            super(_fs, _path, _flag, _stat, contents);
        }
        /**
         * Asynchronous sync. Doesn't do anything, simply calls the cb.
         * @param [Function(BrowserFS.FileError)] cb
         */
        sync(cb) {
            cb();
        }
        /**
         * Synchronous sync. Doesn't do anything.
         */
        syncSync() {
            // NOP.
        }
        /**
         * Asynchronous close. Doesn't do anything, simply calls the cb.
         * @param [Function(BrowserFS.FileError)] cb
         */
        close(cb) {
            cb();
        }
        /**
         * Synchronous close. Doesn't do anything.
         */
        closeSync() {
            // NOP.
        }
    }

    return files.NoSyncFile = NoSyncFile;
    
});
define('skylark-data-files/main',[
	"./files",
	"./action-type",
	"./base-file",
	"./error-codes",
	"./error-strings",
	"./file-error",
	"./file-flag",
	"./file-system",
	"./no-sync-file",
	"./preload-file",
	"./stats"
],function(files){
	return files;
});
define('skylark-data-files', ['skylark-data-files/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-data-files.js.map
