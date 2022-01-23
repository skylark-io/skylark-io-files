define([], function () {
    'use strict';


    /**
     * 4.4.2.2: Indicates the compatibiltiy of a file's external attributes.
     */
    var ExternalFileAttributeType;
    (function (ExternalFileAttributeType) {
        ExternalFileAttributeType[ExternalFileAttributeType["MSDOS"] = 0] = "MSDOS";
        ExternalFileAttributeType[ExternalFileAttributeType["AMIGA"] = 1] = "AMIGA";
        ExternalFileAttributeType[ExternalFileAttributeType["OPENVMS"] = 2] = "OPENVMS";
        ExternalFileAttributeType[ExternalFileAttributeType["UNIX"] = 3] = "UNIX";
        ExternalFileAttributeType[ExternalFileAttributeType["VM_CMS"] = 4] = "VM_CMS";
        ExternalFileAttributeType[ExternalFileAttributeType["ATARI_ST"] = 5] = "ATARI_ST";
        ExternalFileAttributeType[ExternalFileAttributeType["OS2_HPFS"] = 6] = "OS2_HPFS";
        ExternalFileAttributeType[ExternalFileAttributeType["MAC"] = 7] = "MAC";
        ExternalFileAttributeType[ExternalFileAttributeType["Z_SYSTEM"] = 8] = "Z_SYSTEM";
        ExternalFileAttributeType[ExternalFileAttributeType["CP_M"] = 9] = "CP_M";
        ExternalFileAttributeType[ExternalFileAttributeType["NTFS"] = 10] = "NTFS";
        ExternalFileAttributeType[ExternalFileAttributeType["MVS"] = 11] = "MVS";
        ExternalFileAttributeType[ExternalFileAttributeType["VSE"] = 12] = "VSE";
        ExternalFileAttributeType[ExternalFileAttributeType["ACORN_RISC"] = 13] = "ACORN_RISC";
        ExternalFileAttributeType[ExternalFileAttributeType["VFAT"] = 14] = "VFAT";
        ExternalFileAttributeType[ExternalFileAttributeType["ALT_MVS"] = 15] = "ALT_MVS";
        ExternalFileAttributeType[ExternalFileAttributeType["BEOS"] = 16] = "BEOS";
        ExternalFileAttributeType[ExternalFileAttributeType["TANDEM"] = 17] = "TANDEM";
        ExternalFileAttributeType[ExternalFileAttributeType["OS_400"] = 18] = "OS_400";
        ExternalFileAttributeType[ExternalFileAttributeType["OSX"] = 19] = "OSX";
    })(ExternalFileAttributeType || (ExternalFileAttributeType = {}));



    return ExternalFileAttributeType;

});