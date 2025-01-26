define([
], function () {
    'use strict';

    /**
     * @hidden
     */
    const rockRidgeIdentifier = "IEEE_P1282";
    /**
     * @hidden
     */
    function getASCIIString(data, startIndex, length) {
        return data.toString('ascii', startIndex, startIndex + length).trim();
    }
    /**
     * @hidden
     */
    function getJolietString(data, startIndex, length) {
        if (length === 1) {
            // Special: Root, parent, current directory are still a single byte.
            return String.fromCharCode(data[startIndex]);
        }
        // UTF16-BE, which isn't natively supported by NodeJS Buffers.
        // Length should be even, but pessimistically floor just in case.
        const pairs = Math.floor(length / 2);
        const chars = new Array(pairs);
        for (let i = 0; i < pairs; i++) {
            const pos = startIndex + (i << 1);
            chars[i] = String.fromCharCode(data[pos + 1] | (data[pos] << 8));
        }
        return chars.join('');
    }
    /**
     * @hidden
     */
    function getDate(data, startIndex) {
        const year = parseInt(getASCIIString(data, startIndex, 4), 10);
        const mon = parseInt(getASCIIString(data, startIndex + 4, 2), 10);
        const day = parseInt(getASCIIString(data, startIndex + 6, 2), 10);
        const hour = parseInt(getASCIIString(data, startIndex + 8, 2), 10);
        const min = parseInt(getASCIIString(data, startIndex + 10, 2), 10);
        const sec = parseInt(getASCIIString(data, startIndex + 12, 2), 10);
        const hundrethsSec = parseInt(getASCIIString(data, startIndex + 14, 2), 10);
        // Last is a time-zone offset, but JavaScript dates don't support time zones well.
        return new Date(year, mon, day, hour, min, sec, hundrethsSec * 100);
    }
    /**
     * @hidden
     */
    function getShortFormDate(data, startIndex) {
        const yearsSince1900 = data[startIndex];
        const month = data[startIndex + 1];
        const day = data[startIndex + 2];
        const hour = data[startIndex + 3];
        const minute = data[startIndex + 4];
        const second = data[startIndex + 5];
        // JavaScript's Date support isn't so great; ignore timezone.
        // const offsetFromGMT = this._data[24];
        return new Date(yearsSince1900, month - 1, day, hour, minute, second);
    }
    /**
     * @hidden
     */
    function constructSystemUseEntry(bigData, i) {
        const data = bigData.slice(i);
        const sue = new SystemUseEntry(data);
        switch (sue.signatureWord()) {
            case 17221 /* CE */:
                return new CEEntry(data);
            case 20548 /* PD */:
                return new PDEntry(data);
            case 21328 /* SP */:
                return new SPEntry(data);
            case 21332 /* ST */:
                return new STEntry(data);
            case 17746 /* ER */:
                return new EREntry(data);
            case 17747 /* ES */:
                return new ESEntry(data);
            case 20568 /* PX */:
                return new PXEntry(data);
            case 20558 /* PN */:
                return new PNEntry(data);
            case 21324 /* SL */:
                return new SLEntry(data);
            case 20045 /* NM */:
                return new NMEntry(data);
            case 17228 /* CL */:
                return new CLEntry(data);
            case 20556 /* PL */:
                return new PLEntry(data);
            case 21061 /* RE */:
                return new REEntry(data);
            case 21574 /* TF */:
                return new TFEntry(data);
            case 21318 /* SF */:
                return new SFEntry(data);
            case 21074 /* RR */:
                return new RREntry(data);
            default:
                return sue;
        }
    }
    /**
     * @hidden
     */
    function constructSystemUseEntries(data, i, len, isoData) {
        // If the remaining allocated space following the last recorded System Use Entry in a System
        // Use field or Continuation Area is less than four bytes long, it cannot contain a System
        // Use Entry and shall be ignored
        len = len - 4;
        let entries = new Array();
        while (i < len) {
            const entry = constructSystemUseEntry(data, i);
            const length = entry.length();
            if (length === 0) {
                // Invalid SU section; prevent infinite loop.
                return entries;
            }
            i += length;
            if (entry instanceof STEntry) {
                // ST indicates the end of entries.
                break;
            }
            if (entry instanceof CEEntry) {
                entries = entries.concat(entry.getEntries(isoData));
            }
            else {
                entries.push(entry);
            }
        }
        return entries;
    }


    return {
        getASCIIString,
        getJolietString,
        getDate,
        getShortFormDate,
        constructSystemUseEntry,
        constructSystemUseEntries
    };
});