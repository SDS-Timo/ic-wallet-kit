"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormResult = void 0;
class FormResult {
    data;
    isSuccess;
    errors;
    constructor(_data, _errors) {
        this.data = _data;
        this.isSuccess = _data != null;
        this.errors = _errors || [];
    }
    static success(_data) {
        return new FormResult(_data);
    }
    static error(_errors) {
        return new FormResult(undefined, _errors);
    }
}
exports.FormResult = FormResult;
