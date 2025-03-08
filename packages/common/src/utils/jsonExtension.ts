export const replacerBigintToStr = (key: any, value: any) =>
    typeof value === "bigint" ? `BIGINT::${value}` : value;
export const replacerStrToBigint = (key: any, value: any) => {
    if (typeof value === "string" && value.startsWith('BIGINT::')) {
        return BigInt(value.substr(8));
    }
    return value;
}

export const jsonParse = (value: string) => {
    return JSON.parse(value, replacerStrToBigint)
}

export const jsonStringify = (data: any) => {
    return JSON.stringify(data, replacerBigintToStr);
}