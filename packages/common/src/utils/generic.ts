import bigInt from "big-integer";

export const to32bits = (num: number) => {
    const b = new ArrayBuffer(4);
    new DataView(b).setUint32(0, num);
    return Array.from(new Uint8Array(b));
};

export const hexToUint8Array = (hex: string): Uint8Array => {
    const zero = bigInt(0);
    const n256 = bigInt(256);
    let bigNumber = hexToNumber(hex);
    if (bigNumber) {
        const result = new Uint8Array(32);
        let i = 0;
        while (bigNumber.greater(zero)) {
            result[32 - i - 1] = bigNumber.mod(n256).toJSNumber();
            bigNumber = bigNumber.divide(n256);
            i += 1;
        }
        return result;
    } else return new Uint8Array(32);
};


export const getUSDfromToken = (
    tokenAmount: string | number,
    marketPrice: string | number,
    decimal: string | number,
): string => {
    return ((Number(tokenAmount) * Number(marketPrice)) / Math.pow(10, Number(decimal))).toFixed(2);
};

export const roundToDecimalN = (numb: number | string, decimal: number | string): number => {
    return Math.round(Math.round(Number(numb) * Math.pow(10, Number(decimal))) / Math.pow(10, Number(decimal)));
};

export const hexToNumber = (hexFormat: string) => {
    if (hexFormat.slice(0, 2) !== "0x") return undefined;
    const hex = hexFormat.substring(2);
    if (/^[a-fA-F0-9]+$/.test(hex)) {
        let numb = bigInt();
        for (let index = 0; index < hex.length; index++) {
            const digit = hex[hex.length - index - 1];
            numb = numb.add(
                bigInt(16)
                    .pow(bigInt(index))
                    .multiply(bigInt(`0x${digit}`)),
            );
        }
        return numb;
    } else {
        return undefined;
    }
};

export const getPxlCode = (prinCode: string, vtId: bigint) => {
    const id = BigInt(prinCode).toString(16);
    const link = vtId.toString(16);
    return (link.length - 1).toString(16) + id + link;
};
