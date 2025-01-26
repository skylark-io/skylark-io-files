define([], function () {
    'use strict';

    /**
     * 4.4.5
     */
    var CompressionMethod;
    (function (CompressionMethod) {
        CompressionMethod[CompressionMethod["STORED"] = 0] = "STORED";
        CompressionMethod[CompressionMethod["SHRUNK"] = 1] = "SHRUNK";
        CompressionMethod[CompressionMethod["REDUCED_1"] = 2] = "REDUCED_1";
        CompressionMethod[CompressionMethod["REDUCED_2"] = 3] = "REDUCED_2";
        CompressionMethod[CompressionMethod["REDUCED_3"] = 4] = "REDUCED_3";
        CompressionMethod[CompressionMethod["REDUCED_4"] = 5] = "REDUCED_4";
        CompressionMethod[CompressionMethod["IMPLODE"] = 6] = "IMPLODE";
        CompressionMethod[CompressionMethod["DEFLATE"] = 8] = "DEFLATE";
        CompressionMethod[CompressionMethod["DEFLATE64"] = 9] = "DEFLATE64";
        CompressionMethod[CompressionMethod["TERSE_OLD"] = 10] = "TERSE_OLD";
        CompressionMethod[CompressionMethod["BZIP2"] = 12] = "BZIP2";
        CompressionMethod[CompressionMethod["LZMA"] = 14] = "LZMA";
        CompressionMethod[CompressionMethod["TERSE_NEW"] = 18] = "TERSE_NEW";
        CompressionMethod[CompressionMethod["LZ77"] = 19] = "LZ77";
        CompressionMethod[CompressionMethod["WAVPACK"] = 97] = "WAVPACK";
        CompressionMethod[CompressionMethod["PPMD"] = 98] = "PPMD"; // PPMd version I, Rev 1
    })(CompressionMethod || (CompressionMethod = {}));



    return CompressionMethod;

});