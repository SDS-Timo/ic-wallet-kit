export const jsonStringify = (data: any): string => {
    const replacer = (key: any, value: any) => typeof value === "bigint" ? value.toString() : value;
    return JSON.stringify(data, replacer, 4);

}