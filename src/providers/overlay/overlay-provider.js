define([
    "skylark-langx-paths",
    '../../stats',
    '../../file-type',
    '../../file-error',
    '../../error-codes',
    "../../file-flag",
    "../../action-type",
    "../locked-provider",
    "./unlocked-overlay-provider"
], function (paths, Stats,FileType,FileError, ErrorCodes, FileFlag,ActionType,LockedProvider,UnlockedOverlayProvider) {


    /**
     * OverlayProvidermakes a read-only filesystem writable by storing writes on a second,
     * writable file system. Deletes are persisted via metadata stored on the writable
     * file system.
     */
    class OverlayProvider extends LockedProvider {
        /**
         * @param writable The file system to write modified files to.
         * @param readable The file system that initially populates this file system.
         */
        constructor(writable, readable) {
            super(new UnlockedOverlayProvider(writable, readable));
        }
        /**
         * Constructs and initializes an OverlayProviderinstance with the given options.
         */
        static Create(opts, cb) {
            try {
                const fs = new OverlayProvider(opts.writable, opts.readable);
                fs._initialize((e) => {
                    cb(e, fs);
                });
            }
            catch (e) {
                cb(e);
            }
        }
        static isAvailable() {
            return UnlockedOverlayProvider.isAvailable();
        }
        getOverlayedProviders() {
            return super.getFSUnlocked().getOverlayedProviders();
        }
        unwrap() {
            return super.getFSUnlocked();
        }
        _initialize(cb) {
            super.getFSUnlocked()._initialize(cb);
        }
    }
    OverlayProvider.Name = "OverlayProvider";
    OverlayProvider.Options = {
        writable: {
            type: "object",
            description: "The file system to write modified files to."
        },
        readable: {
            type: "object",
            description: "The file system that initially populates this file system."
        }
    };

    return OverlayProvider;
});