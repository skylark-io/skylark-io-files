define([
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