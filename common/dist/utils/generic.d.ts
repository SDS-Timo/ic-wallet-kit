export declare const to32bits: (num: number) => number[];
export declare const hexToUint8Array: (hex: string) => Uint8Array;
export declare const getUSDfromToken: (tokenAmount: string | number, marketPrice: string | number, decimal: string | number) => string;
export declare const toHoleBigInt: (numb: string, decimal: number) => bigint;
export declare const roundToDecimalN: (numb: number | string, decimal: number | string) => number;
export declare const hexToNumber: (hexFormat: string) => any;
export declare const toFullDecimal: (numb: bigint | string, decimal: number, maxDecimals?: number) => string;
export declare const getPxlCode: (prinCode: string, vtId: bigint) => string;
