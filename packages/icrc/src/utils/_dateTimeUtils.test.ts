import {
    convertBigIntToDateString,
    convertDateStringToBigInt,
    convertDateStringToNumber,
    convertNumberToDateString
} from "@icrc/utils/dateTimeUtils";
import moment from "moment";

describe("Date Conversion Utilities", () => {
    const format = "YYYY-MM-DD HH:mm:ss";
    const validDateString = "2025-02-03 12:30:45";
    //  const invalidDateString = "invalid-date";
    const timestampInMicroseconds = 1733273445000000n; // Equivalent to 2025-02-03 12:30:45 in microseconds

    it("convertDateStringToBigInt: Converts valid date string to BigInt", () => {
        const result = convertDateStringToBigInt(validDateString, format);
        expect(result).toBe(BigInt(moment(validDateString, format).utc().valueOf() * 1000000));
    });

    it("convertDateStringToBigInt: Returns undefined for undefined input", () => {
        expect(convertDateStringToBigInt(undefined, format)).toBeUndefined();
    });

    it("convertDateStringToNumber: Converts valid date string to number", () => {
        const result = convertDateStringToNumber(validDateString, format);
        expect(result).toBe(moment(validDateString, format).utc().valueOf() * 1000000);
    });

    it("convertDateStringToNumber: Returns undefined for undefined input", () => {
        expect(convertDateStringToNumber(undefined, format)).toBeUndefined();
    });

    it("convertBigIntToDateString: Converts BigInt timestamp to formatted date string", () => {
        const result = convertBigIntToDateString(timestampInMicroseconds, format);
        expect(result).toBe(moment.utc(Number(timestampInMicroseconds) / 1000000).local().format(format));
    });

    it("convertBigIntToDateString: Converts array with BigInt to formatted date string", () => {
        const result = convertBigIntToDateString([timestampInMicroseconds], format);
        expect(result).toBe(moment.utc(Number(timestampInMicroseconds) / 1000000).local().format(format));
    });

    it("convertBigIntToDateString: Returns undefined for undefined input", () => {
        expect(convertBigIntToDateString(undefined, format)).toBeUndefined();
    });

    it("convertNumberToDateString: Returns undefined for undefined input", () => {
        expect(convertNumberToDateString(undefined, format)).toBeUndefined();
    });
});
