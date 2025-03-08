import { HplDataCacheModel } from "@hpl/types";
import { IdentifierService, ILocalCacheStorage, ILogger, IStorage, jsonParse, jsonStringify } from "@ic-wallet-kit/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

export interface IHplDataCacheRepository extends ILocalCacheStorage {
    getHplDataByCanisterId(canisterId: string): HplDataCacheModel | undefined;
    setHplData(canisterId: string, hplData: HplDataCacheModel): void;
    removeHplData(canisterId: string): void;
}

@Service("IHplDataCacheRepository")
export class HplDataCacheRepository implements IHplDataCacheRepository {

    private logger: ILogger;
    private storage: IStorage;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        @Inject("IStorage")
        storage: IStorage
    ) {
        this.logger = logger;
        this.storage = storage;
    }

    public getHplDataByCanisterId(canisterId: string): HplDataCacheModel | undefined {
        const key = this.getKey(canisterId);
        const value = this.storage.getItem(key);
        if (value) {
            try {
                const model: HplDataCacheModel = jsonParse(value);
                return model;
            }
            catch (e: any) {
                this.logger.logError(e, "Wrong local cache data", [value])
                return undefined;
            }
        }
        return undefined;
    }

    public setHplData(canisterId: string, hplData: HplDataCacheModel): void {
        const key = this.getKey(canisterId);
        this.storage.setItem(key, jsonStringify(hplData));
    }

    public removeHplData(canisterId: string): void {
        const key = this.getKey(canisterId);
        this.storage.removeItem(key);
    }

    private getKey(canisterId: string): string {
        return `${this.identifierService.getPrincipal()}-${canisterId}-hplEntities`;
    }
}