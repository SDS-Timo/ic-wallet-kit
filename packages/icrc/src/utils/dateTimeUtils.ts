import moment from "moment";

export const convertDateStringToBigInt = (date: string | undefined, format: string) => {
    if (!date) {
        return undefined;
    }
    const value = moment(date, format).utc().valueOf() * 1000000;
    return BigInt(value);
};

export const convertDateStringToNumber = (date: string | undefined, format: string) => {

    const result = date ? moment(date, format).utc().valueOf() * 1000000 : undefined;

    return result;
};

export const convertBigIntToDateString = (date: bigint | [bigint] | undefined, format: string) => {
    if (Array.isArray(date)) {
        date = date[0];
    }

    if (!date) {
        return undefined;
    }

    const dateNumber = Number(date);
    return convertNumberToDateString(dateNumber, format);
};

export const convertNumberToDateString = (date: number | undefined, format: string) => {
    return date ? moment.utc(date / 1000000).local().format(format) : undefined;
};
