define([
    "skylark-langx-binary/buffer",
    '../../stats',
    '../../file-type',
    '../../file-error',
    '../../error-codes',
    "../../file-flag",
    "../../action-type",
    "../../utils",
    "./misc",
    "./special-arg-type"
], function (Buffer, Stats,FileType,FileError, ErrorCodes, FileFlag,ActionType,utils,misc,SpecialArgType) {


    const { buffer2ArrayBuffer, arrayBuffer2Buffer, emptyBuffer }  = utils;
    /**
     * @hidden
     */
    class FileDescriptorArgumentConverter {
        constructor() {
            this._fileDescriptors = {};
            this._nextId = 0;
        }
        toRemoteArg(fd, p, flag, cb) {
            const id = this._nextId++;
            let data;
            let stat;
            this._fileDescriptors[id] = fd;
            // Extract needed information asynchronously.
            fd.stat((err, stats) => {
                if (err) {
                    cb(err);
                }
                else {
                    stat = misc.bufferToTransferrableObject(stats.toBuffer());
                    // If it's a readable flag, we need to grab contents.
                    if (flag.isReadable()) {
                        fd.read(Buffer.alloc(stats.size), 0, stats.size, 0, (err, bytesRead, buff) => {
                            if (err) {
                                cb(err);
                            }
                            else {
                                data = misc.bufferToTransferrableObject(buff);
                                cb(null, {
                                    type: SpecialArgType.FD,
                                    id: id,
                                    data: data,
                                    stat: stat,
                                    path: p,
                                    flag: flag.getFlagString()
                                });
                            }
                        });
                    }
                    else {
                        // File is not readable, which means writing to it will append or
                        // truncate/replace existing contents. Return an empty arraybuffer.
                        cb(null, {
                            type: SpecialArgType.FD,
                            id: id,
                            data: new ArrayBuffer(0),
                            stat: stat,
                            path: p,
                            flag: flag.getFlagString()
                        });
                    }
                }
            });
        }
        applyFdAPIRequest(request, cb) {
            const fdArg = request.args[0];
            this._applyFdChanges(fdArg, (err, fd) => {
                if (err) {
                    cb(err);
                }
                else {
                    // Apply method on now-changed file descriptor.
                    fd[request.method]((e) => {
                        if (request.method === 'close') {
                            delete this._fileDescriptors[fdArg.id];
                        }
                        cb(e);
                    });
                }
            });
        }
        _applyFdChanges(remoteFd, cb) {
            const fd = this._fileDescriptors[remoteFd.id], data = transferrableObjectToBuffer(remoteFd.data), remoteStats = Stats.fromBuffer(transferrableObjectToBuffer(remoteFd.stat));
            // Write data if the file is writable.
            const flag = FileFlag.getFileFlag(remoteFd.flag);
            if (flag.isWriteable()) {
                // Appendable: Write to end of file.
                // Writeable: Replace entire contents of file.
                fd.write(data, 0, data.length, flag.isAppendable() ? fd.getPos() : 0, (e) => {
                    function applyStatChanges() {
                        // Check if mode changed.
                        fd.stat((e, stats) => {
                            if (e) {
                                cb(e);
                            }
                            else {
                                if (stats.mode !== remoteStats.mode) {
                                    fd.chmod(remoteStats.mode, (e) => {
                                        cb(e, fd);
                                    });
                                }
                                else {
                                    cb(e, fd);
                                }
                            }
                        });
                    }
                    if (e) {
                        cb(e);
                    }
                    else {
                        // If writeable & not appendable, we need to ensure file contents are
                        // identical to those from the remote FD. Thus, we truncate to the
                        // length of the remote file.
                        if (!flag.isAppendable()) {
                            fd.truncate(data.length, () => {
                                applyStatChanges();
                            });
                        }
                        else {
                            applyStatChanges();
                        }
                    }
                });
            }
            else {
                cb(null, fd);
            }
        }
    }

    return FileDescriptorArgumentConverter;
});