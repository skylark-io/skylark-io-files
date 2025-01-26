/**
 * skylark-data-files - The skylark file system library
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
(function(factory,globals,define,require) {
  var isAmd = (typeof define === 'function' && define.amd),
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

define('skylark-data-files/files',[
	"skylark-langx-ns"
],function(skylark){
	return skylark.attach("data.files",{
		providers : {
			
		}
	});
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
    "./files",
    "./file-type"
],function (Buffer,files,FileType) {
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
    "skylark-langx-paths",
    "./files",
    './error-codes',
    "./file-error",
    './file-flag',
    './stats'
], function (setImmediate,Buffer, paths, files,ErrorCodes,FileError, FileFlag,  Stats) {
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
        return paths.resolve(p);
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
            mkdirpSync(paths.dirname(p), mode, fs);
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
], function (Buffer,files,ErrorCodes,FileError,Stats,BaseFile, utils) {
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
     "./files",
     "./preload-file"
], function (files,PreloadFile) {
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
define('skylark-data-files/providers/registry',[
	"../files"
],function(files){

	var cache = {}

	function get(name) {
		return cache[name];
	}

	function add(name,provider) {
		cache[name] = provider;
	}
	

	return files.providers.registry = {
		get,
		add
	};
});
define('skylark-data-files/configure',[
    "./files",
    './file-system',
    "./error-codes",
    "./file-error",
    './providers/registry',
], function(files, FileSystem, ErrorCodes,FileError,registry) {
    'use strict';

    var fs = files.fs = new FileSystem();

    /**
     * Initializes BrowserFS with the given root file system.
     */
    function initialize(rootfs) {
        return fs.initialize(rootfs);
    }
    /**
     * Creates a file system with the given configuration, and initializes BrowserFS with it.
     * See the FileSystemConfiguration type for more info on the configuration object.
     */
    function configure(config, cb) {
        getFileSystem(config, (e, provider) => {
            if (provider) {
                initialize(provider);
                cb(null,fs);
            }
            else {
                cb(e);
            }
        });
    }
    /**
     * Retrieve a file system with the given configuration.
     * @param config A FileSystemConfiguration object. See FileSystemConfiguration for details.
     * @param cb Called when the file system is constructed, or when an error occurs.
     */
    function getFileSystem(config, cb) {
        const fsName = config['fs'];
        if (!fsName) {
            return cb(new FileError(ErrorCodes.EPERM, 'Missing "fs" property on configuration object.'));
        }
        const options = config['options'];
        let waitCount = 0;
        let called = false;
        function finish() {
            if (!called) {
                called = true;
                const fsc = registry.get(fsName);
                if (!fsc) {
                    cb(new FileError(ErrorCodes.EPERM, `File system ${fsName} is not available in BrowserFS.`));
                }
                else {
                    fsc.Create(options, cb);
                }
            }
        }
        if (options !== null && typeof (options) === "object") {
            let finishedIterating = false;
            const props = Object.keys(options).filter((k) => k !== 'fs');
            // Check recursively if other fields have 'fs' properties.
            props.forEach((p) => {
                const d = options[p];
                if (d !== null && typeof (d) === "object" && d['fs']) {
                    waitCount++;
                    getFileSystem(d, function (e, fs) {
                        waitCount--;
                        if (e) {
                            if (called) {
                                return;
                            }
                            called = true;
                            cb(e);
                        }
                        else {
                            options[p] = fs;
                            if (waitCount === 0 && finishedIterating) {
                                finish();
                            }
                        }
                    });
                }
            });
            finishedIterating = true;
        }
        if (waitCount === 0) {
            finish();
        }
    }

    return files.configure = configure;
});
define('skylark-data-files/providers/base-provider',[
    "skylark-langx-binary/buffer",
    "skylark-langx-paths",
    "../files",
    "../error-codes",
    '../file-error',
    '../action-type',
    '../file-flag',
    '../utils'
], function (Buffer,paths, files,ErrorCodes, FileError, ActionType, FileFlag, utils) {
    'use strict';

    const { fail } = utils;

    /**
     * Basic filesystem class. Most filesystems should extend this class, as it
     * provides default implementations for a handful of methods.
     */
    class BaseProvider {
        supportsLinks() {
            return false;
        }
        diskSpace(p, cb) {
            cb(0, 0);
        }
        /**
         * Opens the file at path p with the given flag. The file must exist.
         * @param p The path to open.
         * @param flag The flag to use when opening the file.
         */
        openFile(p, flag, cb) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        /**
         * Create the file at path p with the given mode. Then, open it with the given
         * flag.
         */
        createFile(p, flag, mode, cb) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        open(p, flag, mode, cb) {
            const mustBeFile = (e, stats) => {
                if (e) {
                    // File does not exist.
                    switch (flag.pathNotExistsAction()) {
                        case ActionType.CREATE_FILE:
                            // Ensure parent exists.
                            return this.stat(paths.dirname(p), false, (e, parentStats) => {
                                if (e) {
                                    cb(e);
                                }
                                else if (parentStats && !parentStats.isDirectory()) {
                                    cb(FileError.ENOTDIR(paths.dirname(p)));
                                }
                                else {
                                    this.createFile(p, flag, mode, cb);
                                }
                            });
                        case ActionType.THROW_EXCEPTION:
                            return cb(FileError.ENOENT(p));
                        default:
                            return cb(new FileError(ErrorCodes.EINVAL, 'Invalid FileFlag object.'));
                    }
                }
                else {
                    // File exists.
                    if (stats && stats.isDirectory()) {
                        return cb(FileError.EISDIR(p));
                    }
                    switch (flag.pathExistsAction()) {
                        case ActionType.THROW_EXCEPTION:
                            return cb(FileError.EEXIST(p));
                        case ActionType.TRUNCATE_FILE:
                            // NOTE: In a previous implementation, we deleted the file and
                            // re-created it. However, this created a race condition if another
                            // asynchronous request was trying to read the file, as the file
                            // would not exist for a small period of time.
                            return this.openFile(p, flag, (e, fd) => {
                                if (e) {
                                    cb(e);
                                }
                                else if (fd) {
                                    fd.truncate(0, () => {
                                        fd.sync(() => {
                                            cb(null, fd);
                                        });
                                    });
                                }
                                else {
                                    fail();
                                }
                            });
                        case ActionType.NOP:
                            return this.openFile(p, flag, cb);
                        default:
                            return cb(new FileError(ErrorCodes.EINVAL, 'Invalid FileFlag object.'));
                    }
                }
            };
            this.stat(p, false, mustBeFile);
        }
        rename(oldPath, newPath, cb) {
            cb(new FileError(ErrorCodes.ENOTSUP));
        }
        renameSync(oldPath, newPath) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        stat(p, isLstat, cb) {
            cb(new FileError(ErrorCodes.ENOTSUP));
        }
        statSync(p, isLstat) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        /**
         * Opens the file at path p with the given flag. The file must exist.
         * @param p The path to open.
         * @param flag The flag to use when opening the file.
         * @return A File object corresponding to the opened file.
         */
        openFileSync(p, flag, mode) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        /**
         * Create the file at path p with the given mode. Then, open it with the given
         * flag.
         */
        createFileSync(p, flag, mode) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        openSync(p, flag, mode) {
            // Check if the path exists, and is a file.
            let stats;
            try {
                stats = this.statSync(p, false);
            }
            catch (e) {
                // File does not exist.
                switch (flag.pathNotExistsAction()) {
                    case ActionType.CREATE_FILE:
                        // Ensure parent exists.
                        const parentStats = this.statSync(paths.dirname(p), false);
                        if (!parentStats.isDirectory()) {
                            throw FileError.ENOTDIR(paths.dirname(p));
                        }
                        return this.createFileSync(p, flag, mode);
                    case ActionType.THROW_EXCEPTION:
                        throw FileError.ENOENT(p);
                    default:
                        throw new FileError(ErrorCodes.EINVAL, 'Invalid FileFlag object.');
                }
            }
            // File exists.
            if (stats.isDirectory()) {
                throw FileError.EISDIR(p);
            }
            switch (flag.pathExistsAction()) {
                case ActionType.THROW_EXCEPTION:
                    throw FileError.EEXIST(p);
                case ActionType.TRUNCATE_FILE:
                    // Delete file.
                    this.unlinkSync(p);
                    // Create file. Use the same mode as the old file.
                    // Node itself modifies the ctime when this occurs, so this action
                    // will preserve that behavior if the underlying file system
                    // supports those properties.
                    return this.createFileSync(p, flag, stats.mode);
                case ActionType.NOP:
                    return this.openFileSync(p, flag, mode);
                default:
                    throw new FileError(ErrorCodes.EINVAL, 'Invalid FileFlag object.');
            }
        }
        unlink(p, cb) {
            cb(new FileError(ErrorCodes.ENOTSUP));
        }
        unlinkSync(p) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        rmdir(p, cb) {
            cb(new FileError(ErrorCodes.ENOTSUP));
        }
        rmdirSync(p) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        mkdir(p, mode, cb) {
            cb(new FileError(ErrorCodes.ENOTSUP));
        }
        mkdirSync(p, mode) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        readdir(p, cb) {
            cb(new FileError(ErrorCodes.ENOTSUP));
        }
        readdirSync(p) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        exists(p, cb) {
            this.stat(p, null, function (err) {
                cb(!err);
            });
        }
        existsSync(p) {
            try {
                this.statSync(p, true);
                return true;
            }
            catch (e) {
                return false;
            }
        }
        realpath(p, cache, cb) {
            if (this.supportsLinks()) {
                // The path could contain symlinks. Split up the path,
                // resolve any symlinks, return the resolved string.
                const splitPath = p.split(paths.sep);
                // TODO: Simpler to just pass through file, find sep and such.
                for (let i = 0; i < splitPath.length; i++) {
                    const addPaths = splitPath.slice(0, i + 1);
                    splitPath[i] = paths.join.apply(null, addPaths);
                }
            }
            else {
                // No symlinks. We just need to verify that it exists.
                this.exists(p, function (doesExist) {
                    if (doesExist) {
                        cb(null, p);
                    }
                    else {
                        cb(FileError.ENOENT(p));
                    }
                });
            }
        }
        realpathSync(p, cache) {
            if (this.supportsLinks()) {
                // The path could contain symlinks. Split up the path,
                // resolve any symlinks, return the resolved string.
                const splitPath = p.split(paths.sep);
                // TODO: Simpler to just pass through file, find sep and such.
                for (let i = 0; i < splitPath.length; i++) {
                    const addPaths = splitPath.slice(0, i + 1);
                    splitPath[i] = paths.join.apply(path, addPaths);
                }
                return splitPath.join(paths.sep);
            }
            else {
                // No symlinks. We just need to verify that it exists.
                if (this.existsSync(p)) {
                    return p;
                }
                else {
                    throw FileError.ENOENT(p);
                }
            }
        }
        truncate(p, len, cb) {
            this.open(p, FileFlag.getFileFlag('r+'), 0x1a4, (function (er, fd) {
                if (er) {
                    return cb(er);
                }
                fd.truncate(len, (function (er) {
                    fd.close((function (er2) {
                        cb(er || er2);
                    }));
                }));
            }));
        }
        truncateSync(p, len) {
            const fd = this.openSync(p, FileFlag.getFileFlag('r+'), 0x1a4);
            // Need to safely close FD, regardless of whether or not truncate succeeds.
            try {
                fd.truncateSync(len);
            }
            catch (e) {
                throw e;
            }
            finally {
                fd.closeSync();
            }
        }
        readFile(fname, encoding, flag, cb) {
            // Wrap cb in file closing code.
            const oldCb = cb;
            // Get file.
            this.open(fname, flag, 0x1a4, (err, fd) => {
                if (err) {
                    return cb(err);
                }
                cb = function (err, arg) {
                    fd.close(function (err2) {
                        if (!err) {
                            err = err2;
                        }
                        return oldCb(err, arg);
                    });
                };
                fd.stat((err, stat) => {
                    if (err) {
                        return cb(err);
                    }
                    // Allocate buffer.
                    const buf = Buffer.alloc(stat.size);
                    fd.read(buf, 0, stat.size, 0, (err) => {
                        if (err) {
                            return cb(err);
                        }
                        else if (encoding === null) {
                            return cb(err, buf);
                        }
                        try {
                            cb(null, buf.toString(encoding));
                        }
                        catch (e) {
                            cb(e);
                        }
                    });
                });
            });
        }
        readFileSync(fname, encoding, flag) {
            // Get file.
            const fd = this.openSync(fname, flag, 0x1a4);
            try {
                const stat = fd.statSync();
                // Allocate buffer.
                const buf = Buffer.alloc(stat.size);
                fd.readSync(buf, 0, stat.size, 0);
                fd.closeSync();
                if (encoding === null) {
                    return buf;
                }
                return buf.toString(encoding);
            }
            finally {
                fd.closeSync();
            }
        }
        writeFile(fname, data, encoding, flag, mode, cb) {
            // Wrap cb in file closing code.
            const oldCb = cb;
            // Get file.
            this.open(fname, flag, 0x1a4, function (err, fd) {
                if (err) {
                    return cb(err);
                }
                cb = function (err) {
                    fd.close(function (err2) {
                        oldCb(err ? err : err2);
                    });
                };
                try {
                    if (typeof data === 'string') {
                        data = Buffer.from(data, encoding);
                    }
                }
                catch (e) {
                    return cb(e);
                }
                // Write into file.
                fd.write(data, 0, data.length, 0, cb);
            });
        }
        writeFileSync(fname, data, encoding, flag, mode) {
            // Get file.
            const fd = this.openSync(fname, flag, mode);
            try {
                if (typeof data === 'string') {
                    data = Buffer.from(data, encoding);
                }
                // Write into file.
                fd.writeSync(data, 0, data.length, 0);
            }
            finally {
                fd.closeSync();
            }
        }
        appendFile(fname, data, encoding, flag, mode, cb) {
            // Wrap cb in file closing code.
            const oldCb = cb;
            this.open(fname, flag, mode, function (err, fd) {
                if (err) {
                    return cb(err);
                }
                cb = function (err) {
                    fd.close(function (err2) {
                        oldCb(err ? err : err2);
                    });
                };
                if (typeof data === 'string') {
                    data = Buffer.from(data, encoding);
                }
                fd.write(data, 0, data.length, null, cb);
            });
        }
        appendFileSync(fname, data, encoding, flag, mode) {
            const fd = this.openSync(fname, flag, mode);
            try {
                if (typeof data === 'string') {
                    data = Buffer.from(data, encoding);
                }
                fd.writeSync(data, 0, data.length, null);
            }
            finally {
                fd.closeSync();
            }
        }
        chmod(p, isLchmod, mode, cb) {
            cb(new FileError(ErrorCodes.ENOTSUP));
        }
        chmodSync(p, isLchmod, mode) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        chown(p, isLchown, uid, gid, cb) {
            cb(new FileError(ErrorCodes.ENOTSUP));
        }
        chownSync(p, isLchown, uid, gid) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        utimes(p, atime, mtime, cb) {
            cb(new FileError(ErrorCodes.ENOTSUP));
        }
        utimesSync(p, atime, mtime) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        link(srcpath, dstpath, cb) {
            cb(new FileError(ErrorCodes.ENOTSUP));
        }
        linkSync(srcpath, dstpath) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        symlink(srcpath, dstpath, type, cb) {
            cb(new FileError(ErrorCodes.ENOTSUP));
        }
        symlinkSync(srcpath, dstpath, type) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
        readlink(p, cb) {
            cb(new FileError(ErrorCodes.ENOTSUP));
        }
        readlinkSync(p) {
            throw new FileError(ErrorCodes.ENOTSUP);
        }
    }


    return files.providers.BaseProvider = BaseProvider;
});
define('skylark-data-files/providers/dropbox/dropbox-file',[
    '../../preload-file'
], function (PreloadFile) {
    'use strict';

    class DropboxFile extends PreloadFile {
        constructor(_fs, _path, _flag, _stat, contents) {
            super(_fs, _path, _flag, _stat, contents);
        }
        sync(cb) {
            this._fs._syncFile(this.getPath(), this.getBuffer(), cb);
        }
        close(cb) {
            this.sync(cb);
        }
    }

    return  DropboxFile;
    
});
define('skylark-data-files/providers/dropbox/dropbox-provider',[
    "skylark-langx-funcs/defer",
    "skylark-langx-binary/buffer",
    "skylark-langx-paths",
    "../../files",
    "../registry",
    "../base-provider",
    '../../stats',
    '../../file-type',
    '../../file-error',
    '../../error-codes',
    '../../utils',
    './dropbox-file'
], function (setImmediate,Buffer,paths,files, registry,BaseProvider, Stats,FileType,FileError, ErrorCodes, utils,DropboxFile) {
    'use strict';

    const { arrayBuffer2Buffer, buffer2ArrayBuffer } =  utils;
///    const { Dropbox } =  dropbox_bridge;
    const { dirname } =  paths;


    /**
     * Dropbox paths do not begin with a /, they just begin with a folder at the root node.
     * Here, we strip the `/`.
     * @param p An absolute path
     */
    function FixPath(p) {
        if (p === '/') {
            return '';
        }
        else {
            return p;
        }
    }
    /**
     * HACK: Dropbox errors are FUBAR'd sometimes.
     * @url https://github.com/dropbox/dropbox-sdk-js/issues/146
     * @param e
     */
    function ExtractTheFuckingError(e) {
        const obj = e.error;
        if (obj['.tag']) {
            // Everything is OK.
            return obj;
        }
        else if (obj['error']) {
            // Terrible nested object bug.
            const obj2 = obj.error;
            if (obj2['.tag']) {
                return obj2;
            }
            else if (obj2['reason'] && obj2['reason']['.tag']) {
                return obj2.reason;
            }
            else {
                return obj2;
            }
        }
        else if (typeof (obj) === 'string') {
            // Might be a fucking JSON object error.
            try {
                const obj2 = JSON.parse(obj);
                if (obj2['error'] && obj2['error']['reason'] && obj2['error']['reason']['.tag']) {
                    return obj2.error.reason;
                }
            }
            catch (e) {
                // Nope. Give up.
            }
        }
        return obj;
    }
    /**
     * Returns a user-facing error message given an error.
     *
     * HACK: Dropbox error messages sometimes lack a `user_message` field.
     * Sometimes, they are even strings. Ugh.
     * @url https://github.com/dropbox/dropbox-sdk-js/issues/146
     * @url https://github.com/dropbox/dropbox-sdk-js/issues/145
     * @url https://github.com/dropbox/dropbox-sdk-js/issues/144
     * @param err An error.
     */
    function GetErrorMessage(err) {
        if (err['user_message']) {
            return err.user_message.text;
        }
        else if (err['error_summary']) {
            return err.error_summary;
        }
        else if (typeof (err.error) === "string") {
            return err.error;
        }
        else if (typeof (err.error) === "object") {
            // DROPBOX BUG: Sometimes, error is a nested error.
            return GetErrorMessage(err.error);
        }
        else {
            throw new Error(`Dropbox's servers gave us a garbage error message: ${JSON.stringify(err)}`);
        }
    }
    function LookupErrorToError(err, p, msg) {
        switch (err['.tag']) {
            case 'malformed_path':
                return new FileError(ErrorCodes.EBADF, msg, p);
            case 'not_found':
                return FileError.ENOENT(p);
            case 'not_file':
                return FileError.EISDIR(p);
            case 'not_folder':
                return FileError.ENOTDIR(p);
            case 'restricted_content':
                return FileError.EPERM(p);
            case 'other':
            default:
                return new FileError(ErrorCodes.EIO, msg, p);
        }
    }
    function WriteErrorToError(err, p, msg) {
        switch (err['.tag']) {
            case 'malformed_path':
            case 'disallowed_name':
                return new FileError(ErrorCodes.EBADF, msg, p);
            case 'conflict':
            case 'no_write_permission':
            case 'team_folder':
                return FileError.EPERM(p);
            case 'insufficient_space':
                return new FileError(ErrorCodes.ENOSPC, msg);
            case 'other':
            default:
                return new FileError(ErrorCodes.EIO, msg, p);
        }
    }
    function FilesDeleteWrapped(client, p, cb) {
        const arg = {
            path: FixPath(p)
        };
        client.filesDeleteV2(arg)
            .then(() => {
            cb();
        }).catch((e) => {
            const err = ExtractTheFuckingError(e);
            switch (err['.tag']) {
                case 'path_lookup':
                    cb(LookupErrorToError(err.path_lookup, p, GetErrorMessage(e)));
                    break;
                case 'path_write':
                    cb(WriteErrorToError(err.path_write, p, GetErrorMessage(e)));
                    break;
                case 'too_many_write_operations':
                    setTimeout(() => FilesDeleteWrapped(client, p, cb), 500 + (300 * (Math.random())));
                    break;
                case 'other':
                default:
                    cb(new FileError(ErrorCodes.EIO, GetErrorMessage(e), p));
                    break;
            }
        });
    }

    /**
     * A read/write file system backed by Dropbox cloud storage.
     *
     * Uses the Dropbox V2 API, and the 2.x JS SDK.
     */
    class DropboxProvider extends BaseProvider {
        constructor(client) {
            super();
            this._client = client;
        }
        /**
         * Creates a new DropboxProvider instance with the given options.
         * Must be given an *authenticated* Dropbox client from 2.x JS SDK.
         */
        static Create(opts, cb) {
            cb(null, new DropboxProvider(opts.client));
        }
        static isAvailable() {
            // Checks if the Dropbox library is loaded.
            return typeof Dropbox !== 'undefined';
        }
        getName() {
            return DropboxProvider.Name;
        }
        isReadOnly() {
            return false;
        }
        // Dropbox doesn't support symlinks, properties, or synchronous calls
        // TODO: does it???
        supportsSymlinks() {
            return false;
        }
        supportsProps() {
            return false;
        }
        supportsSynch() {
            return false;
        }
        /**
         * Deletes *everything* in the file system. Mainly intended for unit testing!
         * @param mainCb Called when operation completes.
         */
        empty(mainCb) {
            this.readdir('/', (e, paths) => {
                if (paths) {
                    const next = (e) => {
                        if (paths.length === 0) {
                            mainCb();
                        }
                        else {
                            FilesDeleteWrapped(this._client, paths.shift(), next);
                        }
                    };
                    next();
                }
                else {
                    mainCb(e);
                }
            });
        }
        rename(oldPath, newPath, cb) {
            // Dropbox doesn't let you rename things over existing things, but POSIX does.
            // So, we need to see if newPath exists...
            this.stat(newPath, false, (e, stats) => {
                const rename = () => {
                    const relocationArg = {
                        from_path: FixPath(oldPath),
                        to_path: FixPath(newPath)
                    };
                    this._client.filesMoveV2(relocationArg)
                        .then(() => cb())
                        .catch(function (e) {
                        const err = ExtractTheFuckingError(e);
                        switch (err['.tag']) {
                            case 'from_lookup':
                                cb(LookupErrorToError(err.from_lookup, oldPath, GetErrorMessage(e)));
                                break;
                            case 'from_write':
                                cb(WriteErrorToError(err.from_write, oldPath, GetErrorMessage(e)));
                                break;
                            case 'to':
                                cb(WriteErrorToError(err.to, newPath, GetErrorMessage(e)));
                                break;
                            case 'cant_copy_shared_folder':
                            case 'cant_nest_shared_folder':
                                cb(new FileError(ErrorCodes.EPERM, GetErrorMessage(e), oldPath));
                                break;
                            case 'cant_move_folder_into_itself':
                            case 'duplicated_or_nested_paths':
                                cb(new FileError(ErrorCodes.EBADF, GetErrorMessage(e), oldPath));
                                break;
                            case 'too_many_files':
                                cb(new FileError(ErrorCodes.ENOSPC, GetErrorMessage(e), oldPath));
                                break;
                            case 'other':
                            default:
                                cb(new FileError(ErrorCodes.EIO, GetErrorMessage(e), oldPath));
                                break;
                        }
                    });
                };
                if (e) {
                    // Doesn't exist. Proceed!
                    rename();
                }
                else if (oldPath === newPath) {
                    // NOP if the path exists. Error if it doesn't exist.
                    if (e) {
                        cb(FileError.ENOENT(newPath));
                    }
                    else {
                        cb();
                    }
                }
                else if (stats && stats.isDirectory()) {
                    // Exists, is a directory. Cannot rename over an existing directory.
                    cb(FileError.EISDIR(newPath));
                }
                else {
                    // Exists, is a file, and differs from oldPath. Delete and rename.
                    this.unlink(newPath, (e) => {
                        if (e) {
                            cb(e);
                        }
                        else {
                            rename();
                        }
                    });
                }
            });
        }
        stat(path, isLstat, cb) {
            if (path === '/') {
                // Dropbox doesn't support querying the root directory.
                setImmediate(function () {
                    cb(null, new Stats(FileType.DIRECTORY, 4096));
                });
                return;
            }
            const arg = {
                path: FixPath(path)
            };
            this._client.filesGetMetadata(arg).then((ref) => {
                switch (ref['.tag']) {
                    case 'file':
                        const fileMetadata = ref;
                        // TODO: Parse time fields.
                        cb(null, new Stats(FileType.FILE, fileMetadata.size));
                        break;
                    case 'folder':
                        cb(null, new Stats(FileType.DIRECTORY, 4096));
                        break;
                    case 'deleted':
                        cb(FileError.ENOENT(path));
                        break;
                    default:
                        // Unknown.
                        break;
                }
            }).catch((e) => {
                const err = ExtractTheFuckingError(e);
                switch (err['.tag']) {
                    case 'path':
                        cb(LookupErrorToError(err.path, path, GetErrorMessage(e)));
                        break;
                    default:
                        cb(new FileError(ErrorCodes.EIO, GetErrorMessage(e), path));
                        break;
                }
            });
        }
        openFile(path, flags, cb) {
            const downloadArg = {
                path: FixPath(path)
            };
            this._client.filesDownload(downloadArg).then((res) => {
                const b = res.fileBlob;
                const fr = new FileReader();
                fr.onload = () => {
                    const ab = fr.result;
                    cb(null, new DropboxFile(this, path, flags, new Stats(FileType.FILE, ab.byteLength), arrayBuffer2Buffer(ab)));
                };
                fr.readAsArrayBuffer(b);
            }).catch((e) => {
                const err = ExtractTheFuckingError(e);
                switch (err['.tag']) {
                    case 'path':
                        const dpError = err;
                        cb(LookupErrorToError(dpError.path, path, GetErrorMessage(e)));
                        break;
                    case 'other':
                    default:
                        cb(new FileError(ErrorCodes.EIO, GetErrorMessage(e), path));
                        break;
                }
            });
        }
        createFile(p, flags, mode, cb) {
            const fileData = Buffer.alloc(0);
            const blob = new Blob([buffer2ArrayBuffer(fileData)], { type: "octet/stream" });
            const commitInfo = {
                contents: blob,
                path: FixPath(p)
            };
            this._client.filesUpload(commitInfo).then((metadata) => {
                cb(null, new DropboxFile(this, p, flags, new Stats(FileType.FILE, 0), fileData));
            }).catch((e) => {
                const err = ExtractTheFuckingError(e);
                // HACK: Casting to 'any' since tag can be 'too_many_write_operations'.
                switch (err['.tag']) {
                    case 'path':
                        const upError = err;
                        cb(WriteErrorToError(upError.path.reason, p, GetErrorMessage(e)));
                        break;
                    case 'too_many_write_operations':
                        // Retry in (500, 800) ms.
                        setTimeout(() => this.createFile(p, flags, mode, cb), 500 + (300 * (Math.random())));
                        break;
                    case 'other':
                    default:
                        cb(new FileError(ErrorCodes.EIO, GetErrorMessage(e), p));
                        break;
                }
            });
        }
        /**
         * Delete a file
         */
        unlink(path, cb) {
            // Must be a file. Check first.
            this.stat(path, false, (e, stat) => {
                if (stat) {
                    if (stat.isDirectory()) {
                        cb(FileError.EISDIR(path));
                    }
                    else {
                        FilesDeleteWrapped(this._client, path, cb);
                    }
                }
                else {
                    cb(e);
                }
            });
        }
        /**
         * Delete a directory
         */
        rmdir(path, cb) {
            this.readdir(path, (e, paths) => {
                if (paths) {
                    if (paths.length > 0) {
                        cb(FileError.ENOTEMPTY(path));
                    }
                    else {
                        FilesDeleteWrapped(this._client, path, cb);
                    }
                }
                else {
                    cb(e);
                }
            });
        }
        /**
         * Create a directory
         */
        mkdir(p, mode, cb) {
            // Dropbox's create_folder is recursive. Check if parent exists.
            const parent = dirname(p);
            this.stat(parent, false, (e, stats) => {
                if (e) {
                    cb(e);
                }
                else if (stats && !stats.isDirectory()) {
                    cb(FileError.ENOTDIR(parent));
                }
                else {
                    const arg = {
                        path: FixPath(p)
                    };
                    this._client.filesCreateFolderV2(arg).then(() => cb()).catch((e) => {
                        const err = ExtractTheFuckingError(e);
                        if (err['.tag'] === "too_many_write_operations") {
                            // Retry in a bit.
                            setTimeout(() => this.mkdir(p, mode, cb), 500 + (300 * (Math.random())));
                        }
                        else {
                            cb(WriteErrorToError(ExtractTheFuckingError(e).path, p, GetErrorMessage(e)));
                        }
                    });
                }
            });
        }
        /**
         * Get the names of the files in a directory
         */
        readdir(path, cb) {
            const arg = {
                path: FixPath(path)
            };
            this._client.filesListFolder(arg).then((res) => {
                ContinueReadingDir(this._client, path, res, [], cb);
            }).catch((e) => {
                ProcessListFolderError(e, path, cb);
            });
        }
        /**
         * (Internal) Syncs file to Dropbox.
         */
        _syncFile(p, d, cb) {
            const blob = new Blob([buffer2ArrayBuffer(d)], { type: "octet/stream" });
            const arg = {
                contents: blob,
                path: FixPath(p),
                mode: {
                    '.tag': 'overwrite'
                }
            };
            this._client.filesUpload(arg).then(() => {
                cb();
            }).catch((e) => {
                const err = ExtractTheFuckingError(e);
                switch (err['.tag']) {
                    case 'path':
                        const upError = err;
                        cb(WriteErrorToError(upError.path.reason, p, GetErrorMessage(e)));
                        break;
                    case 'too_many_write_operations':
                        setTimeout(() => this._syncFile(p, d, cb), 500 + (300 * (Math.random())));
                        break;
                    case 'other':
                    default:
                        cb(new FileError(ErrorCodes.EIO, GetErrorMessage(e), p));
                        break;
                }
            });
        }
    }
    DropboxProvider.Name = "DropboxV2";
    DropboxProvider.Options = {
        client: {
            type: "object",
            description: "An *authenticated* Dropbox client. Must be from the 2.5.x JS SDK."
        }
    };
    function ProcessListFolderError(e, path, cb) {
        const err = ExtractTheFuckingError(e);
        switch (err['.tag']) {
            case 'path':
                const pathError = err;
                cb(LookupErrorToError(pathError.path, path, GetErrorMessage(e)));
                break;
            case 'other':
            default:
                cb(new FileError(ErrorCodes.EIO, GetErrorMessage(e), path));
                break;
        }
    }
    function ContinueReadingDir(client, path, res, previousEntries, cb) {
        const newEntries = res.entries.map((e) => e.path_display).filter((p) => !!p);
        const entries = previousEntries.concat(newEntries);
        if (!res.has_more) {
            cb(null, entries);
        }
        else {
            const arg = {
                cursor: res.cursor
            };
            client.filesListFolderContinue(arg).then((res) => {
                ContinueReadingDir(client, path, res, entries, cb);
            }).catch((e) => {
                ProcessListFolderError(e, path, cb);
            });
        }
    }

    DropboxProvider.DropboxFile = DropboxFile;

    registry.add("dropbox",DropboxProvider);

    return  files.providers.DropboxProvider= DropboxProvider;
    
});
define('skylark-data-files/providers/html5/html5-lfs-file',[
    "../../utils",
    '../../preload-file'
], function (utils,PreloadFile) {
    'use strict';

    const { buffer2ArrayBuffer, arrayBuffer2Buffer } = utils;

    // A note about getFile and getDirectory options:
    // These methods are called at numerous places in this file, and are passed
    // some combination of these two options:
    //   - create: If true, the entry will be created if it doesn't exist.
    //             If false, an error will be thrown if it doesn't exist.
    //   - exclusive: If true, only create the entry if it doesn't already exist,
    //                and throw an error if it does.
    class Html5LfsFile extends PreloadFile {
        constructor(fs, entry, path, flag, stat, contents) {
            super(fs, path, flag, stat, contents);
            this._entry = entry;
        }
        sync(cb) {
            if (!this.isDirty()) {
                return cb();
            }
            this._entry.createWriter((writer) => {
                const buffer = this.getBuffer();
                const blob = new Blob([buffer2ArrayBuffer(buffer)]);
                const length = blob.size;
                writer.onwriteend = (err) => {
                    writer.onwriteend = null;
                    writer.onerror = null;
                    writer.truncate(length);
                    this.resetDirty();
                    cb();
                };
                writer.onerror = (err) => {
                    cb(convertError(err, this.getPath(), false));
                };
                writer.write(blob);
            });
        }
        close(cb) {
            this.sync(cb);
        }
    }


    return Html5LfsFile;
});
define('skylark-data-files/providers/html5/html5-lfs-provider',[
    "skylark-langx-async",
    "skylark-langx-paths",
    "../../files",
    "../registry",
    '../../preload-file',
    "../base-provider",
    '../../error-codes',
    '../../file-error',
    '../../action-type',
    '../../stats',
    '../../file-type',
    '../../utils',
    "./html5-lfs-file"
], function (async,paths, files,registry, PreloadFile, BaseProvider, ErrorCodes, FileError,ActionType, Stats,FileType, utils,Html5LfsFile) {
    'use strict';

    const asyncEach = async.each;

    const { buffer2ArrayBuffer, arrayBuffer2Buffer } = utils;


    /**
     * @hidden
     */
    function isDirectoryEntry(entry) {
        return entry.isDirectory;
    }

    /**
     * @hidden
     */
    const _getFS = window.webkitRequestProvider || window.requestProvider || null;

    /**
     * @hidden
     */
    function _requestQuota(type, size, success, errorCallback) {
        // We cast navigator and window to '<any>' because everything here is
        // nonstandard functionality, despite the fact that Chrome has the only
        // implementation of the HTML5FS and is likely driving the standardization
        // process. Thus, these objects defined off of navigator and window are not
        // present in the DefinitelyTyped TypeScript typings for Provider.
        if (typeof navigator['webkitPersistentStorage'] !== 'undefined') {
            switch (type) {
                case window.PERSISTENT:
                    navigator.webkitPersistentStorage.requestQuota(size, success, errorCallback);
                    break;
                case window.TEMPORARY:
                    navigator.webkitTemporaryStorage.requestQuota(size, success, errorCallback);
                    break;
                default:
                    errorCallback(new TypeError(`Invalid storage type: ${type}`));
                    break;
            }
        }
        else {
            window.webkitStorageInfo.requestQuota(type, size, success, errorCallback);
        }
    }
    /**
     * @hidden
     */
    function _toArray(list) {
        return Array.prototype.slice.call(list || [], 0);
    }
    /**
     * Converts the given DOMError into an appropriate FileError.
     * @url https://developer.mozilla.org/en-US/docs/Web/API/DOMError
     * @hidden
     */
    function convertError(err, p, expectedDir) {
        switch (err.name) {
            /* The user agent failed to create a file or directory due to the existence of a file or
                directory with the same path.  */
            case "PathExistsError":
                return FileError.EEXIST(p);
            /* The operation failed because it would cause the application to exceed its storage quota.  */
            case 'QuotaExceededError':
                return FileError.FileError(ErrorCodes.ENOSPC, p);
            /*  A required file or directory could not be found at the time an operation was processed.   */
            case 'NotFoundError':
                return FileError.ENOENT(p);
            /* This is a security error code to be used in situations not covered by any other error codes.
                - A required file was unsafe for access within a Web application
                - Too many calls are being made on filesystem resources */
            case 'SecurityError':
                return FileError.FileError(ErrorCodes.EACCES, p);
            /* The modification requested was illegal. Examples of invalid modifications include moving a
                directory into its own child, moving a file into its parent directory without changing its name,
                or copying a directory to a path occupied by a file.  */
            case 'InvalidModificationError':
                return FileError.FileError(ErrorCodes.EPERM, p);
            /* The user has attempted to look up a file or directory, but the Entry found is of the wrong type
                [e.g. is a DirectoryEntry when the user requested a FileEntry].  */
            case 'TypeMismatchError':
                return FileError.FileError(expectedDir ? ErrorCodes.ENOTDIR : ErrorCodes.EISDIR, p);
            /* A path or URL supplied to the API was malformed.  */
            case "EncodingError":
            /* An operation depended on state cached in an interface object, but that state that has changed
                since it was read from disk.  */
            case "InvalidStateError":
            /* The user attempted to write to a file or directory which could not be modified due to the state
                of the underlying filesystem.  */
            case "NoModificationAllowedError":
            default:
                return FileError.FileError(ErrorCodes.EINVAL, p);
        }
    }

    /**
     * A read-write filesystem backed by the HTML5 Provider API.
     *
     * As the HTML5 Provider is only implemented in Blink, this interface is
     * only available in Chrome.
     */
    class Html5LfsProvider extends BaseProvider {

        /**
         * @param size storage quota to request, in megabytes. Allocated value may be less.
         * @param type window.PERSISTENT or window.TEMPORARY. Defaults to PERSISTENT.
         */
        constructor(size = 5, type = window.PERSISTENT) {
            super();
            // Convert MB to bytes.
            this.size = 1024 * 1024 * size;
            this.type = type;
        }

        /**
         * Creates an Html5LfsProvider instance with the given options.
         */
        static Create(opts, cb) {
            const fs = new Html5LfsProvider(opts.size, opts.type);
            fs._allocate((e) => e ? cb(e) : cb(null, fs));
        }

        static isAvailable() {
            return !!_getFS;
        }

        getName() {
            return Html5LfsProvider.Name;
        }

        isReadOnly() {
            return false;
        }

        supportsSymlinks() {
            return false;
        }

        supportsProps() {
            return false;
        }

        supportsSynch() {
            return false;
        }

        /**
         * Deletes everything in the FS. Used for testing.
         * Karma clears the storage after you quit it but not between runs of the test
         * suite, and the tests expect an empty FS every time.
         */
        empty(mainCb) {
            // Get a list of all entries in the root directory to delete them
            this._readdir('/', (err, entries) => {
                if (err) {
                    mainCb(err);
                }
                else {
                    // Called when every entry has been operated on
                    const finished = (er) => {
                        if (err) {
                            mainCb(err);
                        }
                        else {
                            mainCb();
                        }
                    };
                    // Removes files and recursively removes directories
                    const deleteEntry = (entry, cb) => {
                        const succ = () => {
                            cb();
                        };
                        const error = (err) => {
                            cb(convertError(err, entry.fullPath, !entry.isDirectory));
                        };
                        if (isDirectoryEntry(entry)) {
                            entry.removeRecursively(succ, error);
                        }
                        else {
                            entry.remove(succ, error);
                        }
                    };
                    // Loop through the entries and remove them, then call the callback
                    // when they're all finished.
                    asyncEach(entries, deleteEntry, finished);
                }
            });
        }

        rename(oldPath, newPath, cb) {
            let semaphore = 2;
            let successCount = 0;
            const root = this.fs.root;
            let currentPath = oldPath;
            const error = (err) => {
                if (--semaphore <= 0) {
                    cb(convertError(err, currentPath, false));
                }
            };
            const success = (file) => {
                if (++successCount === 2) {
                    return cb(new FileError(ErrorCodes.EINVAL, "Something was identified as both a file and a directory. This should never happen."));
                }
                // SPECIAL CASE: If newPath === oldPath, and the path exists, then
                // this operation trivially succeeds.
                if (oldPath === newPath) {
                    return cb();
                }
                // Get the new parent directory.
                currentPath = paths.dirname(newPath);
                root.getDirectory(currentPath, {}, (parentDir) => {
                    currentPath = paths.basename(newPath);
                    file.moveTo(parentDir, currentPath, (entry) => { cb(); }, (err) => {
                        // SPECIAL CASE: If oldPath is a directory, and newPath is a
                        // file, rename should delete the file and perform the move.
                        if (file.isDirectory) {
                            currentPath = newPath;
                            // Unlink only works on files. Try to delete newPath.
                            this.unlink(newPath, (e) => {
                                if (e) {
                                    // newPath is probably a directory.
                                    error(err);
                                }
                                else {
                                    // Recur, now that newPath doesn't exist.
                                    this.rename(oldPath, newPath, cb);
                                }
                            });
                        }
                        else {
                            error(err);
                        }
                    });
                }, error);
            };
            // We don't know if oldPath is a *file* or a *directory*, and there's no
            // way to stat items. So launch both requests, see which one succeeds.
            root.getFile(oldPath, {}, success, error);
            root.getDirectory(oldPath, {}, success, error);
        }

        stat(path, isLstat, cb) {
            // Throw an error if the entry doesn't exist, because then there's nothing
            // to stat.
            const opts = {
                create: false
            };
            // Called when the path has been successfully loaded as a file.
            const loadAsFile = (entry) => {
                const fileFromEntry = (file) => {
                    const stat = new Stats(FileType.FILE, file.size);
                    cb(null, stat);
                };
                entry.file(fileFromEntry, failedToLoad);
            };
            // Called when the path has been successfully loaded as a directory.
            const loadAsDir = (dir) => {
                // Directory entry size can't be determined from the HTML5 FS API, and is
                // implementation-dependant anyway, so a dummy value is used.
                const size = 4096;
                const stat = new Stats(FileType.DIRECTORY, size);
                cb(null, stat);
            };
            // Called when the path couldn't be opened as a directory or a file.
            const failedToLoad = (err) => {
                cb(convertError(err, path, false /* Unknown / irrelevant */));
            };
            // Called when the path couldn't be opened as a file, but might still be a
            // directory.
            const failedToLoadAsFile = () => {
                this.fs.root.getDirectory(path, opts, loadAsDir, failedToLoad);
            };
            // No method currently exists to determine whether a path refers to a
            // directory or a file, so this implementation tries both and uses the first
            // one that succeeds.
            this.fs.root.getFile(path, opts, loadAsFile, failedToLoadAsFile);
        }
        open(p, flags, mode, cb) {
            // XXX: err is a DOMError
            const error = (err) => {
                if (err.name === 'InvalidModificationError' && flags.isExclusive()) {
                    cb(FileError.EEXIST(p));
                }
                else {
                    cb(convertError(err, p, false));
                }
            };
            this.fs.root.getFile(p, {
                create: flags.pathNotExistsAction() === ActionType.CREATE_FILE,
                exclusive: flags.isExclusive()
            }, (entry) => {
                // Try to fetch corresponding file.
                entry.file((file) => {
                    const reader = new FileReader();
                    reader.onloadend = (event) => {
                        const bfsFile = this._makeFile(p, entry, flags, file, reader.result);
                        cb(null, bfsFile);
                    };
                    reader.onerror = (ev) => {
                        error(reader.error);
                    };
                    reader.readAsArrayBuffer(file);
                }, error);
            }, error);
        }
        unlink(path, cb) {
            this._remove(path, cb, true);
        }
        rmdir(path, cb) {
            // Check if directory is non-empty, first.
            this.readdir(path, (e, files) => {
                if (e) {
                    cb(e);
                }
                else if (files.length > 0) {
                    cb(FileError.ENOTEMPTY(path));
                }
                else {
                    this._remove(path, cb, false);
                }
            });
        }
        mkdir(path, mode, cb) {
            // Create the directory, but throw an error if it already exists, as per
            // mkdir(1)
            const opts = {
                create: true,
                exclusive: true
            };
            const success = (dir) => {
                cb();
            };
            const error = (err) => {
                cb(convertError(err, path, true));
            };
            this.fs.root.getDirectory(path, opts, success, error);
        }
        /**
         * Map _readdir's list of `FileEntry`s to their names and return that.
         */
        readdir(path, cb) {
            this._readdir(path, (e, entries) => {
                if (entries) {
                    const rv = [];
                    for (const entry of entries) {
                        rv.push(entry.name);
                    }
                    cb(null, rv);
                }
                else {
                    return cb(e);
                }
            });
        }
        /**
         * Returns a BrowserFS object representing a File.
         */
        _makeFile(path, entry, flag, stat, data = new ArrayBuffer(0)) {
            const stats = new Stats(FileType.FILE, stat.size);
            const buffer = arrayBuffer2Buffer(data);
            return new Html5LfsFile(this, entry, path, flag, stats, buffer);
        }
        /**
         * Returns an array of `FileEntry`s. Used internally by empty and readdir.
         */
        _readdir(path, cb) {
            const error = (err) => {
                cb(convertError(err, path, true));
            };
            // Grab the requested directory.
            this.fs.root.getDirectory(path, { create: false }, (dirEntry) => {
                const reader = dirEntry.createReader();
                let entries = [];
                // Call the reader.readEntries() until no more results are returned.
                const readEntries = () => {
                    reader.readEntries(((results) => {
                        if (results.length) {
                            entries = entries.concat(_toArray(results));
                            readEntries();
                        }
                        else {
                            cb(null, entries);
                        }
                    }), error);
                };
                readEntries();
            }, error);
        }
        
        /**
         * Requests a storage quota from the browser to back this FS.
         */
        _allocate(cb) {
            const success = (fs) => {
                this.fs = fs;
                cb();
            };
            const error = (err) => {
                cb(convertError(err, "/", true));
            };
            if (this.type === window.PERSISTENT) {
                _requestQuota(this.type, this.size, (granted) => {
                    _getFS(this.type, granted, success, error);
                }, error);
            }
            else {
                _getFS(this.type, this.size, success, error);
            }
        }
        /**
         * Delete a file or directory from the file system
         * isFile should reflect which call was made to remove the it (`unlink` or
         * `rmdir`). If this doesn't match what's actually at `path`, an error will be
         * returned
         */
        _remove(path, cb, isFile) {
            const success = (entry) => {
                const succ = () => {
                    cb();
                };
                const err = (err) => {
                    cb(convertError(err, path, !isFile));
                };
                entry.remove(succ, err);
            };
            const error = (err) => {
                cb(convertError(err, path, !isFile));
            };
            // Deleting the entry, so don't create it
            const opts = {
                create: false
            };
            if (isFile) {
                this.fs.root.getFile(path, opts, success, error);
            }
            else {
                this.fs.root.getDirectory(path, opts, success, error);
            }
        }
    }
    Html5LfsProvider.Name = "Html5LfsProvider";
    Html5LfsProvider.Options = {
        size: {
            type: "number",
            optional: true,
            description: "Storage quota to request, in megabytes. Allocated value may be less. Defaults to 5."
        },
        type: {
            type: "number",
            optional: true,
            description: "window.PERSISTENT or window.TEMPORARY. Defaults to PERSISTENT."
        }
    };

    Html5LfsProvider.Html5LfsFile = Html5LfsFile;

    registry.add("html5Lfs",Html5LfsProvider);


    return Html5LfsProvider;
});
define('skylark-data-files/providers/http/xhr',[
    "skylark-langx-binary/buffer",
    '../../error-codes',
    '../../file-error',
    "../../utils"
], function (Buffer,ErrorCodes,FileError,utils) {
    'use strict';
    /**
     * Contains utility methods for performing a variety of tasks with
     * XmlHttpRequest across browsers.
     */
    const { isIE, emptyBuffer } = utils;


    const xhrIsAvailable = (typeof (XMLHttpRequest) !== "undefined" && XMLHttpRequest !== null);
    function asyncDownloadFileModern(p, type, cb) {
        const req = new XMLHttpRequest();
        req.open('GET', p, true);
        let jsonSupported = true;
        switch (type) {
            case 'buffer':
                req.responseType = 'arraybuffer';
                break;
            case 'json':
                // Some browsers don't support the JSON response type.
                // They either reset responseType, or throw an exception.
                // @see https://github.com/Modernizr/Modernizr/blob/master/src/testXhrType.js
                try {
                    req.responseType = 'json';
                    jsonSupported = req.responseType === 'json';
                }
                catch (e) {
                    jsonSupported = false;
                }
                break;
            default:
                return cb(new FileError(ErrorCodes.EINVAL, "Invalid download type: " + type));
        }
        req.onreadystatechange = function (e) {
            if (req.readyState === 4) {
                if (req.status === 200) {
                    switch (type) {
                        case 'buffer':
                            // XXX: WebKit-based browsers return *null* when XHRing an empty file.
                            return cb(null, req.response ? Buffer.from(req.response) : emptyBuffer());
                        case 'json':
                            if (jsonSupported) {
                                return cb(null, req.response);
                            }
                            else {
                                return cb(null, JSON.parse(req.responseText));
                            }
                    }
                }
                else {
                    return cb(new FileError(ErrorCodes.EIO, `XHR error: response returned code ${req.status}`));
                }
            }
        };
        req.send();
    }
    function syncDownloadFileModern(p, type) {
        const req = new XMLHttpRequest();
        req.open('GET', p, false);
        // On most platforms, we cannot set the responseType of synchronous downloads.
        // @todo Test for this; IE10 allows this, as do older versions of Chrome/FF.
        let data = null;
        let err = null;
        // Classic hack to download binary data as a string.
        req.overrideMimeType('text/plain; charset=x-user-defined');
        req.onreadystatechange = function (e) {
            if (req.readyState === 4) {
                if (req.status === 200) {
                    switch (type) {
                        case 'buffer':
                            // Convert the text into a buffer.
                            const text = req.responseText;
                            data = Buffer.alloc(text.length);
                            // Throw away the upper bits of each character.
                            for (let i = 0; i < text.length; i++) {
                                // This will automatically throw away the upper bit of each
                                // character for us.
                                data[i] = text.charCodeAt(i);
                            }
                            return;
                        case 'json':
                            data = JSON.parse(req.responseText);
                            return;
                    }
                }
                else {
                    err = new FileError(ErrorCodes.EIO, `XHR error: response returned code ${req.status}`);
                    return;
                }
            }
        };
        req.send();
        if (err) {
            throw err;
        }
        return data;
    }
    function syncDownloadFileIE10(p, type) {
        const req = new XMLHttpRequest();
        req.open('GET', p, false);
        switch (type) {
            case 'buffer':
                req.responseType = 'arraybuffer';
                break;
            case 'json':
                // IE10 does not support the JSON type.
                break;
            default:
                throw new FileError(ErrorCodes.EINVAL, "Invalid download type: " + type);
        }
        let data;
        let err;
        req.onreadystatechange = function (e) {
            if (req.readyState === 4) {
                if (req.status === 200) {
                    switch (type) {
                        case 'buffer':
                            data = Buffer.from(req.response);
                            break;
                        case 'json':
                            data = JSON.parse(req.response);
                            break;
                    }
                }
                else {
                    err = new FileError(ErrorCodes.EIO, `XHR error: response returned code ${req.status}`);
                }
            }
        };
        req.send();
        if (err) {
            throw err;
        }
        return data;
    }
    /**
     * @hidden
     */
    function getFileSize(async, p, cb) {
        const req = new XMLHttpRequest();
        req.open('HEAD', p, async);
        req.onreadystatechange = function (e) {
            if (req.readyState === 4) {
                if (req.status === 200) {
                    try {
                        return cb(null, parseInt(req.getResponseHeader('Content-Length') || '-1', 10));
                    }
                    catch (e) {
                        // In the event that the header isn't present or there is an error...
                        return cb(new FileError(ErrorCodes.EIO, "XHR HEAD error: Could not read content-length."));
                    }
                }
                else {
                    return cb(new FileError(ErrorCodes.EIO, `XHR HEAD error: response returned code ${req.status}`));
                }
            }
        };
        req.send();
    }
    /**
     * Asynchronously download a file as a buffer or a JSON object.
     * Note that the third function signature with a non-specialized type is
     * invalid, but TypeScript requires it when you specialize string arguments to
     * constants.
     * @hidden
     */
    let asyncDownloadFile = asyncDownloadFileModern;
    /**
     * Synchronously download a file as a buffer or a JSON object.
     * Note that the third function signature with a non-specialized type is
     * invalid, but TypeScript requires it when you specialize string arguments to
     * constants.
     * @hidden
     */
    let syncDownloadFile = (isIE && typeof Blob !== 'undefined') ? syncDownloadFileIE10 : syncDownloadFileModern;
    /**
     * Synchronously retrieves the size of the given file in bytes.
     * @hidden
     */
    function getFileSizeSync(p) {
        let rv = -1;
        getFileSize(false, p, function (err, size) {
            if (err) {
                throw err;
            }
            rv = size;
        });
        return rv;
    }
    /**
     * Asynchronously retrieves the size of the given file in bytes.
     * @hidden
     */
    function getFileSizeAsync(p, cb) {
        getFileSize(true, p, cb);
    }



    return {
        xhrIsAvailable: xhrIsAvailable,
        asyncDownloadFile: asyncDownloadFile,
        syncDownloadFile: syncDownloadFile,
        getFileSizeSync: getFileSizeSync,
        getFileSizeAsync: getFileSizeAsync
    };
});
define('skylark-data-files/providers/http/fetch',[
    "skylark-langx-binary/buffer",
    '../../error-codes',
    '../../file-error'
], function (Buffer,ErrorCodes,FileError) {
    'use strict';


    const fetchIsAvailable = (typeof (fetch) !== "undefined" && fetch !== null);

    function fetchFileAsync(p, type, cb) {
        let request;
        try {
            request = fetch(p);
        }
        catch (e) {
            // XXX: fetch will throw a TypeError if the URL has credentials in it
            return cb(new FileError(ErrorCodes.EINVAL, e.message));
        }
        request
            .then((res) => {
            if (!res.ok) {
                return cb(new FileError(ErrorCodes.EIO, `fetch error: response returned code ${res.status}`));
            }
            else {
                switch (type) {
                    case 'buffer':
                        res.arrayBuffer()
                            .then((buf) => cb(null, Buffer.from(buf)))
                            .catch((err) => cb(new FileError(ErrorCodes.EIO, err.message)));
                        break;
                    case 'json':
                        res.json()
                            .then((json) => cb(null, json))
                            .catch((err) => cb(new FileError(ErrorCodes.EIO, err.message)));
                        break;
                    default:
                        cb(new FileError(ErrorCodes.EINVAL, "Invalid download type: " + type));
                }
            }
        })
            .catch((err) => cb(new FileError(ErrorCodes.EIO, err.message)));
    }

    /**
     * Asynchronously retrieves the size of the given file in bytes.
     * @hidden
     */

    function fetchFileSizeAsync(p, cb) {
        fetch(p, { method: 'HEAD' })
            .then((res) => {
            if (!res.ok) {
                return cb(new FileError(ErrorCodes.EIO, `fetch HEAD error: response returned code ${res.status}`));
            }
            else {
                return cb(null, parseInt(res.headers.get('Content-Length') || '-1', 10));
            }
        })
            .catch((err) => cb(new FileError(ErrorCodes.EIO, err.message)));
    }

    return {
        fetchIsAvailable: fetchIsAvailable,
        fetchFileAsync: fetchFileAsync,
        fetchFileSizeAsync: fetchFileSizeAsync
    };
});
define('skylark-data-files/inodes/dir-inode',[
    "skylark-langx-paths",
    '../stats',
    '../file-type'
], function (paths, Stats,FileType) {
    'use strict';

    /**
     * Inode for a directory. Currently only contains the directory listing.
     */
    class DirInode {
        /**
         * Constructs an inode for a directory.
         */
        constructor(data = null) {
            this.data = data;
            this._ls = {};
        }
        isFile() {
            return false;
        }
        isDir() {
            return true;
        }
        getData() { return this.data; }
        /**
         * Return a Stats object for this inode.
         * @todo Should probably remove this at some point. This isn't the
         *       responsibility of the FileIndex.
         */
        getStats() {
            return new Stats(FileType.DIRECTORY, 4096, 0x16D);
        }
        /**
         * Returns the directory listing for this directory. Paths in the directory are
         * relative to the directory's path.
         * @return The directory listing for this directory.
         */
        getListing() {
            return Object.keys(this._ls);
        }
        /**
         * Returns the inode for the indicated item, or null if it does not exist.
         * @param p Name of item in this directory.
         */
        getItem(p) {
            const item = this._ls[p];
            return item ? item : null;
        }
        /**
         * Add the given item to the directory listing. Note that the given inode is
         * not copied, and will be mutated by the DirInode if it is a DirInode.
         * @param p Item name to add to the directory listing.
         * @param inode The inode for the
         *   item to add to the directory inode.
         * @return True if it was added, false if it already existed.
         */
        addItem(p, inode) {
            if (p in this._ls) {
                return false;
            }
            this._ls[p] = inode;
            return true;
        }
        /**
         * Removes the given item from the directory listing.
         * @param p Name of item to remove from the directory listing.
         * @return Returns the item
         *   removed, or null if the item did not exist.
         */
        remItem(p) {
            const item = this._ls[p];
            if (item === undefined) {
                return null;
            }
            delete this._ls[p];
            return item;
        }
    }

    /**

    /**
     * @hidden
     */
    DirInode.isDirInode =  function isDirInode(inode) {
        return !!inode && inode.isDir();
    }


    return DirInode;
});
define('skylark-data-files/inodes/file-inode',[
], function () {
    'use strict';

    /**
     * Inode for a file. Stores an arbitrary (filesystem-specific) data payload.
     */
    class FileInode {
        constructor(data) {
            this.data = data;
        }
        isFile() { return true; }
        isDir() { return false; }
        getData() { return this.data; }
        setData(data) { this.data = data; }
    }
    /**

    /**
     * @hidden
     */
    FileInode.isFileInode = function isFileInode(inode) {
        return !!inode && inode.isFile();
    };


    return FileInode;

});
define('skylark-data-files/inodes/file-index',[
    "skylark-langx-paths",
    '../stats',
    '../file-type',
    "./dir-inode",
    "./file-inode"
], function (paths, Stats,FileType,DirInode,FileInode) {
    'use strict';

    /**
     * A simple class for storing a filesystem index. Assumes that all paths passed
     * to it are *absolute* paths.
     *
     * Can be used as a partial or a full index, although care must be taken if used
     * for the former purpose, especially when directories are concerned.
     */
    class FileIndex {
        /**
         * Constructs a new FileIndex.
         */
        constructor() {
            // _index is a single-level key,value store that maps *directory* paths to
            // DirInodes. File information is only contained in DirInodes themselves.
            this._index = {};
            // Create the root directory.
            this.addPath('/', new DirInode());
        }
        /**
         * Static method for constructing indices from a JSON listing.
         * @param listing Directory listing generated by tools/XHRIndexer.coffee
         * @return A new FileIndex object.
         */
        static fromListing(listing) {
            const idx = new FileIndex();
            // Add a root DirNode.
            const rootInode = new DirInode();
            idx._index['/'] = rootInode;
            const queue = [['', listing, rootInode]];
            while (queue.length > 0) {
                let inode;
                const next = queue.pop();
                const pwd = next[0];
                const tree = next[1];
                const parent = next[2];
                for (const node in tree) {
                    if (tree.hasOwnProperty(node)) {
                        const children = tree[node];
                        const name = `${pwd}/${node}`;
                        if (children) {
                            idx._index[name] = inode = new DirInode();
                            queue.push([name, children, inode]);
                        }
                        else {
                            // This inode doesn't have correct size information, noted with -1.
                            inode = new FileInode(new Stats(FileType.FILE, -1, 0x16D));
                        }
                        if (parent) {
                            parent._ls[node] = inode;
                        }
                    }
                }
            }
            return idx;
        }
        /**
         * Runs the given function over all files in the index.
         */
        fileIterator(cb) {
            for (const path in this._index) {
                if (this._index.hasOwnProperty(path)) {
                    const dir = this._index[path];
                    const files = dir.getListing();
                    for (const file of files) {
                        const item = dir.getItem(file);
                        if (FileInode.isFileInode(item)) {
                            cb(item.getData());
                        }
                    }
                }
            }
        }
        /**
         * Adds the given absolute path to the index if it is not already in the index.
         * Creates any needed parent directories.
         * @param path The path to add to the index.
         * @param inode The inode for the
         *   path to add.
         * @return 'True' if it was added or already exists, 'false' if there
         *   was an issue adding it (e.g. item in path is a file, item exists but is
         *   different).
         * @todo If adding fails and implicitly creates directories, we do not clean up
         *   the new empty directories.
         */
        addPath(path, inode) {
            if (!inode) {
                throw new Error('Inode must be specified');
            }
            if (path[0] !== '/') {
                throw new Error('Path must be absolute, got: ' + path);
            }
            // Check if it already exists.
            if (this._index.hasOwnProperty(path)) {
                return this._index[path] === inode;
            }
            const splitPath = this._split_path(path);
            const dirpath = splitPath[0];
            const itemname = splitPath[1];
            // Try to add to its parent directory first.
            let parent = this._index[dirpath];
            if (parent === undefined && path !== '/') {
                // Create parent.
                parent = new DirInode();
                if (!this.addPath(dirpath, parent)) {
                    return false;
                }
            }
            // Add myself to my parent.
            if (path !== '/') {
                if (!parent.addItem(itemname, inode)) {
                    return false;
                }
            }
            // If I'm a directory, add myself to the index.
            if (DirInode.isDirInode(inode)) {
                this._index[path] = inode;
            }
            return true;
        }
        /**
         * Adds the given absolute path to the index if it is not already in the index.
         * The path is added without special treatment (no joining of adjacent separators, etc).
         * Creates any needed parent directories.
         * @param path The path to add to the index.
         * @param inode The inode for the
         *   path to add.
         * @return 'True' if it was added or already exists, 'false' if there
         *   was an issue adding it (e.g. item in path is a file, item exists but is
         *   different).
         * @todo If adding fails and implicitly creates directories, we do not clean up
         *   the new empty directories.
         */
        addPathFast(path, inode) {
            const itemNameMark = path.lastIndexOf('/');
            const parentPath = itemNameMark === 0 ? "/" : path.substring(0, itemNameMark);
            const itemName = path.substring(itemNameMark + 1);
            // Try to add to its parent directory first.
            let parent = this._index[parentPath];
            if (parent === undefined) {
                // Create parent.
                parent = new DirInode();
                this.addPathFast(parentPath, parent);
            }
            if (!parent.addItem(itemName, inode)) {
                return false;
            }
            // If adding a directory, add to the index as well.
            if (inode.isDir()) {
                this._index[path] = inode;
            }
            return true;
        }
        /**
         * Removes the given path. Can be a file or a directory.
         * @return The removed item,
         *   or null if it did not exist.
         */
        removePath(path) {
            const splitPath = this._split_path(path);
            const dirpath = splitPath[0];
            const itemname = splitPath[1];
            // Try to remove it from its parent directory first.
            const parent = this._index[dirpath];
            if (parent === undefined) {
                return null;
            }
            // Remove myself from my parent.
            const inode = parent.remItem(itemname);
            if (inode === null) {
                return null;
            }
            // If I'm a directory, remove myself from the index, and remove my children.
            if (DirInode.isDirInode(inode)) {
                const children = inode.getListing();
                for (const child of children) {
                    this.removePath(path + '/' + child);
                }
                // Remove the directory from the index, unless it's the root.
                if (path !== '/') {
                    delete this._index[path];
                }
            }
            return inode;
        }
        /**
         * Retrieves the directory listing of the given path.
         * @return An array of files in the given path, or 'null' if it does not exist.
         */
        ls(path) {
            const item = this._index[path];
            if (item === undefined) {
                return null;
            }
            return item.getListing();
        }
        /**
         * Returns the inode of the given item.
         * @return Returns null if the item does not exist.
         */
        getInode(path) {
            const splitPath = this._split_path(path);
            const dirpath = splitPath[0];
            const itemname = splitPath[1];
            // Retrieve from its parent directory.
            const parent = this._index[dirpath];
            if (parent === undefined) {
                return null;
            }
            // Root case
            if (dirpath === path) {
                return parent;
            }
            return parent.getItem(itemname);
        }
        /**
         * Split into a (directory path, item name) pair
         */
        _split_path(p) {
            const dirpath = paths.dirname(p);
            const itemname = p.substr(dirpath.length + (dirpath === "/" ? 0 : 1));
            return [dirpath, itemname];
        }
    }
    

    return FileIndex;
});
define('skylark-data-files/providers/http/http-provider',[
    "skylark-langx-async",
    "skylark-langx-paths",
    "../../files",
    "../registry",
    '../../no-sync-file',
    "../base-provider",
    '../../error-codes',
    '../../file-error',
    '../../action-type',
    '../../stats',
    '../../file-type',
    '../../utils',
    './xhr',
    './fetch',
    '../../inodes/dir-inode',
    '../../inodes/file-index',
    '../../inodes/file-inode',

], function (async,paths,files,registry,NoSyncFile, BaseProvider, ErrorCodes, FileError,ActionType, Stats,FileType,  utils,xhr, fetch, DirInode,FileIndex,FileInode) {


    'use strict';

    const { copyingSlice }  = utils;

    const { xhrIsAvailable, asyncDownloadFile, syncDownloadFile, getFileSizeAsync, getFileSizeSync }  = xhr;
    const { fetchIsAvailable, fetchFileAsync, fetchFileSizeAsync }  = fetch;

    const isFileInode = FileInode.isFileInode,
          isDirInode = DirInode.isDirInode;
    /**
     * Try to convert the given buffer into a string, and pass it to the callback.
     * Optimization that removes the needed try/catch into a helper function, as
     * this is an uncommon case.
     * @hidden
     */
    function tryToString(buff, encoding, cb) {
        try {
            cb(null, buff.toString(encoding));
        }
        catch (e) {
            cb(e);
        }
    }
    function syncNotAvailableError() {
        throw new FileError(ErrorCodes.ENOTSUP, `Synchronous HTTP download methods are not available in this environment.`);
    }
    /**
     * A simple filesystem backed by HTTP downloads. You must create a directory listing using the
     * `make_http_index` tool provided by BrowserFS.
     *
     * If you install BrowserFS globally with `npm i -g browserfs`, you can generate a listing by
     * running `make_http_index` in your terminal in the directory you would like to index:
     *
     * ```
     * make_http_index > index.json
     * ```
     *
     * Listings objects look like the following:
     *
     * ```json
     * {
     *   "home": {
     *     "jvilk": {
     *       "someFile.txt": null,
     *       "someDir": {
     *         // Empty directory
     *       }
     *     }
     *   }
     * }
     * ```
     *
     * *This example has the folder `/home/jvilk` with subfile `someFile.txt` and subfolder `someDir`.*
     */
    class HttpProvider extends BaseProvider {
        constructor(index, prefixUrl = '', preferXHR = false) {
            super();
            // prefix_url must end in a directory separator.
            if (prefixUrl.length > 0 && prefixUrl.charAt(prefixUrl.length - 1) !== '/') {
                prefixUrl = prefixUrl + '/';
            }
            this.prefixUrl = prefixUrl;
            this._index = FileIndex.fromListing(index);
            if (fetchIsAvailable && (!preferXHR || !xhrIsAvailable)) {
                this._requestFileAsyncInternal = fetchFileAsync;
                this._requestFileSizeAsyncInternal = fetchFileSizeAsync;
            }
            else {
                this._requestFileAsyncInternal = asyncDownloadFile;
                this._requestFileSizeAsyncInternal = getFileSizeAsync;
            }
            if (xhrIsAvailable) {
                this._requestFileSyncInternal = syncDownloadFile;
                this._requestFileSizeSyncInternal = getFileSizeSync;
            }
            else {
                this._requestFileSyncInternal = syncNotAvailableError;
                this._requestFileSizeSyncInternal = syncNotAvailableError;
            }
        }
        /**
         * Construct an HttpProvider file system backend with the given options.
         */
        static Create(opts, cb) {
            if (opts.index === undefined) {
                opts.index = `index.json`;
            }
            if (typeof (opts.index) === "string") {
                asyncDownloadFile(opts.index, "json", (e, data) => {
                    if (e) {
                        cb(e);
                    }
                    else {
                        cb(null, new HttpProvider(data, opts.baseUrl));
                    }
                });
            }
            else {
                cb(null, new HttpProvider(opts.index, opts.baseUrl));
            }
        }
        static isAvailable() {
            return xhrIsAvailable || fetchIsAvailable;
        }
        empty() {
            this._index.fileIterator(function (file) {
                file.fileData = null;
            });
        }
        getName() {
            return HttpProvider.Name;
        }
        diskSpace(path, cb) {
            // Read-only file system. We could calculate the total space, but that's not
            // important right now.
            cb(0, 0);
        }
        isReadOnly() {
            return true;
        }
        supportsLinks() {
            return false;
        }
        supportsProps() {
            return false;
        }
        supportsSynch() {
            // Synchronous operations are only available via the XHR interface for now.
            return xhrIsAvailable;
        }
        /**
         * Special HTTPFS function: Preload the given file into the index.
         * @param [String] path
         * @param [BrowserFS.Buffer] buffer
         */
        preloadFile(path, buffer) {
            const inode = this._index.getInode(path);
            if (isFileInode(inode)) {
                if (inode === null) {
                    throw FileError.ENOENT(path);
                }
                const stats = inode.getData();
                stats.size = buffer.length;
                stats.fileData = buffer;
            }
            else {
                throw FileError.EISDIR(path);
            }
        }
        stat(path, isLstat, cb) {
            const inode = this._index.getInode(path);
            if (inode === null) {
                return cb(FileError.ENOENT(path));
            }
            let stats;
            if (isFileInode(inode)) {
                stats = inode.getData();
                // At this point, a non-opened file will still have default stats from the listing.
                if (stats.size < 0) {
                    this._requestFileSizeAsync(path, function (e, size) {
                        if (e) {
                            return cb(e);
                        }
                        stats.size = size;
                        cb(null, Stats.clone(stats));
                    });
                }
                else {
                    cb(null, Stats.clone(stats));
                }
            }
            else if (isDirInode(inode)) {
                stats = inode.getStats();
                cb(null, stats);
            }
            else {
                cb(FileError.FileError(ErrorCodes.EINVAL, path));
            }
        }
        statSync(path, isLstat) {
            const inode = this._index.getInode(path);
            if (inode === null) {
                throw FileError.ENOENT(path);
            }
            let stats;
            if (isFileInode(inode)) {
                stats = inode.getData();
                // At this point, a non-opened file will still have default stats from the listing.
                if (stats.size < 0) {
                    stats.size = this._requestFileSizeSync(path);
                }
            }
            else if (isDirInode(inode)) {
                stats = inode.getStats();
            }
            else {
                throw FileError.FileError(ErrorCodes.EINVAL, path);
            }
            return stats;
        }
        open(path, flags, mode, cb) {
            // INVARIANT: You can't write to files on this file system.
            if (flags.isWriteable()) {
                return cb(new FileError(ErrorCodes.EPERM, path));
            }
            const self = this;
            // Check if the path exists, and is a file.
            const inode = this._index.getInode(path);
            if (inode === null) {
                return cb(FileError.ENOENT(path));
            }
            if (isFileInode(inode)) {
                const stats = inode.getData();
                switch (flags.pathExistsAction()) {
                    case ActionType.THROW_EXCEPTION:
                    case ActionType.TRUNCATE_FILE:
                        return cb(FileError.EEXIST(path));
                    case ActionType.NOP:
                        // Use existing file contents.
                        // XXX: Uh, this maintains the previously-used flag.
                        if (stats.fileData) {
                            return cb(null, new NoSyncFile(self, path, flags, Stats.clone(stats), stats.fileData));
                        }
                        // @todo be lazier about actually requesting the file
                        this._requestFileAsync(path, 'buffer', function (err, buffer) {
                            if (err) {
                                return cb(err);
                            }
                            // we don't initially have file sizes
                            stats.size = buffer.length;
                            stats.fileData = buffer;
                            return cb(null, new NoSyncFile(self, path, flags, Stats.clone(stats), buffer));
                        });
                        break;
                    default:
                        return cb(new FileError(ErrorCodes.EINVAL, 'Invalid FileMode object.'));
                }
            }
            else {
                return cb(FileError.EISDIR(path));
            }
        }
        openSync(path, flags, mode) {
            // INVARIANT: You can't write to files on this file system.
            if (flags.isWriteable()) {
                throw new FileError(ErrorCodes.EPERM, path);
            }
            // Check if the path exists, and is a file.
            const inode = this._index.getInode(path);
            if (inode === null) {
                throw FileError.ENOENT(path);
            }
            if (isFileInode(inode)) {
                const stats = inode.getData();
                switch (flags.pathExistsAction()) {
                    case ActionType.THROW_EXCEPTION:
                    case ActionType.TRUNCATE_FILE:
                        throw FileError.EEXIST(path);
                    case ActionType.NOP:
                        // Use existing file contents.
                        // XXX: Uh, this maintains the previously-used flag.
                        if (stats.fileData) {
                            return new NoSyncFile(this, path, flags, Stats.clone(stats), stats.fileData);
                        }
                        // @todo be lazier about actually requesting the file
                        const buffer = this._requestFileSync(path, 'buffer');
                        // we don't initially have file sizes
                        stats.size = buffer.length;
                        stats.fileData = buffer;
                        return new NoSyncFile(this, path, flags, Stats.clone(stats), buffer);
                    default:
                        throw new FileError(ErrorCodes.EINVAL, 'Invalid FileMode object.');
                }
            }
            else {
                throw FileError.EISDIR(path);
            }
        }
        readdir(path, cb) {
            try {
                cb(null, this.readdirSync(path));
            }
            catch (e) {
                cb(e);
            }
        }
        readdirSync(path) {
            // Check if it exists.
            const inode = this._index.getInode(path);
            if (inode === null) {
                throw FileError.ENOENT(path);
            }
            else if (isDirInode(inode)) {
                return inode.getListing();
            }
            else {
                throw FileError.ENOTDIR(path);
            }
        }
        /**
         * We have the entire file as a buffer; optimize readFile.
         */
        readFile(fname, encoding, flag, cb) {
            // Wrap cb in file closing code.
            const oldCb = cb;
            // Get file.
            this.open(fname, flag, 0x1a4, function (err, fd) {
                if (err) {
                    return cb(err);
                }
                cb = function (err, arg) {
                    fd.close(function (err2) {
                        if (!err) {
                            err = err2;
                        }
                        return oldCb(err, arg);
                    });
                };
                const fdCast = fd;
                const fdBuff = fdCast.getBuffer();
                if (encoding === null) {
                    cb(err, copyingSlice(fdBuff));
                }
                else {
                    tryToString(fdBuff, encoding, cb);
                }
            });
        }
        /**
         * Specially-optimized readfile.
         */
        readFileSync(fname, encoding, flag) {
            // Get file.
            const fd = this.openSync(fname, flag, 0x1a4);
            try {
                const fdCast = fd;
                const fdBuff = fdCast.getBuffer();
                if (encoding === null) {
                    return copyingSlice(fdBuff);
                }
                return fdBuff.toString(encoding);
            }
            finally {
                fd.closeSync();
            }
        }
        _getHTTPPath(filePath) {
            if (filePath.charAt(0) === '/') {
                filePath = filePath.slice(1);
            }
            return this.prefixUrl + filePath;
        }
        _requestFileAsync(p, type, cb) {
            this._requestFileAsyncInternal(this._getHTTPPath(p), type, cb);
        }
        _requestFileSync(p, type) {
            return this._requestFileSyncInternal(this._getHTTPPath(p), type);
        }
        /**
         * Only requests the HEAD content, for the file size.
         */
        _requestFileSizeAsync(path, cb) {
            this._requestFileSizeAsyncInternal(this._getHTTPPath(path), cb);
        }
        _requestFileSizeSync(path) {
            return this._requestFileSizeSyncInternal(this._getHTTPPath(path));
        }
    }
    HttpProvider.Name = "http";
    HttpProvider.Options = {
        index: {
            type: ["string", "object"],
            optional: true,
            description: "URL to a file index as a JSON file or the file index object itself, generated with the make_http_index script. Defaults to `index.json`."
        },
        baseUrl: {
            type: "string",
            optional: true,
            description: "Used as the URL prefix for fetched files. Default: Fetch files relative to the index."
        },
        preferXHR: {
            type: "boolean",
            optional: true,
            description: "Whether to prefer XmlHttpRequest or fetch for async operations if both are available. Default: false"
        }
    };

    registry.add("http",HttpProvider);

    return files.providers.HttpProvider = HttpProvider;
});
define('skylark-data-files/inodes/inode',[
    "skylark-langx-binary/buffer",
    '../stats',
    '../file-type'
], function (Buffer,Stats,FileType) {
    'use strict';


    /**
     * Generic inode definition that can easily be serialized.
     */
    class Inode {
        constructor(id, size, mode, atime, mtime, ctime) {
            this.id = id;
            this.size = size;
            this.mode = mode;
            this.atime = atime;
            this.mtime = mtime;
            this.ctime = ctime;
        }

        /**
         * Converts the buffer into an Inode.
         */
        static fromBuffer(buffer) {
            if (buffer === undefined) {
                throw new Error("NO");
            }
            return new Inode(buffer.toString('ascii', 30), buffer.readUInt32LE(0), buffer.readUInt16LE(4), buffer.readDoubleLE(6), buffer.readDoubleLE(14), buffer.readDoubleLE(22));
        }

        /**
         * Handy function that converts the Inode to a Node Stats object.
         */
        toStats() {
            return new Stats((this.mode & 0xF000) === FileType.DIRECTORY ? FileType.DIRECTORY : FileType.FILE, this.size, this.mode, this.atime, this.mtime, this.ctime);
        }

        /**
         * Get the size of this Inode, in bytes.
         */
        getSize() {
            // ASSUMPTION: ID is ASCII (1 byte per char).
            return 30 + this.id.length;
        }

        /**
         * Writes the inode into the start of the buffer.
         */
        toBuffer(buff = Buffer.alloc(this.getSize())) {
            buff.writeUInt32LE(this.size, 0);
            buff.writeUInt16LE(this.mode, 4);
            buff.writeDoubleLE(this.atime, 6);
            buff.writeDoubleLE(this.mtime, 14);
            buff.writeDoubleLE(this.ctime, 22);
            buff.write(this.id, 30, this.id.length, 'ascii');
            return buff;
        }
        
        /**
         * Updates the Inode using information from the stats object. Used by file
         * systems at sync time, e.g.:
         * - Program opens file and gets a File object.
         * - Program mutates file. File object is responsible for maintaining
         *   metadata changes locally -- typically in a Stats object.
         * - Program closes file. File object's metadata changes are synced with the
         *   file system.
         * @return True if any changes have occurred.
         */
        update(stats) {
            let hasChanged = false;
            if (this.size !== stats.size) {
                this.size = stats.size;
                hasChanged = true;
            }
            if (this.mode !== stats.mode) {
                this.mode = stats.mode;
                hasChanged = true;
            }
            const atimeMs = stats.atime.getTime();
            if (this.atime !== atimeMs) {
                this.atime = atimeMs;
                hasChanged = true;
            }
            const mtimeMs = stats.mtime.getTime();
            if (this.mtime !== mtimeMs) {
                this.mtime = mtimeMs;
                hasChanged = true;
            }
            const ctimeMs = stats.ctime.getTime();
            if (this.ctime !== ctimeMs) {
                this.ctime = ctimeMs;
                hasChanged = true;
            }
            return hasChanged;
        }
        // XXX: Copied from Stats. Should reconcile these two into something more
        //      compact.
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
    }


    return Inode;
});
define('skylark-data-files/providers/async-key-value-file',[
    "../files",
    '../preload-file'
], function (files, PreloadFile) {
    'use strict';

    class AsyncKeyValueFile extends PreloadFile {
        constructor(_fs, _path, _flag, _stat, contents) {
            super(_fs, _path, _flag, _stat, contents);
        }
        sync(cb) {
            if (this.isDirty()) {
                this._fs._sync(this.getPath(), this.getBuffer(), this.getStats(), (e) => {
                    if (!e) {
                        this.resetDirty();
                    }
                    cb(e);
                });
            }
            else {
                cb();
            }
        }
        close(cb) {
            this.sync(cb);
        }
    }



    return files.providers.AsyncKeyValueFile = AsyncKeyValueFile;
    
});
define('skylark-data-files/providers/async-key-value-provider',[
    "skylark-langx-strings/generate-uuid",
    "skylark-langx-binary/buffer",
    "skylark-langx-paths",
    "skylark-data-collections/lru-cache",
    "../files",
    "../error-codes",
    '../file-error',
    "../file-type",
    '../utils',
    "../inodes/inode",
    "./base-provider",
    "./async-key-value-file"
 ], function (GenerateRandomID,Buffer,paths,LRUCache, files, ErrorCodes, FileError, FileType, utils, Inode,BaseProvider,AsyncKeyValueFile) {
    'use strict';

    const { emptyBuffer } = utils;

    /**
     * @hidden
     */
    const ROOT_NODE_ID = "/";

    /**
     * @hidden
     */
    let emptyDirNode = null;

    /**
     * Returns an empty directory node.
     * @hidden
     */
    function getEmptyDirNode() {
        if (emptyDirNode) {
            return emptyDirNode;
        }
        return emptyDirNode = Buffer.from("{}");
    }

    /**
     * Helper function. Checks if 'e' is defined. If so, it triggers the callback
     * with 'e' and returns false. Otherwise, returns true.
     * @hidden
     */
    function noError(e, cb) {
        if (e) {
            cb(e);
            return false;
        }
        return true;
    }
    /**
     * Helper function. Checks if 'e' is defined. If so, it aborts the transaction,
     * triggers the callback with 'e', and returns false. Otherwise, returns true.
     * @hidden
     */
    function noErrorTx(e, tx, cb) {
        if (e) {
            tx.abort(() => {
                cb(e);
            });
            return false;
        }
        return true;
    }


    /**
     * An "Asynchronous key-value file system". Stores data to/retrieves data from
     * an underlying asynchronous key-value store.
     */
    class AsyncKeyValueProvider extends BaseProvider {
        constructor(cacheSize) {
            super();
            this._cache = null;
            if (cacheSize > 0) {
                this._cache = new LRUCache(cacheSize);
            }
        }

        static isAvailable() { return true; }
        /**
         * Initializes the file system. Typically called by subclasses' async
         * constructors.
         */
        init(store, cb) {
            this.store = store;
            // INVARIANT: Ensure that the root exists.
            this.makeRootDirectory(cb);
        }

        getName() { return this.store.name(); }
        
        isReadOnly() { return false; }
        
        supportsSymlinks() { return false; }
        
        supportsProps() { return false; }
        
        supportsSynch() { return false; }
        
        /**
         * Delete all contents stored in the file system.
         */
        empty(cb) {
            if (this._cache) {
                this._cache.removeAll();
            }
            this.store.clear((e) => {
                if (noError(e, cb)) {
                    // INVARIANT: Root always exists.
                    this.makeRootDirectory(cb);
                }
            });
        }
        
        rename(oldPath, newPath, cb) {
            // TODO: Make rename compatible with the cache.
            if (this._cache) {
                // Clear and disable cache during renaming process.
                const c = this._cache;
                this._cache = null;
                c.removeAll();
                const oldCb = cb;
                cb = (e) => {
                    // Restore empty cache.
                    this._cache = c;
                    oldCb(e);
                };
            }
            const tx = this.store.beginTransaction('readwrite');
            const oldParent = paths.dirname(oldPath), oldName = paths.basename(oldPath);
            const newParent = paths.dirname(newPath), newName = paths.basename(newPath);
            const inodes = {};
            const lists = {};
            let errorOccurred = false;
            // Invariant: Can't move a folder inside itself.
            // This funny little hack ensures that the check passes only if oldPath
            // is a subpath of newParent. We append '/' to avoid matching folders that
            // are a substring of the bottom-most folder in the path.
            if ((newParent + '/').indexOf(oldPath + '/') === 0) {
                return cb(new FileError(ErrorCodes.EBUSY, oldParent));
            }
            /**
             * Responsible for Phase 2 of the rename operation: Modifying and
             * committing the directory listings. Called once we have successfully
             * retrieved both the old and new parent's inodes and listings.
             */
            const theOleSwitcharoo = () => {
                // Sanity check: Ensure both paths are present, and no error has occurred.
                if (errorOccurred || !lists.hasOwnProperty(oldParent) || !lists.hasOwnProperty(newParent)) {
                    return;
                }
                const oldParentList = lists[oldParent], oldParentINode = inodes[oldParent], newParentList = lists[newParent], newParentINode = inodes[newParent];
                // Delete file from old parent.
                if (!oldParentList[oldName]) {
                    cb(FileError.ENOENT(oldPath));
                }
                else {
                    const fileId = oldParentList[oldName];
                    delete oldParentList[oldName];
                    // Finishes off the renaming process by adding the file to the new
                    // parent.
                    const completeRename = () => {
                        newParentList[newName] = fileId;
                        // Commit old parent's list.
                        tx.put(oldParentINode.id, Buffer.from(JSON.stringify(oldParentList)), true, (e) => {
                            if (noErrorTx(e, tx, cb)) {
                                if (oldParent === newParent) {
                                    // DONE!
                                    tx.commit(cb);
                                }
                                else {
                                    // Commit new parent's list.
                                    tx.put(newParentINode.id, Buffer.from(JSON.stringify(newParentList)), true, (e) => {
                                        if (noErrorTx(e, tx, cb)) {
                                            tx.commit(cb);
                                        }
                                    });
                                }
                            }
                        });
                    };
                    if (newParentList[newName]) {
                        // 'newPath' already exists. Check if it's a file or a directory, and
                        // act accordingly.
                        this.getINode(tx, newPath, newParentList[newName], (e, inode) => {
                            if (noErrorTx(e, tx, cb)) {
                                if (inode.isFile()) {
                                    // Delete the file and continue.
                                    tx.del(inode.id, (e) => {
                                        if (noErrorTx(e, tx, cb)) {
                                            tx.del(newParentList[newName], (e) => {
                                                if (noErrorTx(e, tx, cb)) {
                                                    completeRename();
                                                }
                                            });
                                        }
                                    });
                                }
                                else {
                                    // Can't overwrite a directory using rename.
                                    tx.abort((e) => {
                                        cb(FileError.EPERM(newPath));
                                    });
                                }
                            }
                        });
                    }
                    else {
                        completeRename();
                    }
                }
            };
            /**
             * Grabs a path's inode and directory listing, and shoves it into the
             * inodes and lists hashes.
             */
            const processInodeAndListings = (p) => {
                this.findINodeAndDirListing(tx, p, (e, node, dirList) => {
                    if (e) {
                        if (!errorOccurred) {
                            errorOccurred = true;
                            tx.abort(() => {
                                cb(e);
                            });
                        }
                        // If error has occurred already, just stop here.
                    }
                    else {
                        inodes[p] = node;
                        lists[p] = dirList;
                        theOleSwitcharoo();
                    }
                });
            };
            processInodeAndListings(oldParent);
            if (oldParent !== newParent) {
                processInodeAndListings(newParent);
            }
        }
        stat(p, isLstat, cb) {
            const tx = this.store.beginTransaction('readonly');
            this.findINode(tx, p, (e, inode) => {
                if (noError(e, cb)) {
                    cb(null, inode.toStats());
                }
            });
        }
        createFile(p, flag, mode, cb) {
            const tx = this.store.beginTransaction('readwrite'), data = emptyBuffer();
            this.commitNewFile(tx, p, FileType.FILE, mode, data, (e, newFile) => {
                if (noError(e, cb)) {
                    cb(null, new AsyncKeyValueFile(this, p, flag, newFile.toStats(), data));
                }
            });
        }

        openFile(p, flag, cb) {
            const tx = this.store.beginTransaction('readonly');
            // Step 1: Grab the file's inode.
            this.findINode(tx, p, (e, inode) => {
                if (noError(e, cb)) {
                    // Step 2: Grab the file's data.
                    tx.get(inode.id, (e, data) => {
                        if (noError(e, cb)) {
                            if (data === undefined) {
                                cb(FileError.ENOENT(p));
                            }
                            else {
                                cb(null, new AsyncKeyValueFile(this, p, flag, inode.toStats(), data));
                            }
                        }
                    });
                }
            });
        }

        unlink(p, cb) {
            this.removeEntry(p, false, cb);
        }
        
        rmdir(p, cb) {
            // Check first if directory is empty.
            this.readdir(p, (err, files) => {
                if (err) {
                    cb(err);
                }
                else if (files.length > 0) {
                    cb(FileError.ENOTEMPTY(p));
                }
                else {
                    this.removeEntry(p, true, cb);
                }
            });
        }
        
        mkdir(p, mode, cb) {
            const tx = this.store.beginTransaction('readwrite'), data = Buffer.from('{}');
            this.commitNewFile(tx, p, FileType.DIRECTORY, mode, data, cb);
        }
        
        readdir(p, cb) {
            const tx = this.store.beginTransaction('readonly');
            this.findINode(tx, p, (e, inode) => {
                if (noError(e, cb)) {
                    this.getDirListing(tx, p, inode, (e, dirListing) => {
                        if (noError(e, cb)) {
                            cb(null, Object.keys(dirListing));
                        }
                    });
                }
            });
        }
        
        _sync(p, data, stats, cb) {
            // @todo Ensure mtime updates properly, and use that to determine if a data
            //       update is required.
            const tx = this.store.beginTransaction('readwrite');
            // Step 1: Get the file node's ID.
            this._findINode(tx, paths.dirname(p), paths.basename(p), (e, fileInodeId) => {
                if (noErrorTx(e, tx, cb)) {
                    // Step 2: Get the file inode.
                    this.getINode(tx, p, fileInodeId, (e, fileInode) => {
                        if (noErrorTx(e, tx, cb)) {
                            const inodeChanged = fileInode.update(stats);
                            // Step 3: Sync the data.
                            tx.put(fileInode.id, data, true, (e) => {
                                if (noErrorTx(e, tx, cb)) {
                                    // Step 4: Sync the metadata (if it changed)!
                                    if (inodeChanged) {
                                        tx.put(fileInodeId, fileInode.toBuffer(), true, (e) => {
                                            if (noErrorTx(e, tx, cb)) {
                                                tx.commit(cb);
                                            }
                                        });
                                    }
                                    else {
                                        // No need to sync metadata; return.
                                        tx.commit(cb);
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
        /**
         * Checks if the root directory exists. Creates it if it doesn't.
         */
        makeRootDirectory(cb) {
            const tx = this.store.beginTransaction('readwrite');
            tx.get(ROOT_NODE_ID, (e, data) => {
                if (e || data === undefined) {
                    // Create new inode.
                    const currTime = (new Date()).getTime(), 
                    // Mode 0666
                    dirInode = new Inode(GenerateRandomID(), 4096, 511 | FileType.DIRECTORY, currTime, currTime, currTime);
                    // If the root doesn't exist, the first random ID shouldn't exist,
                    // either.
                    tx.put(dirInode.id, getEmptyDirNode(), false, (e) => {
                        if (noErrorTx(e, tx, cb)) {
                            tx.put(ROOT_NODE_ID, dirInode.toBuffer(), false, (e) => {
                                if (e) {
                                    tx.abort(() => { cb(e); });
                                }
                                else {
                                    tx.commit(cb);
                                }
                            });
                        }
                    });
                }
                else {
                    // We're good.
                    tx.commit(cb);
                }
            });
        }
        /**
         * Helper function for findINode.
         * @param parent The parent directory of the file we are attempting to find.
         * @param filename The filename of the inode we are attempting to find, minus
         *   the parent.
         * @param cb Passed an error or the ID of the file's inode in the file system.
         */
        _findINode(tx, parent, filename, cb) {
            if (this._cache) {
                const id = this._cache.get(paths.join(parent, filename));
                if (id) {
                    return cb(null, id);
                }
            }
            const handleDirectoryListings = (e, inode, dirList) => {
                if (e) {
                    cb(e);
                }
                else if (dirList[filename]) {
                    const id = dirList[filename];
                    if (this._cache) {
                        this._cache.set(paths.join(parent, filename), id);
                    }
                    cb(null, id);
                }
                else {
                    cb(FileError.ENOENT(paths.resolve(parent, filename)));
                }
            };
            if (parent === '/') {
                if (filename === '') {
                    // BASE CASE #1: Return the root's ID.
                    if (this._cache) {
                        this._cache.set(paths.join(parent, filename), ROOT_NODE_ID);
                    }
                    cb(null, ROOT_NODE_ID);
                }
                else {
                    // BASE CASE #2: Find the item in the root node.
                    this.getINode(tx, parent, ROOT_NODE_ID, (e, inode) => {
                        if (noError(e, cb)) {
                            this.getDirListing(tx, parent, inode, (e, dirList) => {
                                // handle_directory_listings will handle e for us.
                                handleDirectoryListings(e, inode, dirList);
                            });
                        }
                    });
                }
            }
            else {
                // Get the parent directory's INode, and find the file in its directory
                // listing.
                this.findINodeAndDirListing(tx, parent, handleDirectoryListings);
            }
        }
        /**
         * Finds the Inode of the given path.
         * @param p The path to look up.
         * @param cb Passed an error or the Inode of the path p.
         * @todo memoize/cache
         */
        findINode(tx, p, cb) {
            this._findINode(tx, paths.dirname(p), paths.basename(p), (e, id) => {
                if (noError(e, cb)) {
                    this.getINode(tx, p, id, cb);
                }
            });
        }
        /**
         * Given the ID of a node, retrieves the corresponding Inode.
         * @param tx The transaction to use.
         * @param p The corresponding path to the file (used for error messages).
         * @param id The ID to look up.
         * @param cb Passed an error or the inode under the given id.
         */
        getINode(tx, p, id, cb) {
            tx.get(id, (e, data) => {
                if (noError(e, cb)) {
                    if (data === undefined) {
                        cb(FileError.ENOENT(p));
                    }
                    else {
                        cb(null, Inode.fromBuffer(data));
                    }
                }
            });
        }
        /**
         * Given the Inode of a directory, retrieves the corresponding directory
         * listing.
         */
        getDirListing(tx, p, inode, cb) {
            if (!inode.isDirectory()) {
                cb(FileError.ENOTDIR(p));
            }
            else {
                tx.get(inode.id, (e, data) => {
                    if (noError(e, cb)) {
                        try {
                            cb(null, JSON.parse(data.toString()));
                        }
                        catch (e) {
                            // Occurs when data is undefined, or corresponds to something other
                            // than a directory listing. The latter should never occur unless
                            // the file system is corrupted.
                            cb(FileError.ENOENT(p));
                        }
                    }
                });
            }
        }
        /**
         * Given a path to a directory, retrieves the corresponding INode and
         * directory listing.
         */
        findINodeAndDirListing(tx, p, cb) {
            this.findINode(tx, p, (e, inode) => {
                if (noError(e, cb)) {
                    this.getDirListing(tx, p, inode, (e, listing) => {
                        if (noError(e, cb)) {
                            cb(null, inode, listing);
                        }
                    });
                }
            });
        }
        /**
         * Adds a new node under a random ID. Retries 5 times before giving up in
         * the exceedingly unlikely chance that we try to reuse a random GUID.
         * @param cb Passed an error or the GUID that the data was stored under.
         */
        addNewNode(tx, data, cb) {
            let retries = 0, currId;
            const reroll = () => {
                if (++retries === 5) {
                    // Max retries hit. Return with an error.
                    cb(new FileError(ErrorCodes.EIO, 'Unable to commit data to key-value store.'));
                }
                else {
                    // Try again.
                    currId = GenerateRandomID();
                    tx.put(currId, data, false, (e, committed) => {
                        if (e || !committed) {
                            reroll();
                        }
                        else {
                            // Successfully stored under 'currId'.
                            cb(null, currId);
                        }
                    });
                }
            };
            reroll();
        }
        /**
         * Commits a new file (well, a FILE or a DIRECTORY) to the file system with
         * the given mode.
         * Note: This will commit the transaction.
         * @param p The path to the new file.
         * @param type The type of the new file.
         * @param mode The mode to create the new file with.
         * @param data The data to store at the file's data node.
         * @param cb Passed an error or the Inode for the new file.
         */
        commitNewFile(tx, p, type, mode, data, cb) {
            const parentDir = paths.dirname(p), fname = paths.basename(p), currTime = (new Date()).getTime();
            // Invariant: The root always exists.
            // If we don't check this prior to taking steps below, we will create a
            // file with name '' in root should p == '/'.
            if (p === '/') {
                return cb(FileError.EEXIST(p));
            }
            // Let's build a pyramid of code!
            // Step 1: Get the parent directory's inode and directory listing
            this.findINodeAndDirListing(tx, parentDir, (e, parentNode, dirListing) => {
                if (noErrorTx(e, tx, cb)) {
                    if (dirListing[fname]) {
                        // File already exists.
                        tx.abort(() => {
                            cb(FileError.EEXIST(p));
                        });
                    }
                    else {
                        // Step 2: Commit data to store.
                        this.addNewNode(tx, data, (e, dataId) => {
                            if (noErrorTx(e, tx, cb)) {
                                // Step 3: Commit the file's inode to the store.
                                const fileInode = new Inode(dataId, data.length, mode | type, currTime, currTime, currTime);
                                this.addNewNode(tx, fileInode.toBuffer(), (e, fileInodeId) => {
                                    if (noErrorTx(e, tx, cb)) {
                                        // Step 4: Update parent directory's listing.
                                        dirListing[fname] = fileInodeId;
                                        tx.put(parentNode.id, Buffer.from(JSON.stringify(dirListing)), true, (e) => {
                                            if (noErrorTx(e, tx, cb)) {
                                                // Step 5: Commit and return the new inode.
                                                tx.commit((e) => {
                                                    if (noErrorTx(e, tx, cb)) {
                                                        cb(null, fileInode);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
        /**
         * Remove all traces of the given path from the file system.
         * @param p The path to remove from the file system.
         * @param isDir Does the path belong to a directory, or a file?
         * @todo Update mtime.
         */
        removeEntry(p, isDir, cb) {
            // Eagerly delete from cache (harmless even if removal fails)
            if (this._cache) {
                this._cache.remove(p);
            }
            const tx = this.store.beginTransaction('readwrite'), parent = paths.dirname(p), fileName = paths.basename(p);
            // Step 1: Get parent directory's node and directory listing.
            this.findINodeAndDirListing(tx, parent, (e, parentNode, parentListing) => {
                if (noErrorTx(e, tx, cb)) {
                    if (!parentListing[fileName]) {
                        tx.abort(() => {
                            cb(FileError.ENOENT(p));
                        });
                    }
                    else {
                        // Remove from directory listing of parent.
                        const fileNodeId = parentListing[fileName];
                        delete parentListing[fileName];
                        // Step 2: Get file inode.
                        this.getINode(tx, p, fileNodeId, (e, fileNode) => {
                            if (noErrorTx(e, tx, cb)) {
                                if (!isDir && fileNode.isDirectory()) {
                                    tx.abort(() => {
                                        cb(FileError.EISDIR(p));
                                    });
                                }
                                else if (isDir && !fileNode.isDirectory()) {
                                    tx.abort(() => {
                                        cb(FileError.ENOTDIR(p));
                                    });
                                }
                                else {
                                    // Step 3: Delete data.
                                    tx.del(fileNode.id, (e) => {
                                        if (noErrorTx(e, tx, cb)) {
                                            // Step 4: Delete node.
                                            tx.del(fileNodeId, (e) => {
                                                if (noErrorTx(e, tx, cb)) {
                                                    // Step 5: Update directory listing.
                                                    tx.put(parentNode.id, Buffer.from(JSON.stringify(parentListing)), true, (e) => {
                                                        if (noErrorTx(e, tx, cb)) {
                                                            tx.commit(cb);
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
    }


    return  files.providers.AsyncKeyValueProvider = AsyncKeyValueProvider;
});
define('skylark-data-files/providers/indexeddb/indexed-db-ro-transaction',[
    '../../file-error',
    '../../error-codes',
    '../async-key-value-provider',
    '../../utils'
], function (FileError,ErrorCodes, AsyncKeyValueProvider,  utils) {
    'use strict';


    const { arrayBuffer2Buffer, buffer2ArrayBuffer }  = utils;

    /**
     * Converts a DOMException or a DOMError from an IndexedDB event into a
     * standardized BrowserFS API error.
     * @hidden
     */
    function convertError(e, message = e.toString()) {
        switch (e.name) {
            case "NotFoundError":
                return new FileError(ErrorCodes.ENOENT, message);
            case "QuotaExceededError":
                return new FileError(ErrorCodes.ENOSPC, message);
            default:
                // The rest do not seem to map cleanly to standard error codes.
                return new FileError(ErrorCodes.EIO, message);
        }
    }
    /**
     * Produces a new onerror handler for IDB. Our errors are always fatal, so we
     * handle them generically: Call the user-supplied callback with a translated
     * version of the error, and let the error bubble up.
     * @hidden
     */
    function onErrorHandler(cb, code = ErrorCodes.EIO, message = null) {
        return function (e) {
            // Prevent the error from canceling the transaction.
            e.preventDefault();
            cb(new FileError(code, message !== null ? message : undefined));
        };
    }
    /**
     * @hidden
     */
    class IndexedDBROTransaction {
        constructor(tx, store) {
            this.tx = tx;
            this.store = store;
        }
        get(key, cb) {
            try {
                const r = this.store.get(key);
                r.onerror = onErrorHandler(cb);
                r.onsuccess = (event) => {
                    // IDB returns the value 'undefined' when you try to get keys that
                    // don't exist. The caller expects this behavior.
                    const result = event.target.result;
                    if (result === undefined) {
                        cb(null, result);
                    }
                    else {
                        // IDB data is stored as an ArrayBuffer
                        cb(null, arrayBuffer2Buffer(result));
                    }
                };
            }
            catch (e) {
                cb(convertError(e));
            }
        }
    }



    return IndexedDBROTransaction;
});
define('skylark-data-files/providers/indexeddb/indexed-db-rw-transaction',[
    '../../file-error',
    '../../error-codes',
    '../async-key-value-provider',
    '../../utils',
    "./indexed-db-ro-transaction"
], function (FileError,ErrorCodes, AsyncKeyValueProvider,  utils,IndexedDBROTransaction) {
    'use strict';


    const { arrayBuffer2Buffer, buffer2ArrayBuffer }  = utils;

    /**
     * Get the indexedDB constructor for the current browser.
     * @hidden
     */
    const indexedDB = window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB;
    /**
     * Converts a DOMException or a DOMError from an IndexedDB event into a
     * standardized BrowserFS API error.
     * @hidden
     */
    function convertError(e, message = e.toString()) {
        switch (e.name) {
            case "NotFoundError":
                return new FileError(ErrorCodes.ENOENT, message);
            case "QuotaExceededError":
                return new FileError(ErrorCodes.ENOSPC, message);
            default:
                // The rest do not seem to map cleanly to standard error codes.
                return new FileError(ErrorCodes.EIO, message);
        }
    }
    /**
     * Produces a new onerror handler for IDB. Our errors are always fatal, so we
     * handle them generically: Call the user-supplied callback with a translated
     * version of the error, and let the error bubble up.
     * @hidden
     */
    function onErrorHandler(cb, code = ErrorCodes.EIO, message = null) {
        return function (e) {
            // Prevent the error from canceling the transaction.
            e.preventDefault();
            cb(new FileError(code, message !== null ? message : undefined));
        };
    }

    /**
     * @hidden
     */
    class IndexedDBRWTransaction extends IndexedDBROTransaction {
        constructor(tx, store) {
            super(tx, store);
        }
        put(key, data, overwrite, cb) {
            try {
                const arraybuffer = buffer2ArrayBuffer(data);
                let r;
                // Note: 'add' will never overwrite an existing key.
                r = overwrite ? this.store.put(arraybuffer, key) : this.store.add(arraybuffer, key);
                // XXX: NEED TO RETURN FALSE WHEN ADD HAS A KEY CONFLICT. NO ERROR.
                r.onerror = onErrorHandler(cb);
                r.onsuccess = (event) => {
                    cb(null, true);
                };
            }
            catch (e) {
                cb(convertError(e));
            }
        }
        del(key, cb) {
            try {
                // NOTE: IE8 has a bug with identifiers named 'delete' unless used as a string
                // like this.
                // http://stackoverflow.com/a/26479152
                const r = this.store['delete'](key);
                r.onerror = onErrorHandler(cb);
                r.onsuccess = (event) => {
                    cb();
                };
            }
            catch (e) {
                cb(convertError(e));
            }
        }
        commit(cb) {
            // Return to the event loop to commit the transaction.
            setTimeout(cb, 0);
        }
        abort(cb) {
            let _e = null;
            try {
                this.tx.abort();
            }
            catch (e) {
                _e = convertError(e);
            }
            finally {
                cb(_e);
            }
        }
    }


    return IndexedDBRWTransaction;
});
define('skylark-data-files/providers/indexeddb/indexed-db-store',[
    '../../file-error',
    '../../error-codes',
    "./indexed-db-ro-transaction",
    "./indexed-db-rw-transaction"
], function (FileError,ErrorCodes,IndexedDBROTransaction,IndexedDBRWTransaction) {
    'use strict';


    /**
     * Converts a DOMException or a DOMError from an IndexedDB event into a
     * standardized BrowserFS API error.
     * @hidden
     */
    function convertError(e, message = e.toString()) {
        switch (e.name) {
            case "NotFoundError":
                return new FileError(ErrorCodes.ENOENT, message);
            case "QuotaExceededError":
                return new FileError(ErrorCodes.ENOSPC, message);
            default:
                // The rest do not seem to map cleanly to standard error codes.
                return new FileError(ErrorCodes.EIO, message);
        }
    }
    /**
     * Produces a new onerror handler for IDB. Our errors are always fatal, so we
     * handle them generically: Call the user-supplied callback with a translated
     * version of the error, and let the error bubble up.
     * @hidden
     */
    function onErrorHandler(cb, code = ErrorCodes.EIO, message = null) {
        return function (e) {
            // Prevent the error from canceling the transaction.
            e.preventDefault();
            cb(new FileError(code, message !== null ? message : undefined));
        };
    }

    class IndexedDBStore {
        constructor(db, storeName) {
            this.db = db;
            this.storeName = storeName;
        }
        static Create(storeName, cb) {
            const openReq = indexedDB.open(storeName, 1);
            openReq.onupgradeneeded = (event) => {
                const db = event.target.result;
                // Huh. This should never happen; we're at version 1. Why does another
                // database exist?
                if (db.objectStoreNames.contains(storeName)) {
                    db.deleteObjectStore(storeName);
                }
                db.createObjectStore(storeName);
            };
            openReq.onsuccess = (event) => {
                cb(null, new IndexedDBStore(event.target.result, storeName));
            };
            openReq.onerror = onErrorHandler(cb, ErrorCodes.EACCES);
        }
        name() {
            return IndexedDBProvider.Name + " - " + this.storeName;
        }
        clear(cb) {
            try {
                const tx = this.db.transaction(this.storeName, 'readwrite'), objectStore = tx.objectStore(this.storeName), r = objectStore.clear();
                r.onsuccess = (event) => {
                    // Use setTimeout to commit transaction.
                    setTimeout(cb, 0);
                };
                r.onerror = onErrorHandler(cb);
            }
            catch (e) {
                cb(convertError(e));
            }
        }
        beginTransaction(type = 'readonly') {
            const tx = this.db.transaction(this.storeName, type), objectStore = tx.objectStore(this.storeName);
            if (type === 'readwrite') {
                return new IndexedDBRWTransaction(tx, objectStore);
            }
            else if (type === 'readonly') {
                return new IndexedDBROTransaction(tx, objectStore);
            }
            else {
                throw new FileError(ErrorCodes.EINVAL, 'Invalid transaction type.');
            }
        }
    }


    return IndexedDBStore;
});
define('skylark-data-files/providers/indexeddb/indexed-db-provider',[
    "../../files",
    '../../file-error',
    '../../error-codes',
    '../async-key-value-provider',
    "../registry",
    '../../utils',
    "./indexed-db-store",
    "./indexed-db-ro-transaction",
    "./indexed-db-rw-transaction"
], function (files,FileError,ErrorCodes, AsyncKeyValueProvider,  registry,utils,IndexedDBStore,IndexedDBROTransaction,IndexedDBRWTransaction) {
    'use strict';

    /**
     * Get the indexedDB constructor for the current browser.
     * @hidden
     */
    const indexedDB = window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB;
    /**
     * A file system that uses the IndexedDB key value file system.
     */
    class IndexedDBProvider extends AsyncKeyValueProvider {
        constructor(cacheSize) {
            super(cacheSize);
        }
        /**
         * Constructs an IndexedDB file system with the given options.
         */
        static Create(opts = {}, cb) {
            IndexedDBStore.Create(opts.storeName ? opts.storeName : 'browserfs', (e, store) => {
                if (store) {
                    const idbfs = new IndexedDBProvider(typeof (opts.cacheSize) === 'number' ? opts.cacheSize : 100);
                    idbfs.init(store, (e) => {
                        if (e) {
                            cb(e);
                        }
                        else {
                            cb(null, idbfs);
                        }
                    });
                }
                else {
                    cb(e);
                }
            });
        }
        static isAvailable() {
            // In Safari's private browsing mode, indexedDB.open returns NULL.
            // In Firefox, it throws an exception.
            // In Chrome, it "just works", and clears the database when you leave the page.
            // Untested: Opera, IE.
            try {
                return typeof indexedDB !== 'undefined' && null !== indexedDB.open("__browserfs_test__");
            }
            catch (e) {
                return false;
            }
        }
    }
    IndexedDBProvider.Name = "IndexedDB";
    IndexedDBProvider.Options = {
        storeName: {
            type: "string",
            optional: true,
            description: "The name of this file system. You can have multiple IndexedDB file systems operating at once, but each must have a different name."
        },
        cacheSize: {
            type: "number",
            optional: true,
            description: "The size of the inode cache. Defaults to 100. A size of 0 or below disables caching."
        }
    };


    IndexedDBProvider.IndexedDBROTransaction = IndexedDBROTransaction;
    IndexedDBProvider.IndexedDBRWTransaction = IndexedDBRWTransaction;
    IndexedDBProvider.IndexedDBStore = IndexedDBStore;

    registry.add("indexedDB",IndexedDBProvider);

    return files.providers.IndexedDBProvider = IndexedDBProvider;
});
define('skylark-data-files/providers/synchronous-provider',[
    "skylark-langx-binary/buffer",
    "skylark-langx-paths",
    "../files",
    "../error-codes",
    '../file-error',
    '../action-type',
    '../file-flag',
    '../utils',
    "./base-provider"
], function (Buffer,paths, files,ErrorCodes, FileError, ActionType, FileFlag, utils,BaseProvider) {
    'use strict';

    const { fail } = utils;

    /**
     * Implements the asynchronous API in terms of the synchronous API.
     * @class SynchronousProvider
     */
    class SynchronousProvider extends BaseProvider {
        supportsSynch() {
            return true;
        }
        rename(oldPath, newPath, cb) {
            try {
                this.renameSync(oldPath, newPath);
                cb();
            }
            catch (e) {
                cb(e);
            }
        }
        stat(p, isLstat, cb) {
            try {
                cb(null, this.statSync(p, isLstat));
            }
            catch (e) {
                cb(e);
            }
        }
        open(p, flags, mode, cb) {
            try {
                cb(null, this.openSync(p, flags, mode));
            }
            catch (e) {
                cb(e);
            }
        }
        unlink(p, cb) {
            try {
                this.unlinkSync(p);
                cb();
            }
            catch (e) {
                cb(e);
            }
        }
        rmdir(p, cb) {
            try {
                this.rmdirSync(p);
                cb();
            }
            catch (e) {
                cb(e);
            }
        }
        mkdir(p, mode, cb) {
            try {
                this.mkdirSync(p, mode);
                cb();
            }
            catch (e) {
                cb(e);
            }
        }
        readdir(p, cb) {
            try {
                cb(null, this.readdirSync(p));
            }
            catch (e) {
                cb(e);
            }
        }
        chmod(p, isLchmod, mode, cb) {
            try {
                this.chmodSync(p, isLchmod, mode);
                cb();
            }
            catch (e) {
                cb(e);
            }
        }
        chown(p, isLchown, uid, gid, cb) {
            try {
                this.chownSync(p, isLchown, uid, gid);
                cb();
            }
            catch (e) {
                cb(e);
            }
        }
        utimes(p, atime, mtime, cb) {
            try {
                this.utimesSync(p, atime, mtime);
                cb();
            }
            catch (e) {
                cb(e);
            }
        }
        link(srcpath, dstpath, cb) {
            try {
                this.linkSync(srcpath, dstpath);
                cb();
            }
            catch (e) {
                cb(e);
            }
        }
        symlink(srcpath, dstpath, type, cb) {
            try {
                this.symlinkSync(srcpath, dstpath, type);
                cb();
            }
            catch (e) {
                cb(e);
            }
        }
        readlink(p, cb) {
            try {
                cb(null, this.readlinkSync(p));
            }
            catch (e) {
                cb(e);
            }
        }
    }


    return files.providers.SynchronousProvider =  SynchronousProvider;
});
define('skylark-data-files/providers/sync-key-value-provider',[
    "skylark-langx-strings/generate-uuid",
    "skylark-langx-binary/buffer",
    "skylark-langx-paths",
    "../files",
    "../error-codes",
    '../file-error',
    "./base-provider",
    "./synchronous-provider",
    '../utils'
], function (GenerateRandomID, Buffer,paths,files,ErrorCodes, FileError,BaseProvider, SynchronousProvider,  utils) {
    'use strict';

    const { emptyBuffer } = utils;


    /**
     * A "Synchronous key-value file system". Stores data to/retrieves data from an
     * underlying key-value store.
     *
     * We use a unique ID for each node in the file system. The root node has a
     * fixed ID.
     * @todo Introduce Node ID caching.
     * @todo Check modes.
     */
    class SyncKeyValueProvider extends SynchronousProvider {
        static isAvailable() { return true; }
        constructor(options) {
            super();
            this.store = options.store;
            // INVARIANT: Ensure that the root exists.
            this.makeRootDirectory();
        }
        getName() { return this.store.name(); }
        isReadOnly() { return false; }
        supportsSymlinks() { return false; }
        supportsProps() { return false; }
        supportsSynch() { return true; }
        /**
         * Delete all contents stored in the file system.
         */
        empty() {
            this.store.clear();
            // INVARIANT: Root always exists.
            this.makeRootDirectory();
        }
        renameSync(oldPath, newPath) {
            const tx = this.store.beginTransaction('readwrite'), oldParent = paths.dirname(oldPath), oldName = paths.basename(oldPath), newParent = paths.dirname(newPath), newName = paths.basename(newPath), 
            // Remove oldPath from parent's directory listing.
            oldDirNode = this.findINode(tx, oldParent), oldDirList = this.getDirListing(tx, oldParent, oldDirNode);
            if (!oldDirList[oldName]) {
                throw FileError.ENOENT(oldPath);
            }
            const nodeId = oldDirList[oldName];
            delete oldDirList[oldName];
            // Invariant: Can't move a folder inside itself.
            // This funny little hack ensures that the check passes only if oldPath
            // is a subpath of newParent. We append '/' to avoid matching folders that
            // are a substring of the bottom-most folder in the path.
            if ((newParent + '/').indexOf(oldPath + '/') === 0) {
                throw new FileError(ErrorCodes.EBUSY, oldParent);
            }
            // Add newPath to parent's directory listing.
            let newDirNode, newDirList;
            if (newParent === oldParent) {
                // Prevent us from re-grabbing the same directory listing, which still
                // contains oldName.
                newDirNode = oldDirNode;
                newDirList = oldDirList;
            }
            else {
                newDirNode = this.findINode(tx, newParent);
                newDirList = this.getDirListing(tx, newParent, newDirNode);
            }
            if (newDirList[newName]) {
                // If it's a file, delete it.
                const newNameNode = this.getINode(tx, newPath, newDirList[newName]);
                if (newNameNode.isFile()) {
                    try {
                        tx.del(newNameNode.id);
                        tx.del(newDirList[newName]);
                    }
                    catch (e) {
                        tx.abort();
                        throw e;
                    }
                }
                else {
                    // If it's a directory, throw a permissions error.
                    throw FileError.EPERM(newPath);
                }
            }
            newDirList[newName] = nodeId;
            // Commit the two changed directory listings.
            try {
                tx.put(oldDirNode.id, Buffer.from(JSON.stringify(oldDirList)), true);
                tx.put(newDirNode.id, Buffer.from(JSON.stringify(newDirList)), true);
            }
            catch (e) {
                tx.abort();
                throw e;
            }
            tx.commit();
        }
        statSync(p, isLstat) {
            // Get the inode to the item, convert it into a Stats object.
            return this.findINode(this.store.beginTransaction('readonly'), p).toStats();
        }
        createFileSync(p, flag, mode) {
            const tx = this.store.beginTransaction('readwrite'), data = emptyBuffer(), newFile = this.commitNewFile(tx, p, FileType.FILE, mode, data);
            // Open the file.
            return new SyncKeyValueFile(this, p, flag, newFile.toStats(), data);
        }
        openFileSync(p, flag) {
            const tx = this.store.beginTransaction('readonly'), node = this.findINode(tx, p), data = tx.get(node.id);
            if (data === undefined) {
                throw FileError.ENOENT(p);
            }
            return new SyncKeyValueFile(this, p, flag, node.toStats(), data);
        }
        unlinkSync(p) {
            this.removeEntry(p, false);
        }
        rmdirSync(p) {
            // Check first if directory is empty.
            if (this.readdirSync(p).length > 0) {
                throw FileError.ENOTEMPTY(p);
            }
            else {
                this.removeEntry(p, true);
            }
        }
        mkdirSync(p, mode) {
            const tx = this.store.beginTransaction('readwrite'), data = Buffer.from('{}');
            this.commitNewFile(tx, p, FileType.DIRECTORY, mode, data);
        }
        readdirSync(p) {
            const tx = this.store.beginTransaction('readonly');
            return Object.keys(this.getDirListing(tx, p, this.findINode(tx, p)));
        }
        _syncSync(p, data, stats) {
            // @todo Ensure mtime updates properly, and use that to determine if a data
            //       update is required.
            const tx = this.store.beginTransaction('readwrite'), 
            // We use the _findInode helper because we actually need the INode id.
            fileInodeId = this._findINode(tx, paths.dirname(p), paths.basename(p)), fileInode = this.getINode(tx, p, fileInodeId), inodeChanged = fileInode.update(stats);
            try {
                // Sync data.
                tx.put(fileInode.id, data, true);
                // Sync metadata.
                if (inodeChanged) {
                    tx.put(fileInodeId, fileInode.toBuffer(), true);
                }
            }
            catch (e) {
                tx.abort();
                throw e;
            }
            tx.commit();
        }
        /**
         * Checks if the root directory exists. Creates it if it doesn't.
         */
        makeRootDirectory() {
            const tx = this.store.beginTransaction('readwrite');
            if (tx.get(ROOT_NODE_ID) === undefined) {
                // Create new inode.
                const currTime = (new Date()).getTime(), 
                // Mode 0666
                dirInode = new Inode(GenerateRandomID(), 4096, 511 | FileType.DIRECTORY, currTime, currTime, currTime);
                // If the root doesn't exist, the first random ID shouldn't exist,
                // either.
                tx.put(dirInode.id, getEmptyDirNode(), false);
                tx.put(ROOT_NODE_ID, dirInode.toBuffer(), false);
                tx.commit();
            }
        }
        /**
         * Helper function for findINode.
         * @param parent The parent directory of the file we are attempting to find.
         * @param filename The filename of the inode we are attempting to find, minus
         *   the parent.
         * @return string The ID of the file's inode in the file system.
         */
        _findINode(tx, parent, filename) {
            const readDirectory = (inode) => {
                // Get the root's directory listing.
                const dirList = this.getDirListing(tx, parent, inode);
                // Get the file's ID.
                if (dirList[filename]) {
                    return dirList[filename];
                }
                else {
                    throw FileError.ENOENT(paths.resolve(parent, filename));
                }
            };
            if (parent === '/') {
                if (filename === '') {
                    // BASE CASE #1: Return the root's ID.
                    return ROOT_NODE_ID;
                }
                else {
                    // BASE CASE #2: Find the item in the root ndoe.
                    return readDirectory(this.getINode(tx, parent, ROOT_NODE_ID));
                }
            }
            else {
                return readDirectory(this.getINode(tx, parent + paths.sep + filename, this._findINode(tx, paths.dirname(parent), paths.basename(parent))));
            }
        }
        /**
         * Finds the Inode of the given path.
         * @param p The path to look up.
         * @return The Inode of the path p.
         * @todo memoize/cache
         */
        findINode(tx, p) {
            return this.getINode(tx, p, this._findINode(tx, paths.dirname(p), paths.basename(p)));
        }
        /**
         * Given the ID of a node, retrieves the corresponding Inode.
         * @param tx The transaction to use.
         * @param p The corresponding path to the file (used for error messages).
         * @param id The ID to look up.
         */
        getINode(tx, p, id) {
            const inode = tx.get(id);
            if (inode === undefined) {
                throw FileError.ENOENT(p);
            }
            return Inode.fromBuffer(inode);
        }
        /**
         * Given the Inode of a directory, retrieves the corresponding directory
         * listing.
         */
        getDirListing(tx, p, inode) {
            if (!inode.isDirectory()) {
                throw FileError.ENOTDIR(p);
            }
            const data = tx.get(inode.id);
            if (data === undefined) {
                throw FileError.ENOENT(p);
            }
            return JSON.parse(data.toString());
        }
        /**
         * Creates a new node under a random ID. Retries 5 times before giving up in
         * the exceedingly unlikely chance that we try to reuse a random GUID.
         * @return The GUID that the data was stored under.
         */
        addNewNode(tx, data) {
            const retries = 0;
            let currId;
            while (retries < 5) {
                try {
                    currId = GenerateRandomID();
                    tx.put(currId, data, false);
                    return currId;
                }
                catch (e) {
                    // Ignore and reroll.
                }
            }
            throw new FileError(ErrorCodes.EIO, 'Unable to commit data to key-value store.');
        }
        /**
         * Commits a new file (well, a FILE or a DIRECTORY) to the file system with
         * the given mode.
         * Note: This will commit the transaction.
         * @param p The path to the new file.
         * @param type The type of the new file.
         * @param mode The mode to create the new file with.
         * @param data The data to store at the file's data node.
         * @return The Inode for the new file.
         */
        commitNewFile(tx, p, type, mode, data) {
            const parentDir = paths.dirname(p), fname = paths.basename(p), parentNode = this.findINode(tx, parentDir), dirListing = this.getDirListing(tx, parentDir, parentNode), currTime = (new Date()).getTime();
            // Invariant: The root always exists.
            // If we don't check this prior to taking steps below, we will create a
            // file with name '' in root should p == '/'.
            if (p === '/') {
                throw FileError.EEXIST(p);
            }
            // Check if file already exists.
            if (dirListing[fname]) {
                throw FileError.EEXIST(p);
            }
            let fileNode;
            try {
                // Commit data.
                const dataId = this.addNewNode(tx, data);
                fileNode = new Inode(dataId, data.length, mode | type, currTime, currTime, currTime);
                // Commit file node.
                const fileNodeId = this.addNewNode(tx, fileNode.toBuffer());
                // Update and commit parent directory listing.
                dirListing[fname] = fileNodeId;
                tx.put(parentNode.id, Buffer.from(JSON.stringify(dirListing)), true);
            }
            catch (e) {
                tx.abort();
                throw e;
            }
            tx.commit();
            return fileNode;
        }
        /**
         * Remove all traces of the given path from the file system.
         * @param p The path to remove from the file system.
         * @param isDir Does the path belong to a directory, or a file?
         * @todo Update mtime.
         */
        removeEntry(p, isDir) {
            const tx = this.store.beginTransaction('readwrite'), parent = paths.dirname(p), parentNode = this.findINode(tx, parent), parentListing = this.getDirListing(tx, parent, parentNode), fileName = paths.basename(p);
            if (!parentListing[fileName]) {
                throw FileError.ENOENT(p);
            }
            // Remove from directory listing of parent.
            const fileNodeId = parentListing[fileName];
            delete parentListing[fileName];
            // Get file inode.
            const fileNode = this.getINode(tx, p, fileNodeId);
            if (!isDir && fileNode.isDirectory()) {
                throw FileError.EISDIR(p);
            }
            else if (isDir && !fileNode.isDirectory()) {
                throw FileError.ENOTDIR(p);
            }
            try {
                // Delete data.
                tx.del(fileNode.id);
                // Delete node.
                tx.del(fileNodeId);
                // Update directory listing.
                tx.put(parentNode.id, Buffer.from(JSON.stringify(parentListing)), true);
            }
            catch (e) {
                tx.abort();
                throw e;
            }
            // Success.
            tx.commit();
        }
    }


    return files.providers.SyncKeyValueProvider = SyncKeyValueProvider;
});
define('skylark-data-files/providers/simple-sync-rw-transaction',[
    "../files",
    "../error-codes",
    '../file-error'
], function (files, ErrorCodes, FileError) {
    'use strict';


    /**
     * A simple RW transaction for simple synchronous key-value stores.
     */
    class SimpleSyncRWTransaction {
        constructor(store) {
            this.store = store;
            /**
             * Stores data in the keys we modify prior to modifying them.
             * Allows us to roll back commits.
             */
            this.originalData = {};
            /**
             * List of keys modified in this transaction, if any.
             */
            this.modifiedKeys = [];
        }
        get(key) {
            const val = this.store.get(key);
            this.stashOldValue(key, val);
            return val;
        }
        put(key, data, overwrite) {
            this.markModified(key);
            return this.store.put(key, data, overwrite);
        }
        del(key) {
            this.markModified(key);
            this.store.del(key);
        }
        commit() { }
        abort() {
            // Rollback old values.
            for (const key of this.modifiedKeys) {
                const value = this.originalData[key];
                if (!value) {
                    // Key didn't exist.
                    this.store.del(key);
                }
                else {
                    // Key existed. Store old value.
                    this.store.put(key, value, true);
                }
            }
        }
        /**
         * Stashes given key value pair into `originalData` if it doesn't already
         * exist. Allows us to stash values the program is requesting anyway to
         * prevent needless `get` requests if the program modifies the data later
         * on during the transaction.
         */
        stashOldValue(key, value) {
            // Keep only the earliest value in the transaction.
            if (!this.originalData.hasOwnProperty(key)) {
                this.originalData[key] = value;
            }
        }
        /**
         * Marks the given key as modified, and stashes its value if it has not been
         * stashed already.
         */
        markModified(key) {
            if (this.modifiedKeys.indexOf(key) === -1) {
                this.modifiedKeys.push(key);
                if (!this.originalData.hasOwnProperty(key)) {
                    this.originalData[key] = this.store.get(key);
                }
            }
        }
    }

    return files.providers.SimpleSyncRWTransaction = SimpleSyncRWTransaction;
});
define('skylark-data-files/providers/inmemory/in-memory-store',[
    '../simple-sync-rw-transaction'
], function (SimpleSyncRWTransaction) {
    'use strict';

    /**
     * A simple in-memory key-value store backed by a JavaScript object.
     */
    class InMemoryStore {
        constructor() {
            this.store = {};
        }
        clear() { this.store = {}; }
        beginTransaction(type) {
            return new SimpleSyncRWTransaction(this);
        }
        get(key) {
            return this.store[key];
        }
        put(key, data, overwrite) {
            if (!overwrite && this.store.hasOwnProperty(key)) {
                return false;
            }
            this.store[key] = data;
            return true;
        }
        del(key) {
            delete this.store[key];
        }
    }


    return InMemoryStore;
});
define('skylark-data-files/providers/inmemory/in-memory-provider',[
    "../../files",
    "../registry",
    '../sync-key-value-provider',
    "./in-memory-store"
], function (files,registry,SyncKeyValueProvider,InMemoryStore) {
    'use strict';

    /**
     * A simple in-memory file system backed by an InMemoryStore.
     * Files are not persisted across page loads.
     */
    class InMemoryProvider extends SyncKeyValueProvider {
        name() { return InMemoryProvider.Name; }
        constructor() {
            super({ store: new InMemoryStore() });
        }
        /**
         * Creates an InMemoryProvider instance.
         */
        static Create(options, cb) {
            cb(null, new InMemoryProvider());
        }
    }
    InMemoryProvider.Name = "InMemory";
    InMemoryProvider.Options = {};

    InMemoryProvider.InMemoryStore = InMemoryStore;


    registry.add("inMemory",InMemoryProvider);


    return files.providers.InMemoryProvider = InMemoryProvider;
});
define('skylark-data-files/providers/localstorage/local-storage-store',[
    "skylark-langx-binary/buffer",
    '../simple-sync-rw-transaction',
    '../../error-codes',
    '../../file-error',
], function (Buffer,SimpleSyncRWTransaction, ErrorCodes,FileError) {
    'use strict';


    /**
     * A synchronous key-value store backed by localStorage.
     */
    class LocalStorageStore {
        name() {
            return LocalStorageProvider.Name;
        }
        clear() {
            window.localStorage.clear();
        }
        beginTransaction(type) {
            // No need to differentiate.
            return new SimpleSyncRWTransaction(this);
        }
        get(key) {
            try {
                const data = window.localStorage.getItem(key);
                if (data !== null) {
                    return Buffer.from(data, binaryEncoding);
                }
            }
            catch (e) {
                // Do nothing.
            }
            // Key doesn't exist, or a failure occurred.
            return undefined;
        }
        put(key, data, overwrite) {
            try {
                if (!overwrite && window.localStorage.getItem(key) !== null) {
                    // Don't want to overwrite the key!
                    return false;
                }
                window.localStorage.setItem(key, data.toString(binaryEncoding));
                return true;
            }
            catch (e) {
                throw new FileError(ErrorCodes.ENOSPC, "LocalStorage is full.");
            }
        }
        del(key) {
            try {
                window.localStorage.removeItem(key);
            }
            catch (e) {
                throw new FileError(ErrorCodes.EIO, "Unable to delete key " + key + ": " + e);
            }
        }
    }


    return LocalStorageStore;
});
define('skylark-data-files/providers/localstorage/local-storage-provider',[
    "skylark-langx-binary/buffer",
    "../../files",
    "../registry",
    '../sync-key-value-provider',
    '../../error-codes',
    '../../file-error',
    "./local-storage-store"
], function (Buffer,files,registry,SyncKeyValueProvider, ErrorCodes,FileError,LocalStorageStore) {
    'use strict';


    /**
     * Some versions of FF and all versions of IE do not support the full range of
     * 16-bit numbers encoded as characters, as they enforce UTF-16 restrictions.
     * @url http://stackoverflow.com/questions/11170716/are-there-any-characters-that-are-not-allowed-in-localstorage/11173673#11173673
     * @hidden
     */
    let supportsBinaryString = false, binaryEncoding;
    try {
        window.localStorage.setItem("__test__", String.fromCharCode(0xD800));
        supportsBinaryString = window.localStorage.getItem("__test__") === String.fromCharCode(0xD800);
    }
    catch (e) {
        // IE throws an exception.
        supportsBinaryString = false;
    }
    
    binaryEncoding = supportsBinaryString ? 'binary_string' : 'binary_string_ie';
    if (!Buffer.isEncoding(binaryEncoding)) {
        // Fallback for non BrowserFS implementations of buffer that lack a
        // binary_string format.
        binaryEncoding = "base64";
    }

    /**
     * A synchronous file system backed by localStorage. Connects our
     * LocalStorageStore to our SyncKeyValueProvider.
     */
    class LocalStorageProvider extends SyncKeyValueProvider {
        /**
         * Creates a new LocalStorage file system using the contents of `localStorage`.
         */
        constructor() { super({ store: new LocalStorageStore() }); }
        /**
         * Creates a LocalStorageProvider instance.
         */
        static Create(options, cb) {
            cb(null, new LocalStorageProvider());
        }
        static isAvailable() {
            return typeof window.localStorage !== 'undefined';
        }
    }

    LocalStorageProvider.Name = "LocalStorage";
    LocalStorageProvider.Options = {};
    
    LocalStorageProvider.LocalStorageStore = LocalStorageStore;

    registry.add("localStorage",LocalStorageProvider);


    return files.providers.LocalStorageProvider = LocalStorageProvider;
});
define('skylark-data-files/providers/mutex',[
    "skylark-langx-funcs/defer"
], function (defer) {
    'use strict';
    /**
     * Non-recursive mutex
     * @hidden
     */
    class Mutex {
        constructor() {
            this._locked = false;
            this._waiters = [];
        }
        lock(cb) {
            if (this._locked) {
                this._waiters.push(cb);
                return;
            }
            this._locked = true;
            cb();
        }
        unlock() {
            if (!this._locked) {
                throw new Error('unlock of a non-locked mutex');
            }
            const next = this._waiters.shift();
            // don't unlock - we want to queue up next for the
            // _end_ of the current task execution, but we don't
            // want it to be called inline with whatever the
            // current stack is.  This way we still get the nice
            // behavior that an unlock immediately followed by a
            // lock won't cause starvation.
            if (next) {
                defer(next);
                return;
            }
            this._locked = false;
        }
        tryLock() {
            if (this._locked) {
                return false;
            }
            this._locked = true;
            return true;
        }
        isLocked() {
            return this._locked;
        }
    }

    return Mutex;
});
define('skylark-data-files/providers/locked-provider',[
    "../files",
    './mutex'
], function (files,Mutex) {
    'use strict';
    /**
     * This class serializes access to an underlying async filesystem.
     * For example, on an OverlayFS instance with an async lower
     * directory operations like rename and rmdir may involve multiple
     * requests involving both the upper and lower filesystems -- they
     * are not executed in a single atomic step.  OverlayFS uses this
     * LockedProvider to avoid having to reason about the correctness of
     * multiple requests interleaving.
     */
    class LockedProvider {
        constructor(fs) {
            this._fs = fs;
            this._mu = new Mutex();
        }
        getName() {
            return 'LockedProvider<' + this._fs.getName() + '>';
        }
        getFSUnlocked() {
            return this._fs;
        }
        diskSpace(p, cb) {
            // FIXME: should this lock?
            this._fs.diskSpace(p, cb);
        }
        isReadOnly() {
            return this._fs.isReadOnly();
        }
        supportsLinks() {
            return this._fs.supportsLinks();
        }
        supportsProps() {
            return this._fs.supportsProps();
        }
        supportsSynch() {
            return this._fs.supportsSynch();
        }
        rename(oldPath, newPath, cb) {
            this._mu.lock(() => {
                this._fs.rename(oldPath, newPath, (err) => {
                    this._mu.unlock();
                    cb(err);
                });
            });
        }
        renameSync(oldPath, newPath) {
            if (this._mu.isLocked()) {
                throw new Error('invalid sync call');
            }
            return this._fs.renameSync(oldPath, newPath);
        }
        stat(p, isLstat, cb) {
            this._mu.lock(() => {
                this._fs.stat(p, isLstat, (err, stat) => {
                    this._mu.unlock();
                    cb(err, stat);
                });
            });
        }
        statSync(p, isLstat) {
            if (this._mu.isLocked()) {
                throw new Error('invalid sync call');
            }
            return this._fs.statSync(p, isLstat);
        }
        open(p, flag, mode, cb) {
            this._mu.lock(() => {
                this._fs.open(p, flag, mode, (err, fd) => {
                    this._mu.unlock();
                    cb(err, fd);
                });
            });
        }
        openSync(p, flag, mode) {
            if (this._mu.isLocked()) {
                throw new Error('invalid sync call');
            }
            return this._fs.openSync(p, flag, mode);
        }
        unlink(p, cb) {
            this._mu.lock(() => {
                this._fs.unlink(p, (err) => {
                    this._mu.unlock();
                    cb(err);
                });
            });
        }
        unlinkSync(p) {
            if (this._mu.isLocked()) {
                throw new Error('invalid sync call');
            }
            return this._fs.unlinkSync(p);
        }
        rmdir(p, cb) {
            this._mu.lock(() => {
                this._fs.rmdir(p, (err) => {
                    this._mu.unlock();
                    cb(err);
                });
            });
        }
        rmdirSync(p) {
            if (this._mu.isLocked()) {
                throw new Error('invalid sync call');
            }
            return this._fs.rmdirSync(p);
        }
        mkdir(p, mode, cb) {
            this._mu.lock(() => {
                this._fs.mkdir(p, mode, (err) => {
                    this._mu.unlock();
                    cb(err);
                });
            });
        }
        mkdirSync(p, mode) {
            if (this._mu.isLocked()) {
                throw new Error('invalid sync call');
            }
            return this._fs.mkdirSync(p, mode);
        }
        readdir(p, cb) {
            this._mu.lock(() => {
                this._fs.readdir(p, (err, files) => {
                    this._mu.unlock();
                    cb(err, files);
                });
            });
        }
        readdirSync(p) {
            if (this._mu.isLocked()) {
                throw new Error('invalid sync call');
            }
            return this._fs.readdirSync(p);
        }
        exists(p, cb) {
            this._mu.lock(() => {
                this._fs.exists(p, (exists) => {
                    this._mu.unlock();
                    cb(exists);
                });
            });
        }
        existsSync(p) {
            if (this._mu.isLocked()) {
                throw new Error('invalid sync call');
            }
            return this._fs.existsSync(p);
        }
        realpath(p, cache, cb) {
            this._mu.lock(() => {
                this._fs.realpath(p, cache, (err, resolvedPath) => {
                    this._mu.unlock();
                    cb(err, resolvedPath);
                });
            });
        }
        realpathSync(p, cache) {
            if (this._mu.isLocked()) {
                throw new Error('invalid sync call');
            }
            return this._fs.realpathSync(p, cache);
        }
        truncate(p, len, cb) {
            this._mu.lock(() => {
                this._fs.truncate(p, len, (err) => {
                    this._mu.unlock();
                    cb(err);
                });
            });
        }
        truncateSync(p, len) {
            if (this._mu.isLocked()) {
                throw new Error('invalid sync call');
            }
            return this._fs.truncateSync(p, len);
        }
        readFile(fname, encoding, flag, cb) {
            this._mu.lock(() => {
                this._fs.readFile(fname, encoding, flag, (err, data) => {
                    this._mu.unlock();
                    cb(err, data);
                });
            });
        }
        readFileSync(fname, encoding, flag) {
            if (this._mu.isLocked()) {
                throw new Error('invalid sync call');
            }
            return this._fs.readFileSync(fname, encoding, flag);
        }
        writeFile(fname, data, encoding, flag, mode, cb) {
            this._mu.lock(() => {
                this._fs.writeFile(fname, data, encoding, flag, mode, (err) => {
                    this._mu.unlock();
                    cb(err);
                });
            });
        }
        writeFileSync(fname, data, encoding, flag, mode) {
            if (this._mu.isLocked()) {
                throw new Error('invalid sync call');
            }
            return this._fs.writeFileSync(fname, data, encoding, flag, mode);
        }
        appendFile(fname, data, encoding, flag, mode, cb) {
            this._mu.lock(() => {
                this._fs.appendFile(fname, data, encoding, flag, mode, (err) => {
                    this._mu.unlock();
                    cb(err);
                });
            });
        }
        appendFileSync(fname, data, encoding, flag, mode) {
            if (this._mu.isLocked()) {
                throw new Error('invalid sync call');
            }
            return this._fs.appendFileSync(fname, data, encoding, flag, mode);
        }
        chmod(p, isLchmod, mode, cb) {
            this._mu.lock(() => {
                this._fs.chmod(p, isLchmod, mode, (err) => {
                    this._mu.unlock();
                    cb(err);
                });
            });
        }
        chmodSync(p, isLchmod, mode) {
            if (this._mu.isLocked()) {
                throw new Error('invalid sync call');
            }
            return this._fs.chmodSync(p, isLchmod, mode);
        }
        chown(p, isLchown, uid, gid, cb) {
            this._mu.lock(() => {
                this._fs.chown(p, isLchown, uid, gid, (err) => {
                    this._mu.unlock();
                    cb(err);
                });
            });
        }
        chownSync(p, isLchown, uid, gid) {
            if (this._mu.isLocked()) {
                throw new Error('invalid sync call');
            }
            return this._fs.chownSync(p, isLchown, uid, gid);
        }
        utimes(p, atime, mtime, cb) {
            this._mu.lock(() => {
                this._fs.utimes(p, atime, mtime, (err) => {
                    this._mu.unlock();
                    cb(err);
                });
            });
        }
        utimesSync(p, atime, mtime) {
            if (this._mu.isLocked()) {
                throw new Error('invalid sync call');
            }
            return this._fs.utimesSync(p, atime, mtime);
        }
        link(srcpath, dstpath, cb) {
            this._mu.lock(() => {
                this._fs.link(srcpath, dstpath, (err) => {
                    this._mu.unlock();
                    cb(err);
                });
            });
        }
        linkSync(srcpath, dstpath) {
            if (this._mu.isLocked()) {
                throw new Error('invalid sync call');
            }
            return this._fs.linkSync(srcpath, dstpath);
        }
        symlink(srcpath, dstpath, type, cb) {
            this._mu.lock(() => {
                this._fs.symlink(srcpath, dstpath, type, (err) => {
                    this._mu.unlock();
                    cb(err);
                });
            });
        }
        symlinkSync(srcpath, dstpath, type) {
            if (this._mu.isLocked()) {
                throw new Error('invalid sync call');
            }
            return this._fs.symlinkSync(srcpath, dstpath, type);
        }
        readlink(p, cb) {
            this._mu.lock(() => {
                this._fs.readlink(p, (err, linkString) => {
                    this._mu.unlock();
                    cb(err, linkString);
                });
            });
        }
        readlinkSync(p) {
            if (this._mu.isLocked()) {
                throw new Error('invalid sync call');
            }
            return this._fs.readlinkSync(p);
        }
    }

    return files.providers.LockedProvider = LockedProvider;
});
define('skylark-data-files/providers/overlay/overlay-file',[
    '../../preload-file'
], function (PreloadFile) {

    /**
     * Overlays a RO file to make it writable.
     */
    class OverlayFile extends PreloadFile {
        constructor(fs, path, flag, stats, data) {
            super(fs, path, flag, stats, data);
        }
        sync(cb) {
            if (!this.isDirty()) {
                cb(null);
                return;
            }
            this._fs._syncAsync(this, (err) => {
                this.resetDirty();
                cb(err);
            });
        }
        syncSync() {
            if (this.isDirty()) {
                this._fs._syncSync(this);
                this.resetDirty();
            }
        }
        close(cb) {
            this.sync(cb);
        }
        closeSync() {
            this.syncSync();
        }
    }


    return OverlayFile;
});
define('skylark-data-files/providers/overlay/unlocked-overlay-provider',[
    "skylark-langx-paths",
    "../base-provider",
    '../../stats',
    '../../file-type',
    '../../file-error',
    '../../error-codes',
    "../../file-flag",
    "../../action-type",
    "./overlay-file"
], function (paths, BaseProvider, Stats,FileType,FileError, ErrorCodes, FileFlag,ActionType,OverlayFile) {
    /**
     * @hidden
     */
    const deletionLogPath = '/.deletedFiles.log';

    /**
     * Given a read-only mode, makes it writable.
     * @hidden
     */
    function makeModeWritable(mode) {
        return 0o222 | mode;
    }


    /**
     * @hidden
     */
    function getFlag(f) {
        return FileFlag.getFileFlag(f);
    }    
     /**
     * *INTERNAL, DO NOT USE DIRECTLY!*
     *
     * Core OverlayProviderclass that contains no locking whatsoever. We wrap these objects
     * in a LockedFS to prevent races.
     */
    class UnlockedOverlayProvider extends BaseProvider {
        constructor(writable, readable) {
            super();
            this._isInitialized = false;
            this._initializeCallbacks = [];
            this._deletedFiles = {};
            this._deleteLog = '';
            // If 'true', we have scheduled a delete log update.
            this._deleteLogUpdatePending = false;
            // If 'true', a delete log update is needed after the scheduled delete log
            // update finishes.
            this._deleteLogUpdateNeeded = false;
            // If there was an error updating the delete log...
            this._deleteLogError = null;
            this._writable = writable;
            this._readable = readable;
            if (this._writable.isReadOnly()) {
                throw new FileError(ErrorCodes.EINVAL, "Writable file system must be writable.");
            }
        }
        static isAvailable() {
            return true;
        }
        getOverlayedProviders() {
            return {
                readable: this._readable,
                writable: this._writable
            };
        }
        _syncAsync(file, cb) {
            this.createParentDirectoriesAsync(file.getPath(), (err) => {
                if (err) {
                    return cb(err);
                }
                this._writable.writeFile(file.getPath(), file.getBuffer(), null, getFlag('w'), file.getStats().mode, cb);
            });
        }
        _syncSync(file) {
            this.createParentDirectories(file.getPath());
            this._writable.writeFileSync(file.getPath(), file.getBuffer(), null, getFlag('w'), file.getStats().mode);
        }
        getName() {
            return OverlayFS.Name;
        }
        /**
         * **INTERNAL METHOD**
         *
         * Called once to load up metadata stored on the writable file system.
         */
        _initialize(cb) {
            const callbackArray = this._initializeCallbacks;
            const end = (e) => {
                this._isInitialized = !e;
                this._initializeCallbacks = [];
                callbackArray.forEach(((cb) => cb(e)));
            };
            // if we're already initialized, immediately invoke the callback
            if (this._isInitialized) {
                return cb();
            }
            callbackArray.push(cb);
            // The first call to initialize initializes, the rest wait for it to complete.
            if (callbackArray.length !== 1) {
                return;
            }
            // Read deletion log, process into metadata.
            this._writable.readFile(deletionLogPath, 'utf8', getFlag('r'), (err, data) => {
                if (err) {
                    // ENOENT === Newly-instantiated file system, and thus empty log.
                    if (err.errno !== ErrorCodes.ENOENT) {
                        return end(err);
                    }
                }
                else {
                    this._deleteLog = data;
                }
                this._reparseDeletionLog();
                end();
            });
        }
        isReadOnly() { return false; }
        supportsSynch() { return this._readable.supportsSynch() && this._writable.supportsSynch(); }
        supportsLinks() { return false; }
        supportsProps() { return this._readable.supportsProps() && this._writable.supportsProps(); }
        getDeletionLog() {
            return this._deleteLog;
        }
        restoreDeletionLog(log) {
            this._deleteLog = log;
            this._reparseDeletionLog();
            this.updateLog('');
        }
        rename(oldPath, newPath, cb) {
            if (!this.checkInitAsync(cb) || this.checkPathAsync(oldPath, cb) || this.checkPathAsync(newPath, cb)) {
                return;
            }
            if (oldPath === deletionLogPath || newPath === deletionLogPath) {
                return cb(FileError.EPERM('Cannot rename deletion log.'));
            }
            // nothing to do if paths match
            if (oldPath === newPath) {
                return cb();
            }
            this.stat(oldPath, false, (oldErr, oldStats) => {
                if (oldErr) {
                    return cb(oldErr);
                }
                return this.stat(newPath, false, (newErr, newStats) => {
                    const self = this;
                    // precondition: both oldPath and newPath exist and are dirs.
                    // decreases: |files|
                    // Need to move *every file/folder* currently stored on
                    // readable to its new location on writable.
                    function copyDirContents(files) {
                        const file = files.shift();
                        if (!file) {
                            return cb();
                        }
                        const oldFile = paths.resolve(oldPath, file);
                        const newFile = paths.resolve(newPath, file);
                        // Recursion! Should work for any nested files / folders.
                        self.rename(oldFile, newFile, (err) => {
                            if (err) {
                                return cb(err);
                            }
                            copyDirContents(files);
                        });
                    }
                    let mode = 0o777;
                    // from linux's rename(2) manpage: oldpath can specify a
                    // directory.  In this case, newpath must either not exist, or
                    // it must specify an empty directory.
                    if (oldStats.isDirectory()) {
                        if (newErr) {
                            if (newErr.errno !== ErrorCodes.ENOENT) {
                                return cb(newErr);
                            }
                            return this._writable.exists(oldPath, (exists) => {
                                // simple case - both old and new are on the writable layer
                                if (exists) {
                                    return this._writable.rename(oldPath, newPath, cb);
                                }
                                this._writable.mkdir(newPath, mode, (mkdirErr) => {
                                    if (mkdirErr) {
                                        return cb(mkdirErr);
                                    }
                                    this._readable.readdir(oldPath, (err, files) => {
                                        if (err) {
                                            return cb();
                                        }
                                        copyDirContents(files);
                                    });
                                });
                            });
                        }
                        mode = newStats.mode;
                        if (!newStats.isDirectory()) {
                            return cb(FileError.ENOTDIR(newPath));
                        }
                        this.readdir(newPath, (readdirErr, files) => {
                            if (files && files.length) {
                                return cb(FileError.ENOTEMPTY(newPath));
                            }
                            this._readable.readdir(oldPath, (err, files) => {
                                if (err) {
                                    return cb();
                                }
                                copyDirContents(files);
                            });
                        });
                    }
                    if (newStats && newStats.isDirectory()) {
                        return cb(FileError.EISDIR(newPath));
                    }
                    this.readFile(oldPath, null, getFlag('r'), (err, data) => {
                        if (err) {
                            return cb(err);
                        }
                        return this.writeFile(newPath, data, null, getFlag('w'), oldStats.mode, (err) => {
                            if (err) {
                                return cb(err);
                            }
                            return this.unlink(oldPath, cb);
                        });
                    });
                });
            });
        }
        renameSync(oldPath, newPath) {
            this.checkInitialized();
            this.checkPath(oldPath);
            this.checkPath(newPath);
            if (oldPath === deletionLogPath || newPath === deletionLogPath) {
                throw FileError.EPERM('Cannot rename deletion log.');
            }
            // Write newPath using oldPath's contents, delete oldPath.
            const oldStats = this.statSync(oldPath, false);
            if (oldStats.isDirectory()) {
                // Optimization: Don't bother moving if old === new.
                if (oldPath === newPath) {
                    return;
                }
                let mode = 0o777;
                if (this.existsSync(newPath)) {
                    const stats = this.statSync(newPath, false);
                    mode = stats.mode;
                    if (stats.isDirectory()) {
                        if (this.readdirSync(newPath).length > 0) {
                            throw FileError.ENOTEMPTY(newPath);
                        }
                    }
                    else {
                        throw FileError.ENOTDIR(newPath);
                    }
                }
                // Take care of writable first. Move any files there, or create an empty directory
                // if it doesn't exist.
                if (this._writable.existsSync(oldPath)) {
                    this._writable.renameSync(oldPath, newPath);
                }
                else if (!this._writable.existsSync(newPath)) {
                    this._writable.mkdirSync(newPath, mode);
                }
                // Need to move *every file/folder* currently stored on readable to its new location
                // on writable.
                if (this._readable.existsSync(oldPath)) {
                    this._readable.readdirSync(oldPath).forEach((name) => {
                        // Recursion! Should work for any nested files / folders.
                        this.renameSync(paths.resolve(oldPath, name), paths.resolve(newPath, name));
                    });
                }
            }
            else {
                if (this.existsSync(newPath) && this.statSync(newPath, false).isDirectory()) {
                    throw FileError.EISDIR(newPath);
                }
                this.writeFileSync(newPath, this.readFileSync(oldPath, null, getFlag('r')), null, getFlag('w'), oldStats.mode);
            }
            if (oldPath !== newPath && this.existsSync(oldPath)) {
                this.unlinkSync(oldPath);
            }
        }
        stat(p, isLstat, cb) {
            if (!this.checkInitAsync(cb)) {
                return;
            }
            this._writable.stat(p, isLstat, (err, stat) => {
                if (err && err.errno === ErrorCodes.ENOENT) {
                    if (this._deletedFiles[p]) {
                        cb(FileError.ENOENT(p));
                    }
                    this._readable.stat(p, isLstat, (err, stat) => {
                        if (stat) {
                            // Make the oldStat's mode writable. Preserve the topmost
                            // part of the mode, which specifies if it is a file or a
                            // directory.
                            stat = Stats.clone(stat);
                            stat.mode = makeModeWritable(stat.mode);
                        }
                        cb(err, stat);
                    });
                }
                else {
                    cb(err, stat);
                }
            });
        }
        statSync(p, isLstat) {
            this.checkInitialized();
            try {
                return this._writable.statSync(p, isLstat);
            }
            catch (e) {
                if (this._deletedFiles[p]) {
                    throw FileError.ENOENT(p);
                }
                const oldStat = Stats.clone(this._readable.statSync(p, isLstat));
                // Make the oldStat's mode writable. Preserve the topmost part of the
                // mode, which specifies if it is a file or a directory.
                oldStat.mode = makeModeWritable(oldStat.mode);
                return oldStat;
            }
        }
        open(p, flag, mode, cb) {
            if (!this.checkInitAsync(cb) || this.checkPathAsync(p, cb)) {
                return;
            }
            this.stat(p, false, (err, stats) => {
                if (stats) {
                    switch (flag.pathExistsAction()) {
                        case ActionType.TRUNCATE_FILE:
                            return this.createParentDirectoriesAsync(p, (err) => {
                                if (err) {
                                    return cb(err);
                                }
                                this._writable.open(p, flag, mode, cb);
                            });
                        case ActionType.NOP:
                            return this._writable.exists(p, (exists) => {
                                if (exists) {
                                    this._writable.open(p, flag, mode, cb);
                                }
                                else {
                                    // at this point we know the stats object we got is from
                                    // the readable FS.
                                    stats = Stats.clone(stats);
                                    stats.mode = mode;
                                    this._readable.readFile(p, null, getFlag('r'), (readFileErr, data) => {
                                        if (readFileErr) {
                                            return cb(readFileErr);
                                        }
                                        if (stats.size === -1) {
                                            stats.size = data.length;
                                        }
                                        const f = new OverlayFile(this, p, flag, stats, data);
                                        cb(null, f);
                                    });
                                }
                            });
                        default:
                            return cb(FileError.EEXIST(p));
                    }
                }
                else {
                    switch (flag.pathNotExistsAction()) {
                        case ActionType.CREATE_FILE:
                            return this.createParentDirectoriesAsync(p, (err) => {
                                if (err) {
                                    return cb(err);
                                }
                                return this._writable.open(p, flag, mode, cb);
                            });
                        default:
                            return cb(FileError.ENOENT(p));
                    }
                }
            });
        }
        openSync(p, flag, mode) {
            this.checkInitialized();
            this.checkPath(p);
            if (p === deletionLogPath) {
                throw FileError.EPERM('Cannot open deletion log.');
            }
            if (this.existsSync(p)) {
                switch (flag.pathExistsAction()) {
                    case ActionType.TRUNCATE_FILE:
                        this.createParentDirectories(p);
                        return this._writable.openSync(p, flag, mode);
                    case ActionType.NOP:
                        if (this._writable.existsSync(p)) {
                            return this._writable.openSync(p, flag, mode);
                        }
                        else {
                            // Create an OverlayFile.
                            const buf = this._readable.readFileSync(p, null, getFlag('r'));
                            const stats = Stats.clone(this._readable.statSync(p, false));
                            stats.mode = mode;
                            return new OverlayFile(this, p, flag, stats, buf);
                        }
                    default:
                        throw FileError.EEXIST(p);
                }
            }
            else {
                switch (flag.pathNotExistsAction()) {
                    case ActionType.CREATE_FILE:
                        this.createParentDirectories(p);
                        return this._writable.openSync(p, flag, mode);
                    default:
                        throw FileError.ENOENT(p);
                }
            }
        }
        unlink(p, cb) {
            if (!this.checkInitAsync(cb) || this.checkPathAsync(p, cb)) {
                return;
            }
            this.exists(p, (exists) => {
                if (!exists) {
                    return cb(FileError.ENOENT(p));
                }
                this._writable.exists(p, (writableExists) => {
                    if (writableExists) {
                        return this._writable.unlink(p, (err) => {
                            if (err) {
                                return cb(err);
                            }
                            this.exists(p, (readableExists) => {
                                if (readableExists) {
                                    this.deletePath(p);
                                }
                                cb(null);
                            });
                        });
                    }
                    else {
                        // if this only exists on the readable FS, add it to the
                        // delete map.
                        this.deletePath(p);
                        cb(null);
                    }
                });
            });
        }
        unlinkSync(p) {
            this.checkInitialized();
            this.checkPath(p);
            if (this.existsSync(p)) {
                if (this._writable.existsSync(p)) {
                    this._writable.unlinkSync(p);
                }
                // if it still exists add to the delete log
                if (this.existsSync(p)) {
                    this.deletePath(p);
                }
            }
            else {
                throw FileError.ENOENT(p);
            }
        }
        rmdir(p, cb) {
            if (!this.checkInitAsync(cb)) {
                return;
            }
            const rmdirLower = () => {
                this.readdir(p, (err, files) => {
                    if (err) {
                        return cb(err);
                    }
                    if (files.length) {
                        return cb(FileError.ENOTEMPTY(p));
                    }
                    this.deletePath(p);
                    cb(null);
                });
            };
            this.exists(p, (exists) => {
                if (!exists) {
                    return cb(FileError.ENOENT(p));
                }
                this._writable.exists(p, (writableExists) => {
                    if (writableExists) {
                        this._writable.rmdir(p, (err) => {
                            if (err) {
                                return cb(err);
                            }
                            this._readable.exists(p, (readableExists) => {
                                if (readableExists) {
                                    rmdirLower();
                                }
                                else {
                                    cb();
                                }
                            });
                        });
                    }
                    else {
                        rmdirLower();
                    }
                });
            });
        }
        rmdirSync(p) {
            this.checkInitialized();
            if (this.existsSync(p)) {
                if (this._writable.existsSync(p)) {
                    this._writable.rmdirSync(p);
                }
                if (this.existsSync(p)) {
                    // Check if directory is empty.
                    if (this.readdirSync(p).length > 0) {
                        throw FileError.ENOTEMPTY(p);
                    }
                    else {
                        this.deletePath(p);
                    }
                }
            }
            else {
                throw FileError.ENOENT(p);
            }
        }
        mkdir(p, mode, cb) {
            if (!this.checkInitAsync(cb)) {
                return;
            }
            this.exists(p, (exists) => {
                if (exists) {
                    return cb(FileError.EEXIST(p));
                }
                // The below will throw should any of the parent directories
                // fail to exist on _writable.
                this.createParentDirectoriesAsync(p, (err) => {
                    if (err) {
                        return cb(err);
                    }
                    this._writable.mkdir(p, mode, cb);
                });
            });
        }
        mkdirSync(p, mode) {
            this.checkInitialized();
            if (this.existsSync(p)) {
                throw FileError.EEXIST(p);
            }
            else {
                // The below will throw should any of the parent directories fail to exist
                // on _writable.
                this.createParentDirectories(p);
                this._writable.mkdirSync(p, mode);
            }
        }
        readdir(p, cb) {
            if (!this.checkInitAsync(cb)) {
                return;
            }
            this.stat(p, false, (err, dirStats) => {
                if (err) {
                    return cb(err);
                }
                if (!dirStats.isDirectory()) {
                    return cb(FileError.ENOTDIR(p));
                }
                this._writable.readdir(p, (err, wFiles) => {
                    if (err && err.code !== 'ENOENT') {
                        return cb(err);
                    }
                    else if (err || !wFiles) {
                        wFiles = [];
                    }
                    this._readable.readdir(p, (err, rFiles) => {
                        // if the directory doesn't exist on the lower FS set rFiles
                        // here to simplify the following code.
                        if (err || !rFiles) {
                            rFiles = [];
                        }
                        // Readdir in both, check delete log on read-only file system's files, merge, return.
                        const seenMap = {};
                        const filtered = wFiles.concat(rFiles.filter((fPath) => !this._deletedFiles[`${p}/${fPath}`])).filter((fPath) => {
                            // Remove duplicates.
                            const result = !seenMap[fPath];
                            seenMap[fPath] = true;
                            return result;
                        });
                        cb(null, filtered);
                    });
                });
            });
        }
        readdirSync(p) {
            this.checkInitialized();
            const dirStats = this.statSync(p, false);
            if (!dirStats.isDirectory()) {
                throw FileError.ENOTDIR(p);
            }
            // Readdir in both, check delete log on RO file system's listing, merge, return.
            let contents = [];
            try {
                contents = contents.concat(this._writable.readdirSync(p));
            }
            catch (e) {
                // NOP.
            }
            try {
                contents = contents.concat(this._readable.readdirSync(p).filter((fPath) => !this._deletedFiles[`${p}/${fPath}`]));
            }
            catch (e) {
                // NOP.
            }
            const seenMap = {};
            return contents.filter((fileP) => {
                const result = !seenMap[fileP];
                seenMap[fileP] = true;
                return result;
            });
        }
        exists(p, cb) {
            // Cannot pass an error back to callback, so throw an exception instead
            // if not initialized.
            this.checkInitialized();
            this._writable.exists(p, (existsWritable) => {
                if (existsWritable) {
                    return cb(true);
                }
                this._readable.exists(p, (existsReadable) => {
                    cb(existsReadable && this._deletedFiles[p] !== true);
                });
            });
        }
        existsSync(p) {
            this.checkInitialized();
            return this._writable.existsSync(p) || (this._readable.existsSync(p) && this._deletedFiles[p] !== true);
        }
        chmod(p, isLchmod, mode, cb) {
            if (!this.checkInitAsync(cb)) {
                return;
            }
            this.operateOnWritableAsync(p, (err) => {
                if (err) {
                    return cb(err);
                }
                else {
                    this._writable.chmod(p, isLchmod, mode, cb);
                }
            });
        }
        chmodSync(p, isLchmod, mode) {
            this.checkInitialized();
            this.operateOnWritable(p, () => {
                this._writable.chmodSync(p, isLchmod, mode);
            });
        }
        chown(p, isLchmod, uid, gid, cb) {
            if (!this.checkInitAsync(cb)) {
                return;
            }
            this.operateOnWritableAsync(p, (err) => {
                if (err) {
                    return cb(err);
                }
                else {
                    this._writable.chown(p, isLchmod, uid, gid, cb);
                }
            });
        }
        chownSync(p, isLchown, uid, gid) {
            this.checkInitialized();
            this.operateOnWritable(p, () => {
                this._writable.chownSync(p, isLchown, uid, gid);
            });
        }
        utimes(p, atime, mtime, cb) {
            if (!this.checkInitAsync(cb)) {
                return;
            }
            this.operateOnWritableAsync(p, (err) => {
                if (err) {
                    return cb(err);
                }
                else {
                    this._writable.utimes(p, atime, mtime, cb);
                }
            });
        }
        utimesSync(p, atime, mtime) {
            this.checkInitialized();
            this.operateOnWritable(p, () => {
                this._writable.utimesSync(p, atime, mtime);
            });
        }
        deletePath(p) {
            this._deletedFiles[p] = true;
            this.updateLog(`d${p}\n`);
        }
        updateLog(addition) {
            this._deleteLog += addition;
            if (this._deleteLogUpdatePending) {
                this._deleteLogUpdateNeeded = true;
            }
            else {
                this._deleteLogUpdatePending = true;
                this._writable.writeFile(deletionLogPath, this._deleteLog, 'utf8', FileFlag.getFileFlag('w'), 0o644, (e) => {
                    this._deleteLogUpdatePending = false;
                    if (e) {
                        this._deleteLogError = e;
                    }
                    else if (this._deleteLogUpdateNeeded) {
                        this._deleteLogUpdateNeeded = false;
                        this.updateLog('');
                    }
                });
            }
        }
        _reparseDeletionLog() {
            this._deletedFiles = {};
            this._deleteLog.split('\n').forEach((path) => {
                // If the log entry begins w/ 'd', it's a deletion.
                this._deletedFiles[path.slice(1)] = path.slice(0, 1) === 'd';
            });
        }
        checkInitialized() {
            if (!this._isInitialized) {
                throw new FileError(ErrorCodes.EPERM, "OverlayProvideris not initialized. Please initialize OverlayProviderusing its initialize() method before using it.");
            }
            else if (this._deleteLogError !== null) {
                const e = this._deleteLogError;
                this._deleteLogError = null;
                throw e;
            }
        }
        checkInitAsync(cb) {
            if (!this._isInitialized) {
                cb(new FileError(ErrorCodes.EPERM, "OverlayProvideris not initialized. Please initialize OverlayProviderusing its initialize() method before using it."));
                return false;
            }
            else if (this._deleteLogError !== null) {
                const e = this._deleteLogError;
                this._deleteLogError = null;
                cb(e);
                return false;
            }
            return true;
        }
        checkPath(p) {
            if (p === deletionLogPath) {
                throw FileError.EPERM(p);
            }
        }
        checkPathAsync(p, cb) {
            if (p === deletionLogPath) {
                cb(FileError.EPERM(p));
                return true;
            }
            return false;
        }
        createParentDirectoriesAsync(p, cb) {
            let parent = paths.dirname(p);
            const toCreate = [];
            const self = this;
            this._writable.stat(parent, false, statDone);
            function statDone(err, stat) {
                if (err) {
                    if (parent === "/") {
                        cb(new FileError(ErrorCodes.EBUSY, "Invariant failed: root does not exist!"));
                    }
                    else {
                        toCreate.push(parent);
                        parent = paths.dirname(parent);
                        self._writable.stat(parent, false, statDone);
                    }
                }
                else {
                    createParents();
                }
            }
            function createParents() {
                if (!toCreate.length) {
                    return cb();
                }
                const dir = toCreate.pop();
                self._readable.stat(dir, false, (err, stats) => {
                    // stop if we couldn't read the dir
                    if (!stats) {
                        return cb();
                    }
                    self._writable.mkdir(dir, stats.mode, (err) => {
                        if (err) {
                            return cb(err);
                        }
                        createParents();
                    });
                });
            }
        }
        /**
         * With the given path, create the needed parent directories on the writable storage
         * should they not exist. Use modes from the read-only storage.
         */
        createParentDirectories(p) {
            let parent = paths.dirname(p), toCreate = [];
            while (!this._writable.existsSync(parent)) {
                toCreate.push(parent);
                parent = paths.dirname(parent);
            }
            toCreate = toCreate.reverse();
            toCreate.forEach((p) => {
                this._writable.mkdirSync(p, this.statSync(p, false).mode);
            });
        }
        /**
         * Helper function:
         * - Ensures p is on writable before proceeding. Throws an error if it doesn't exist.
         * - Calls f to perform operation on writable.
         */
        operateOnWritable(p, f) {
            if (this.existsSync(p)) {
                if (!this._writable.existsSync(p)) {
                    // File is on readable storage. Copy to writable storage before
                    // changing its mode.
                    this.copyToWritable(p);
                }
                f();
            }
            else {
                throw FileError.ENOENT(p);
            }
        }
        operateOnWritableAsync(p, cb) {
            this.exists(p, (exists) => {
                if (!exists) {
                    return cb(FileError.ENOENT(p));
                }
                this._writable.exists(p, (existsWritable) => {
                    if (existsWritable) {
                        cb();
                    }
                    else {
                        return this.copyToWritableAsync(p, cb);
                    }
                });
            });
        }
        /**
         * Copy from readable to writable storage.
         * PRECONDITION: File does not exist on writable storage.
         */
        copyToWritable(p) {
            const pStats = this.statSync(p, false);
            if (pStats.isDirectory()) {
                this._writable.mkdirSync(p, pStats.mode);
            }
            else {
                this.writeFileSync(p, this._readable.readFileSync(p, null, getFlag('r')), null, getFlag('w'), this.statSync(p, false).mode);
            }
        }
        copyToWritableAsync(p, cb) {
            this.stat(p, false, (err, pStats) => {
                if (err) {
                    return cb(err);
                }
                if (pStats.isDirectory()) {
                    return this._writable.mkdir(p, pStats.mode, cb);
                }
                // need to copy file.
                this._readable.readFile(p, null, getFlag('r'), (err, data) => {
                    if (err) {
                        return cb(err);
                    }
                    this.writeFile(p, data, null, getFlag('w'), pStats.mode, cb);
                });
            });
        }
    }
 

    return UnlockedOverlayProvider;
});
define('skylark-data-files/providers/overlay/overlay-provider',[
    "skylark-langx-paths",
    "../../files",
    "../registry",
    '../../stats',
    '../../file-type',
    '../../file-error',
    '../../error-codes',
    "../../file-flag",
    "../../action-type",
    "../locked-provider",
    "./unlocked-overlay-provider"
], function (paths,files,registry, Stats,FileType,FileError, ErrorCodes, FileFlag,ActionType,LockedProvider,UnlockedOverlayProvider) {


    /**
     * OverlayProvidermakes a read-only filesystem writable by storing writes on a second,
     * writable file system. Deletes are persisted via metadata stored on the writable
     * file system.
     */
    class OverlayProvider extends LockedProvider {
        /**
         * @param writable The file system to write modified files to.
         * @param readable The file system that initially populates this file system.
         */
        constructor(writable, readable) {
            super(new UnlockedOverlayProvider(writable, readable));
        }
        /**
         * Constructs and initializes an OverlayProviderinstance with the given options.
         */
        static Create(opts, cb) {
            try {
                const fs = new OverlayProvider(opts.writable, opts.readable);
                fs._initialize((e) => {
                    cb(e, fs);
                });
            }
            catch (e) {
                cb(e);
            }
        }
        static isAvailable() {
            return UnlockedOverlayProvider.isAvailable();
        }
        getOverlayedProviders() {
            return super.getFSUnlocked().getOverlayedProviders();
        }
        unwrap() {
            return super.getFSUnlocked();
        }
        _initialize(cb) {
            super.getFSUnlocked()._initialize(cb);
        }
    }
    OverlayProvider.Name = "OverlayProvider";
    OverlayProvider.Options = {
        writable: {
            type: "object",
            description: "The file system to write modified files to."
        },
        readable: {
            type: "object",
            description: "The file system that initially populates this file system."
        }
    };

    registry.add("overlay",OverlayProvider);


    return files.providers.OverlayProvider = OverlayProvider;
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
	"./stats",
	"./configure",
	"./providers/dropbox/dropbox-provider",
	"./providers/html5/html5-lfs-provider",
	"./providers/http/http-provider",
	"./providers/indexeddb/indexed-db-provider",
	"./providers/inmemory/in-memory-provider",
	"./providers/localstorage/local-storage-provider",
	"./providers/overlay/overlay-provider"

],function(files){
	return files;
});
define('skylark-data-files', ['skylark-data-files/main'], function (main) { return main; });


},this,define,require);
//# sourceMappingURL=sourcemaps/skylark-data-files.js.map
