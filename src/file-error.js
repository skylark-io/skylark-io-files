define([
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