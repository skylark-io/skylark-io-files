define([

], function (

) {


    /**
     * Converts the input time and date in MS-DOS format into a JavaScript Date
     * object.
     * @hidden
     */
    function msdos2date(time, date) {
        // MS-DOS Date
        // |0 0 0 0  0|0 0 0  0|0 0 0  0 0 0 0
        //   D (1-31)  M (1-23)  Y (from 1980)
        const day = date & 0x1F;
        // JS date is 0-indexed, DOS is 1-indexed.
        const month = ((date >> 5) & 0xF) - 1;
        const year = (date >> 9) + 1980;
        // MS DOS Time
        // |0 0 0 0  0|0 0 0  0 0 0|0  0 0 0 0
        //    Second      Minute       Hour
        const second = time & 0x1F;
        const minute = (time >> 5) & 0x3F;
        const hour = time >> 11;
        return new Date(year, month, day, hour, minute, second);
    }


    return msdos2date;

});