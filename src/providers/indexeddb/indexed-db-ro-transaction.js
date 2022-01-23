define([
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