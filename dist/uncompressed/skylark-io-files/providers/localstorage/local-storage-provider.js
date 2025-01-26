define([
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