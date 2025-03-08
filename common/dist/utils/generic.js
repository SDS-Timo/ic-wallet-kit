"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPxlCode = exports.toFullDecimal = exports.hexToNumber = exports.roundToDecimalN = exports.toHoleBigInt = exports.getUSDfromToken = exports.hexToUint8Array = exports.to32bits = void 0;
const big_integer_1 = __importDefault(require("big-integer"));
const to32bits = (num) => {
    const b = new ArrayBuffer(4);
    new DataView(b).setUint32(0, num);
    return Array.from(new Uint8Array(b));
};
exports.to32bits = to32bits;
const hexToUint8Array = (hex) => {
    const zero = (0, big_integer_1.default)(0);
    const n256 = (0, big_integer_1.default)(256);
    let bigNumber = (0, exports.hexToNumber)(hex);
    if (bigNumber) {
        const result = new Uint8Array(32);
        let i = 0;
        while (bigNumber.greater(zero)) {
            result[32 - i - 1] = bigNumber.mod(n256).toJSNumber();
            bigNumber = bigNumber.divide(n256);
            i += 1;
        }
        return result;
    }
    else
        return new Uint8Array(32);
};
exports.hexToUint8Array = hexToUint8Array;
const getUSDfromToken = (tokenAmount, marketPrice, decimal) => {
    return ((Number(tokenAmount) * Number(marketPrice)) / Math.pow(10, Number(decimal))).toFixed(2);
};
exports.getUSDfromToken = getUSDfromToken;
const toHoleBigInt = (numb, decimal) => {
    const parts = numb.split(".");
    if (parts.length === 1 || parts[1] === "") {
        let addZeros = "";
        for (let index = 0; index < decimal; index++) {
            addZeros = "0" + addZeros;
        }
        return BigInt(parts[0] + addZeros);
    }
    else {
        const hole = parts[0];
        const dec = parts[1];
        let addZeros = "";
        for (let index = 0; index < decimal - dec.length; index++) {
            addZeros = "0" + addZeros;
        }
        return BigInt(hole + dec + addZeros);
    }
};
exports.toHoleBigInt = toHoleBigInt;
const roundToDecimalN = (numb, decimal) => {
    return Math.round(Math.round(Number(numb) * Math.pow(10, Number(decimal))) / Math.pow(10, Number(decimal)));
};
exports.roundToDecimalN = roundToDecimalN;
const hexToNumber = (hexFormat) => {
    if (hexFormat.slice(0, 2) !== "0x")
        return undefined;
    const hex = hexFormat.substring(2);
    if (/^[a-fA-F0-9]+$/.test(hex)) {
        let numb = (0, big_integer_1.default)();
        for (let index = 0; index < hex.length; index++) {
            const digit = hex[hex.length - index - 1];
            numb = numb.add((0, big_integer_1.default)(16)
                .pow((0, big_integer_1.default)(index))
                .multiply((0, big_integer_1.default)(`0x${digit}`)));
        }
        return numb;
    }
    else {
        return undefined;
    }
};
exports.hexToNumber = hexToNumber;
const toFullDecimal = (numb, decimal, maxDecimals) => {
    if (BigInt(numb) === BigInt(0))
        return "0";
    let numbStr = numb.toString();
    if (decimal === numbStr.length) {
        if (maxDecimals === 0)
            return "0";
        const newNumber = numbStr.slice(0, maxDecimals || decimal).replace(/0+$/, "");
        return "0." + newNumber;
    }
    else if (decimal > numbStr.length) {
        for (let index = 0; index < decimal; index++) {
            numbStr = "0" + numbStr;
            if (numbStr.length > decimal)
                break;
        }
    }
    const holeStr = numbStr.slice(0, numbStr.length - decimal).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (maxDecimals === 0)
        return holeStr;
    const decimalStr = numbStr.slice(numbStr.length - decimal).replace(/0+$/, "");
    if (decimalStr === "") {
        return holeStr;
    }
    else {
        const newNumber = holeStr + "." + decimalStr.slice(0, maxDecimals || decimal);
        if (Number(newNumber) === 0)
            return "0";
        else
            return holeStr + "." + decimalStr.slice(0, maxDecimals || decimal);
    }
};
exports.toFullDecimal = toFullDecimal;
const getPxlCode = (prinCode, vtId) => {
    const id = BigInt(prinCode).toString(16);
    const link = vtId.toString(16);
    return (link.length - 1).toString(16) + id + link;
};
exports.getPxlCode = getPxlCode;
