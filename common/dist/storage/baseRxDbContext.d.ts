import { RxDatabase } from "rxdb";
export declare abstract class BaseRxDbContext {
    private rxStorage;
    constructor(rxStorage: any);
    private _db;
    abstract getDbName(): string;
    abstract getSchema(): any;
    get db(): RxDatabase;
    set db(rxDb: RxDatabase);
    init(): Promise<void>;
}
