define([], function () {
    /**
     * @hidden
     */
    var SpecialArgType;
    (function (SpecialArgType) {
        // Callback
        SpecialArgType[SpecialArgType["CB"] = 0] = "CB";
        // File descriptor
        SpecialArgType[SpecialArgType["FD"] = 1] = "FD";
        // API error
        SpecialArgType[SpecialArgType["API_ERROR"] = 2] = "API_ERROR";
        // Stats object
        SpecialArgType[SpecialArgType["STATS"] = 3] = "STATS";
        // Initial probe for file system information.
        SpecialArgType[SpecialArgType["PROBE"] = 4] = "PROBE";
        // FileFlag object.
        SpecialArgType[SpecialArgType["FILEFLAG"] = 5] = "FILEFLAG";
        // Buffer object.
        SpecialArgType[SpecialArgType["BUFFER"] = 6] = "BUFFER";
        // Generic Error object.
        SpecialArgType[SpecialArgType["ERROR"] = 7] = "ERROR";
    })(SpecialArgType || (SpecialArgType = {}));


    return SpecialArgType;
});