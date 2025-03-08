"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonStringify = exports.jsonParse = exports.replacerStrToBigint = exports.replacerBigintToStr = void 0;
const replacerBigintToStr = (key, value) => typeof value === "bigint" ? `BIGINT::${value}` : value;
exports.replacerBigintToStr = replacerBigintToStr;
const replacerStrToBigint = (key, value) => {
    if (typeof value === "string" && value.startsWith('BIGINT::')) {
        return BigInt(value.substr(8));
    }
    return value;
};
exports.replacerStrToBigint = replacerStrToBigint;
const jsonParse = (value) => {
    return JSON.parse(value, exports.replacerStrToBigint);
};
exports.jsonParse = jsonParse;
const jsonStringify = (data) => {
    return JSON.stringify(data, exports.replacerBigintToStr);
};
exports.jsonStringify = jsonStringify;
