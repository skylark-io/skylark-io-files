define([
], function () {
    'use strict';

    /**
     * Inode for a file. Stores an arbitrary (filesystem-specific) data payload.
     */
    class FileInode {
        constructor(data) {
            this.data = data;
        }
        isFile() { return true; }
        isDir() { return false; }
        getData() { return this.data; }
        setData(data) { this.data = data; }
    }
    /**

    /**
     * @hidden
     */
    FileInode.isFileInode = function isFileInode(inode) {
        return !!inode && inode.isFile();
    };


    return FileInode;

});