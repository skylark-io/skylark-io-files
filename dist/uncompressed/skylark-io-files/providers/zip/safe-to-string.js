define([], function () {
    'use strict';

    /**
     * Safely returns the string from the buffer, even if it is 0 bytes long.
     * (Normally, calling toString() on a buffer with start === end causes an
     * exception).
     * @hidden
     */
    function safeToString(buff, useUTF8, start, length) {
        if (length === 0) {
            return "";
        }
        else if (useUTF8) {
            return buff.toString('utf8', start, start + length);
        }
        else {
            return ExtendedASCII.byte2str(buff.slice(start, start + length));
        }
    }


    return safeToString;

});