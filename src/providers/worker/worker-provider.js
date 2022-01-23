define([
    "skylark-langx-binary/buffer",
    "skylark-langx-paths",
    "../base-provider",
    '../../stats',
    '../../file-type',
    '../../file-error',
    '../../error-codes',
    "../../file-flag",
    "../../action-type",
    "../../base-file",
    "../../utils",
    "../preload-file",
    "./callback-argument-converter",
    "./worker-file"
], function (
    Buffer,
    paths, 
    BaseProvider, 
    Stats,
    FileType,
    FileError, 
    ErrorCodes, 
    FileFlag,
    ActionType,
    BaseFile,
    utils,
    PreloadFile,
    CallbackArgumentConverter,
    WorkerFile
) {


    const { buffer2ArrayBuffer, arrayBuffer2Buffer, emptyBuffer }  = utils;



    /**
     * WorkerProvider lets you access a BrowserFS instance that is running in a different
     * JavaScript context (e.g. access BrowserFS in one of your WebWorkers, or
     * access BrowserFS running on the main page from a WebWorker).
     *
     * For example, to have a WebWorker access files in the main browser thread,
     * do the following:
     *
     * MAIN BROWSER THREAD:
     *
     * ```javascript
     *   // Listen for remote file system requests.
     *   BrowserFS.Provider.WorkerProvider.attachRemoteListener(webWorkerObject);
     * ```
     *
     * WEBWORKER THREAD:
     *
     * ```javascript
     *   // Set the remote file system as the root file system.
     *   BrowserFS.configure({ fs: "WorkerProvider", options: { worker: self }}, function(e) {
     *     // Ready!
     *   });
     * ```
     *
     * Note that synchronous operations are not permitted on the WorkerProvider, regardless
     * of the configuration option of the remote FS.
     */
    class WorkerProvider extends BaseProvider {
        /**
         * Constructs a new WorkerProvider instance that connects with BrowserFS running on
         * the specified worker.
         */
        constructor(worker) {
            super();
            this._callbackConverter = new CallbackArgumentConverter();
            this._isInitialized = false;
            this._isReadOnly = false;
            this._supportLinks = false;
            this._supportProps = false;
            this._worker = worker;
            this._worker.addEventListener('message', (e) => {
                const resp = e.data;
                if (isAPIResponse(resp)) {
                    let i;
                    const args = resp.args;
                    const fixedArgs = new Array(args.length);
                    // Dispatch event to correct id.
                    for (i = 0; i < fixedArgs.length; i++) {
                        fixedArgs[i] = this._argRemote2Local(args[i]);
                    }
                    this._callbackConverter.toLocalArg(resp.cbId).apply(null, fixedArgs);
                }
            });
        }
        static Create(opts, cb) {
            const fs = new WorkerProvider(opts.worker);
            fs._initialize(() => {
                cb(null, fs);
            });
        }
        static isAvailable() {
            return typeof (importScripts) !== 'undefined' || typeof (Worker) !== 'undefined';
        }
        /**
         * Attaches a listener to the remote worker for file system requests.
         */
        static attachRemoteListener(worker) {
            const fdConverter = new FileDescriptorArgumentConverter();
            function argLocal2Remote(arg, requestArgs, cb) {
                switch (typeof arg) {
                    case 'object':
                        if (arg instanceof Stats) {
                            cb(null, statsLocal2Remote(arg));
                        }
                        else if (arg instanceof FileError) {
                            cb(null, FileErrorLocal2Remote(arg));
                        }
                        else if (arg instanceof BaseFile) {
                            // Pass in p and flags from original request.
                            cb(null, fdConverter.toRemoteArg(arg, requestArgs[0], requestArgs[1], cb));
                        }
                        else if (arg instanceof FileFlag) {
                            cb(null, fileFlagLocal2Remote(arg));
                        }
                        else if (arg instanceof Buffer) {
                            cb(null, bufferLocal2Remote(arg));
                        }
                        else if (arg instanceof Error) {
                            cb(null, errorLocal2Remote(arg));
                        }
                        else {
                            cb(null, arg);
                        }
                        break;
                    default:
                        cb(null, arg);
                        break;
                }
            }
            function argRemote2Local(arg, fixedRequestArgs) {
                if (!arg) {
                    return arg;
                }
                switch (typeof arg) {
                    case 'object':
                        if (typeof arg['type'] === 'number') {
                            const specialArg = arg;
                            switch (specialArg.type) {
                                case SpecialArgType.CB:
                                    const cbId = arg.id;
                                    return function () {
                                        let i;
                                        const fixedArgs = new Array(arguments.length);
                                        let message, countdown = arguments.length;
                                        function abortAndSendError(err) {
                                            if (countdown > 0) {
                                                countdown = -1;
                                                message = {
                                                    browserfsMessage: true,
                                                    cbId: cbId,
                                                    args: [FileErrorLocal2Remote(err)]
                                                };
                                                worker.postMessage(message);
                                            }
                                        }
                                        for (i = 0; i < arguments.length; i++) {
                                            // Capture i and argument.
                                            ((i, arg) => {
                                                argLocal2Remote(arg, fixedRequestArgs, (err, fixedArg) => {
                                                    fixedArgs[i] = fixedArg;
                                                    if (err) {
                                                        abortAndSendError(err);
                                                    }
                                                    else if (--countdown === 0) {
                                                        message = {
                                                            browserfsMessage: true,
                                                            cbId: cbId,
                                                            args: fixedArgs
                                                        };
                                                        worker.postMessage(message);
                                                    }
                                                });
                                            })(i, arguments[i]);
                                        }
                                        if (arguments.length === 0) {
                                            message = {
                                                browserfsMessage: true,
                                                cbId: cbId,
                                                args: fixedArgs
                                            };
                                            worker.postMessage(message);
                                        }
                                    };
                                case SpecialArgType.API_ERROR:
                                    return FileErrorRemote2Local(specialArg);
                                case SpecialArgType.STATS:
                                    return statsRemote2Local(specialArg);
                                case SpecialArgType.FILEFLAG:
                                    return fileFlagRemote2Local(specialArg);
                                case SpecialArgType.BUFFER:
                                    return bufferRemote2Local(specialArg);
                                case SpecialArgType.ERROR:
                                    return errorRemote2Local(specialArg);
                                default:
                                    // No idea what this is.
                                    return arg;
                            }
                        }
                        else {
                            return arg;
                        }
                    default:
                        return arg;
                }
            }
            worker.addEventListener('message', (e) => {
                const request = e.data;
                if (isAPIRequest(request)) {
                    const args = request.args, fixedArgs = new Array(args.length);
                    switch (request.method) {
                        case 'close':
                        case 'sync':
                            (() => {
                                // File descriptor-relative methods.
                                const remoteCb = args[1];
                                fdConverter.applyFdAPIRequest(request, (err) => {
                                    // Send response.
                                    const response = {
                                        browserfsMessage: true,
                                        cbId: remoteCb.id,
                                        args: err ? [FileErrorLocal2Remote(err)] : []
                                    };
                                    worker.postMessage(response);
                                });
                            })();
                            break;
                        case 'probe':
                            (() => {
                                const rootFs = fs.getRootFS(), remoteCb = args[1], probeResponse = {
                                    type: SpecialArgType.PROBE,
                                    isReadOnly: rootFs.isReadOnly(),
                                    supportsLinks: rootFs.supportsLinks(),
                                    supportsProps: rootFs.supportsProps()
                                }, response = {
                                    browserfsMessage: true,
                                    cbId: remoteCb.id,
                                    args: [probeResponse]
                                };
                                worker.postMessage(response);
                            })();
                            break;
                        default:
                            // File system methods.
                            for (let i = 0; i < args.length; i++) {
                                fixedArgs[i] = argRemote2Local(args[i], fixedArgs);
                            }
                            const rootFS = fs.getRootFS();
                            rootFS[request.method].apply(rootFS, fixedArgs);
                            break;
                    }
                }
            });
        }
        getName() {
            return WorkerProvider.Name;
        }
        isReadOnly() { return this._isReadOnly; }
        supportsSynch() { return false; }
        supportsLinks() { return this._supportLinks; }
        supportsProps() { return this._supportProps; }
        rename(oldPath, newPath, cb) {
            this._rpc('rename', arguments);
        }
        stat(p, isLstat, cb) {
            this._rpc('stat', arguments);
        }
        open(p, flag, mode, cb) {
            this._rpc('open', arguments);
        }
        unlink(p, cb) {
            this._rpc('unlink', arguments);
        }
        rmdir(p, cb) {
            this._rpc('rmdir', arguments);
        }
        mkdir(p, mode, cb) {
            this._rpc('mkdir', arguments);
        }
        readdir(p, cb) {
            this._rpc('readdir', arguments);
        }
        exists(p, cb) {
            this._rpc('exists', arguments);
        }
        realpath(p, cache, cb) {
            this._rpc('realpath', arguments);
        }
        truncate(p, len, cb) {
            this._rpc('truncate', arguments);
        }
        readFile(fname, encoding, flag, cb) {
            this._rpc('readFile', arguments);
        }
        writeFile(fname, data, encoding, flag, mode, cb) {
            this._rpc('writeFile', arguments);
        }
        appendFile(fname, data, encoding, flag, mode, cb) {
            this._rpc('appendFile', arguments);
        }
        chmod(p, isLchmod, mode, cb) {
            this._rpc('chmod', arguments);
        }
        chown(p, isLchown, uid, gid, cb) {
            this._rpc('chown', arguments);
        }
        utimes(p, atime, mtime, cb) {
            this._rpc('utimes', arguments);
        }
        link(srcpath, dstpath, cb) {
            this._rpc('link', arguments);
        }
        symlink(srcpath, dstpath, type, cb) {
            this._rpc('symlink', arguments);
        }
        readlink(p, cb) {
            this._rpc('readlink', arguments);
        }
        syncClose(method, fd, cb) {
            this._worker.postMessage({
                browserfsMessage: true,
                method: method,
                args: [fd.toRemoteArg(), this._callbackConverter.toRemoteArg(cb)]
            });
        }
        /**
         * Called once both local and remote sides are set up.
         */
        _initialize(cb) {
            if (!this._isInitialized) {
                const message = {
                    browserfsMessage: true,
                    method: 'probe',
                    args: [this._argLocal2Remote(emptyBuffer()), this._callbackConverter.toRemoteArg((probeResponse) => {
                            this._isInitialized = true;
                            this._isReadOnly = probeResponse.isReadOnly;
                            this._supportLinks = probeResponse.supportsLinks;
                            this._supportProps = probeResponse.supportsProps;
                            cb();
                        })]
                };
                this._worker.postMessage(message);
            }
            else {
                cb();
            }
        }
        _argRemote2Local(arg) {
            if (!arg) {
                return arg;
            }
            switch (typeof arg) {
                case 'object':
                    if (typeof arg['type'] === 'number') {
                        const specialArg = arg;
                        switch (specialArg.type) {
                            case SpecialArgType.API_ERROR:
                                return misc.FileErrorRemote2Local(specialArg);
                            case SpecialArgType.FD:
                                const fdArg = specialArg;
                                return new WorkerFile(this, fdArg.path, FileFlag.getFileFlag(fdArg.flag), Stats.fromBuffer(transferrableObjectToBuffer(fdArg.stat)), fdArg.id, transferrableObjectToBuffer(fdArg.data));
                            case SpecialArgType.STATS:
                                return misc.statsRemote2Local(specialArg);
                            case SpecialArgType.FILEFLAG:
                                return misc.fileFlagRemote2Local(specialArg);
                            case SpecialArgType.BUFFER:
                                return misc.bufferRemote2Local(specialArg);
                            case SpecialArgType.ERROR:
                                return misc.errorRemote2Local(specialArg);
                            default:
                                return arg;
                        }
                    }
                    else {
                        return arg;
                    }
                default:
                    return arg;
            }
        }
        _rpc(methodName, args) {
            const fixedArgs = new Array(args.length);
            for (let i = 0; i < args.length; i++) {
                fixedArgs[i] = this._argLocal2Remote(args[i]);
            }
            const message = {
                browserfsMessage: true,
                method: methodName,
                args: fixedArgs
            };
            this._worker.postMessage(message);
        }
        /**
         * Converts a local argument into a remote argument. Public so WorkerFile objects can call it.
         */
        _argLocal2Remote(arg) {
            if (!arg) {
                return arg;
            }
            switch (typeof arg) {
                case "object":
                    if (arg instanceof Stats) {
                        return statsLocal2Remote(arg);
                    }
                    else if (arg instanceof FileError) {
                        return FileErrorLocal2Remote(arg);
                    }
                    else if (arg instanceof WorkerFile) {
                        return arg.toRemoteArg();
                    }
                    else if (arg instanceof FileFlag) {
                        return fileFlagLocal2Remote(arg);
                    }
                    else if (arg instanceof Buffer) {
                        return bufferLocal2Remote(arg);
                    }
                    else if (arg instanceof Error) {
                        return errorLocal2Remote(arg);
                    }
                    else {
                        return "Unknown argument";
                    }
                case "function":
                    return this._callbackConverter.toRemoteArg(arg);
                default:
                    return arg;
            }
        }
    }
    WorkerProvider.Name = "WorkerProvider";
    WorkerProvider.Options = {
        worker: {
            type: "object",
            description: "The target worker that you want to connect to, or the current worker if in a worker context.",
            validator: function (v, cb) {
                // Check for a `postMessage` function.
                if (v['postMessage']) {
                    cb();
                }
                else {
                    cb(new FileError(ErrorCodes.EINVAL, `option must be a Web Worker instance.`));
                }
            }
        }
    };

    return WorkerProvider;
});