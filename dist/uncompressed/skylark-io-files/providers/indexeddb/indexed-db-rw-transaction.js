define([
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