define([
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