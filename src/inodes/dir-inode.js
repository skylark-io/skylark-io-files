define([
], function () {
    'use strict';

    /**
     * Inode for a directory. Currently only contains the directory listing.
     */
    class DirInode {
        /**
         * Constructs an inode for a directory.
         */
        constructor(data = null) {
            this.data = data;
            this._ls = {};
        }
        isFile() {
            return false;
        }
        isDir() {
            return true;
        }
        getData() { return this.data; }
        /**
         * Return a Stats object for this inode.
         * @todo Should probably remove this at some point. This isn't the
         *       responsibility of the FileIndex.
         */
        getStats() {
            return new Stats(FileType.DIRECTORY, 4096, 0x16D);
        }
        /**
         * Returns the directory listing for this directory. Paths in the directory are
         * relative to the directory's path.
         * @return The directory listing for this directory.
         */
        getListing() {
            return Object.keys(this._ls);
        }
        /**
         * Returns the inode for the indicated item, or null if it does not exist.
         * @param p Name of item in this directory.
         */
        getItem(p) {
            const item = this._ls[p];
            return item ? item : null;
        }
        /**
         * Add the given item to the directory listing. Note that the given inode is
         * not copied, and will be mutated by the DirInode if it is a DirInode.
         * @param p Item name to add to the directory listing.
         * @param inode The inode for the
         *   item to add to the directory inode.
         * @return True if it was added, false if it already existed.
         */
        addItem(p, inode) {
            if (p in this._ls) {
                return false;
            }
            this._ls[p] = inode;
            return true;
        }
        /**
         * Removes the given item from the directory listing.
         * @param p Name of item to remove from the directory listing.
         * @return Returns the item
         *   removed, or null if the item did not exist.
         */
        remItem(p) {
            const item = this._ls[p];
            if (item === undefined) {
                return null;
            }
            delete this._ls[p];
            return item;
        }
    }

    /**

    /**
     * @hidden
     */
    DirInode.isDirInode =  function isDirInode(inode) {
        return !!inode && inode.isDir();
    }


    return DirInode;
});