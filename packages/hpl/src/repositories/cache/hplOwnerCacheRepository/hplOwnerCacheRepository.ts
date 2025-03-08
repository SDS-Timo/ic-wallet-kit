import { HplOwnerDataCacheModel } from "@hpl/types/cache/hplOwnerDataCacheModel";
import { IdentifierService, ILocalCacheStorage, ILogger, IStorage, jsonParse, jsonStringify } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";


export interface IHplOwnerCacheRepository extends ILocalCacheStorage {
    getHplOwnerByCanisterId(canisterId: string): HplOwnerDataCacheModel | undefined;
    setHplOwner(canisterId: string, hplAsset: HplOwnerDataCacheModel): void;
    removeOwner(canisterId: string): void;
}

@Service("IHplOwnerCacheRepository")
export class HplOwnerCacheRepository implements IHplOwnerCacheRepository {

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

    public getHplOwnerByCanisterId(canisterId: string): HplOwnerDataCacheModel | undefined {
        const key = this.getKey(canisterId);
        const value = this.storage.getItem(key);
        if (value) {
            try {
                const model: HplOwnerDataCacheModel = jsonParse(value);
                return model;
            }
            catch (e: any) {
                this.logger.logError(e, "Wrong local cache data", [value])
                return undefined;
            }
        }
        return undefined;
    }

    public setHplOwner(canisterId: string, hplAsset: HplOwnerDataCacheModel): void {
        const key = this.getKey(canisterId);
        this.storage.setItem(key, jsonStringify(hplAsset));
    }

    public removeOwner(canisterId: string): void {
        const key = this.getKey(canisterId);
        this.storage.removeItem(key);
    }

    private getKey(canisterId: string): string {
        return `${this.identifierService.getPrincipal()}-${canisterId}-hplOwners`;
    }
}