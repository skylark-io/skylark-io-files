define([
    '../sync-key-value-provider',
    "./in-memory-store"
], function (SyncKeyValueProvider,InMemoryStore) {
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

    return InMemoryProvider;
});