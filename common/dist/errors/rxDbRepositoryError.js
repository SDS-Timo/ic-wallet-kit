"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RxDbRepositoryError = void 0;
class RxDbRepositoryError extends Error {
    errorType;
    constructor(errorType, message) {
        super(message);
        this.errorType = errorType;
    }
}
exports.RxDbRepositoryError = RxDbRepositoryError;
