"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFormErrorArray = void 0;
const isFormErrorArray = (array) => {
    if (!Array.isArray(array)) {
        return false;
    }
    return array.every((x) => "fieldName" in x);
};
exports.isFormErrorArray = isFormErrorArray;
