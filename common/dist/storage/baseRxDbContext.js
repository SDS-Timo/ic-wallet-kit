"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRxDbContext = void 0;
const errors_1 = require("@common/errors");
const rxdb_1 = require("rxdb");
class BaseRxDbContext {
    rxStorage;
    constructor(rxStorage) {
        this.rxStorage = rxStorage;
    }
    _db;
    get db() {
        if (this._db) {
            return this._db;
        }
        throw new errors_1.DbContextError("db.not.initialized", "DB is not initialized");
    }
    set db(rxDb) {
        this._db = rxDb;
    }
    async init() {
        this._db = await (0, rxdb_1.createRxDatabase)({
            name: this.getDbName(),
            storage: this.rxStorage,
            ignoreDuplicate: true,
            eventReduce: true,
            cleanupPolicy: {},
        });
        await this._db.addCollections(this.getSchema());
    }
}
exports.BaseRxDbContext = BaseRxDbContext;
