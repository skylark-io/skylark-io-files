define([
  "./files"
],function (files) {
  'use strict';

  /**
    * Indicates the type of the given file. Applied to 'mode'.
    */
  var FileType;
  (function (FileType) {
      FileType[FileType["FILE"] = 32768] = "FILE";
      FileType[FileType["DIRECTORY"] = 16384] = "DIRECTORY";
      FileType[FileType["SYMLINK"] = 40960] = "SYMLINK";
  })(FileType || (FileType = {}));

  return files.FileType = FileType;
});
  