"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseHandler = void 0;
const formResult_1 = require("@common/forms/formResult");
require("reflect-metadata");
const typedi_1 = require("typedi");
let BaseHandler = class BaseHandler {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    async handle(form) {
        try {
            await this.validate(form);
            const data = await this.process(form);
            return formResult_1.FormResult.success(data);
        }
        catch (e) {
            this.logger.logError(e);
            return this.processInternalError(e);
        }
    }
    processInternalError(error) {
        const errors = this.processError(error);
        if (errors.length > 0) {
            return formResult_1.FormResult.error(errors);
        }
        const validation = error;
        if (validation && validation.localizationKey) {
            errors.push({
                localizationKey: validation.localizationKey,
                fieldName: validation.fieldName,
                message: validation.message
            });
        }
        else {
            if (error instanceof Error) {
                errors.push({
                    message: error.message,
                    fieldName: "",
                    localizationKey: "default.error.message"
                });
            }
            else {
                errors.push({
                    message: JSON.stringify(error) ?? "undefined",
                    fieldName: "",
                    localizationKey: "unexpected.error.message"
                });
            }
        }
        return formResult_1.FormResult.error(errors);
    }
};
exports.BaseHandler = BaseHandler;
exports.BaseHandler = BaseHandler = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)("Logger")),
    __metadata("design:paramtypes", [Object])
], BaseHandler);
