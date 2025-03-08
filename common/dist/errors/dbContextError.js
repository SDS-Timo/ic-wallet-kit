"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbContextError = void 0;
class DbContextError extends Error {
    errorType;
    constructor(errorType, message) {
        super(message);
        this.errorType = errorType;
    }
}
exports.DbContextError = DbContextError;
