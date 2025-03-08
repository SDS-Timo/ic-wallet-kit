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
exports.BaseDataStorage = exports.updateAt = void 0;
const errors_1 = require("@common/errors");
const services_1 = require("@common/services");
const utils_1 = require("@common/utils");
require("reflect-metadata");
const typedi_1 = require("typedi");
const jsonStringify = (data) => {
    const replacer = (key, value) => typeof value === "bigint" ? value.toString() : value;
    return JSON.stringify(data, replacer);
};
const updateAt = () => {
    return Math.floor(Date.now() / 1000);
};
exports.updateAt = updateAt;
let BaseDataStorage = class BaseDataStorage {
    identifierService;
    context;
    logger;
    constructor(logger, identifierService, context) {
        this.identifierService = identifierService;
        this.context = context;
        this.logger = logger;
    }
    get collection() {
        return this.context.db.collections[this.collectionName];
    }
    async getItem(documentId) {
        try {
            const doc = await this.collection.findOne(documentId).exec();
            if (doc) {
                const result = this.mapDocToModel(doc);
                return result;
            }
            return undefined;
        }
        catch (e) {
            throw new errors_1.RxDbRepositoryError("document.get.item.error", e.message);
        }
    }
    async getItems() {
        try {
            const docs = await this.collection.find().exec();
            let result = docs?.map((doc) => { return this.mapDocToModel(doc); }) ?? [];
            return result;
        }
        catch (e) {
            throw new errors_1.RxDbRepositoryError("document.get.items.error", e.message);
        }
    }
    async addItem(document) {
        try {
            const doc = {
                id: this.getDocumentId(document),
                deleted: false,
                updatedAt: (0, exports.updateAt)(),
                payload: jsonStringify(document)
            };
            await this.collection.insert(doc);
        }
        catch (e) {
            throw new errors_1.RxDbRepositoryError("document.add.error", e.message);
        }
    }
    async addItems(documents) {
        try {
            const docs = documents.map((d) => {
                return {
                    id: this.getDocumentId(d),
                    deleted: false,
                    updatedAt: (0, exports.updateAt)(),
                    payload: jsonStringify(d)
                };
            });
            await this.collection.bulkInsert(docs);
        }
        catch (e) {
            throw new errors_1.RxDbRepositoryError("document.add.error", e.message);
        }
    }
    async updateItem(document) {
        try {
            const doc = await this.collection.findOne(this.getDocumentId(document)).exec();
            await doc.patch({
                updatedAt: (0, exports.updateAt)(),
                payload: jsonStringify(document)
            });
        }
        catch (e) {
            throw new errors_1.RxDbRepositoryError("document.update.error", e.message);
        }
    }
    async updateItems(documents) {
        try {
            const docs = documents.map((d) => {
                return {
                    id: this.getDocumentId(d),
                    deleted: false,
                    updatedAt: (0, exports.updateAt)(),
                    payload: jsonStringify(d)
                };
            });
            await this.collection.bulkUpsert(docs);
        }
        catch (e) {
            throw new errors_1.RxDbRepositoryError("document.update.error", e.message);
        }
    }
    async deleteItem(documentId) {
        const doc = await this.collection.findOne(documentId).exec();
        if (!doc) {
            throw new errors_1.RxDbRepositoryError("document.delete.error", "document not found");
        }
        await doc.remove();
    }
    mapDocToModel(item) {
        try {
            const result = (0, utils_1.jsonParse)(item.payload);
            return result;
        }
        catch (e) {
            this.logger.logError(e);
            throw e;
        }
    }
};
exports.BaseDataStorage = BaseDataStorage;
exports.BaseDataStorage = BaseDataStorage = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)("Logger")),
    __metadata("design:paramtypes", [Object, services_1.IdentifierService, Object])
], BaseDataStorage);
