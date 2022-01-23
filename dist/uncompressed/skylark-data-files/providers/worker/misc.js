define([
    '../../stats',
    '../../file-type',
    '../../file-error',
    '../../error-codes',
    "../../file-flag",
    "../../action-type",
    "../../utils"
], function ( Stats,FileType,FileError, ErrorCodes, FileFlag,ActionType,utils) {


    const { buffer2ArrayBuffer, arrayBuffer2Buffer, emptyBuffer }  = utils;

    /**
     * @hidden
     */
    function FileErrorRemote2Local(e) {
        return FileError.fromBuffer(transferrableObjectToBuffer(e.errorData));
    }
    /**
     * @hidden
     */
    function errorLocal2Remote(e) {
        return {
            type: SpecialArgType.ERROR,
            name: e.name,
            message: e.message,
            stack: e.stack
        };
    }
    /**
     * @hidden
     */
    function errorRemote2Local(e) {
        let cnstr = global[e.name];
        if (typeof (cnstr) !== 'function') {
            cnstr = Error;
        }
        const err = new cnstr(e.message);
        err.stack = e.stack;
        return err;
    }
    /**
     * @hidden
     */
    function statsLocal2Remote(stats) {
        return {
            type: SpecialArgType.STATS,
            statsData: bufferToTransferrableObject(stats.toBuffer())
        };
    }
    /**
     * @hidden
     */
    function statsRemote2Local(stats) {
        return Stats.fromBuffer(transferrableObjectToBuffer(stats.statsData));
    }
    /**
     * @hidden
     */
    function fileFlagLocal2Remote(flag) {
        return {
            type: SpecialArgType.FILEFLAG,
            flagStr: flag.getFlagString()
        };
    }
    /**
     * @hidden
     */
    function fileFlagRemote2Local(remoteFlag) {
        return FileFlag.getFileFlag(remoteFlag.flagStr);
    }
    /**
     * @hidden
     */
    function bufferToTransferrableObject(buff) {
        return buffer2ArrayBuffer(buff);
    }
    /**
     * @hidden
     */
    function transferrableObjectToBuffer(buff) {
        return arrayBuffer2Buffer(buff);
    }
    /**
     * @hidden
     */
    function bufferLocal2Remote(buff) {
        return {
            type: SpecialArgType.BUFFER,
            data: bufferToTransferrableObject(buff)
        };
    }
    /**
     * @hidden
     */
    function bufferRemote2Local(buffArg) {
        return transferrableObjectToBuffer(buffArg.data);
    }
    /**
     * @hidden
     */
    function isAPIRequest(data) {
        return data && typeof data === 'object' && data.hasOwnProperty('browserfsMessage') && data['browserfsMessage'];
    }
    /**
     * @hidden
     */
    function isAPIResponse(data) {
        return data && typeof data === 'object' && data.hasOwnProperty('browserfsMessage') && data['browserfsMessage'];
    }


    return {
        FileErrorLocal2Remote,
        errorLocal2Remote,
        errorRemote2Local,
        statsLocal2Remote,
        statsRemote2Local,
        fileFlagLocal2Remote,
        fileFlagRemote2Local,
        bufferToTransferrableObject,
        transferrableObjectToBuffer,
        bufferLocal2Remote,
        bufferRemote2Local,
        isAPIRequest,
        isAPIResponse
    };
});