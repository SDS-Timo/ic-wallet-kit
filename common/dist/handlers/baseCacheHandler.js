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
exports.BaseCacheDataHandler = void 0;
const baseHandler_1 = require("@common/handlers/baseHandler");
require("reflect-metadata");
const typedi_1 = require("typedi");
let BaseCacheDataHandler = class BaseCacheDataHandler extends baseHandler_1.BaseHandler {
    constructor(logger) {
        super(logger);
    }
    async process(info) {
        if (info.force) {
            return await this.getInternalIcrcData(info, false);
        }
        const localResult = await this.getLocalCacheData(info);
        if (localResult) {
            return localResult;
        }
        return await this.getInternalIcrcData(info, true);
    }
    async getInternalIcrcData(info, icrcFail) {
        try {
            const result = await this.getIcrcData(info);
            this.updateField(info, result);
            return result;
        }
        catch (e) {
            if (e.message && e.message.toString().indexOf("fetch failed") !== -1) {
                if (!icrcFail) {
                    const localResult = await this.getLocalCacheData(info);
                    if (localResult) {
                        return localResult;
                    }
                }
                throw this.getCacheDataError(info);
            }
            throw e;
        }
    }
};
exports.BaseCacheDataHandler = BaseCacheDataHandler;
exports.BaseCacheDataHandler = BaseCacheDataHandler = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)("Logger")),
    __metadata("design:paramtypes", [Object])
], BaseCacheDataHandler);
