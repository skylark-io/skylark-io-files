define([
    '../../file-error',
    '../../error-codes',
    '../async-key-value-provider',
    "../registry",
    '../../utils',
    "./indexed-db-store",
    "./indexed-db-ro-transaction",
    "./indexed-db-rw-transaction"
], function (FileError,ErrorCodes, AsyncKeyValueProvider,  registry,utils,IndexedDBStore,IndexedDBROTransaction,IndexedDBRWTransaction) {
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

    return IndexedDBProvider;
});