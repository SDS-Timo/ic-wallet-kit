"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
class ValidationError extends Error {
    localizationKey;
    fieldName;
    constructor(localizationKey, fieldName, message) {
        super(message);
        this.localizationKey = localizationKey;
        this.fieldName = fieldName;
    }
}
exports.ValidationError = ValidationError;
