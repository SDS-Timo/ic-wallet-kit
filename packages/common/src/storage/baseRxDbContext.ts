
import { DbContextError } from "@common/errors";
import { createRxDatabase, RxDatabase, RxStorage } from "rxdb";

export abstract class BaseRxDbContext {
    constructor(
        private rxStorage: RxStorage<any, any>
    ) {
    }

    private _db: RxDatabase | undefined;

    public abstract getDbName(): string;
    public abstract getSchema(): any;

    public get db(): RxDatabase {
        if (this._db) {
            return this._db;
        }
        throw new DbContextError("db.not.initialized", "DB is not initialized");
    }

    public set db(rxDb: RxDatabase) {
        this._db = rxDb
    }

    async init(): Promise<void> {

        this._db = await createRxDatabase({
            name: this.getDbName(),
            storage: this.rxStorage,
            ignoreDuplicate: false,
            eventReduce: true,
            hashFunction: (input: string) => {
                let hash = 0x811c9dc5; // FNV offset basis
                for (let i = 0; i < input.length; i++) {
                    hash ^= input.charCodeAt(i);
                    hash *= 0x01000193; // FNV prime
                    hash >>>= 0; // Convert to unsigned 32-bit integer
                }
                return Promise.resolve((hash >>> 0).toString());
            },
            cleanupPolicy: {},
        });
        await this._db.addCollections(this.getSchema());
    }


}