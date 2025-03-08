"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheDataError = void 0;
class CacheDataError extends Error {
    errorType;
    constructor(errorType, message) {
        super(message);
        this.errorType = errorType;
    }
}
exports.CacheDataError = CacheDataError;
