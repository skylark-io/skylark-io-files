define([
    "./special-arg-type"
], function (SpecialArgType) {

    /**
     * Converts callback arguments into ICallbackArgument objects, and back
     * again.
     * @hidden
     */
    class CallbackArgumentConverter {
        constructor() {
            this._callbacks = {};
            this._nextId = 0;
        }
        toRemoteArg(cb) {
            const id = this._nextId++;
            this._callbacks[id] = cb;
            return {
                type: SpecialArgType.CB,
                id: id
            };
        }
        toLocalArg(id) {
            const cb = this._callbacks[id];
            delete this._callbacks[id];
            return cb;
        }
    }


    return CallbackArgumentConverter;
});