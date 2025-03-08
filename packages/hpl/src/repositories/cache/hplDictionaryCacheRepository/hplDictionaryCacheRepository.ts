import { HplDictionaryDataCacheModel } from "@hpl/types/cache/hplDictionaryDataCacheModel";
import { IdentifierService, ILocalCacheStorage, ILogger, IStorage, jsonParse, jsonStringify } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";


export interface IHplDictionaryCacheRepository extends ILocalCacheStorage {
    getHplDictionaryByCanisterId(canisterId: string): HplDictionaryDataCacheModel | undefined;
    setHplDictionary(canisterId: string, hplAsset: HplDictionaryDataCacheModel): void;
    removeDictionary(canisterId: string): void;
}

@Service("IHplDictionaryCacheRepository")
export class HplDictionaryCacheRepository implements IHplDictionaryCacheRepository {

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

    public getHplDictionaryByCanisterId(canisterId: string): HplDictionaryDataCacheModel | undefined {
        const key = this.getKey(canisterId);
        const value = this.storage.getItem(key);
        if (value) {
            try {
                const model: HplDictionaryDataCacheModel = jsonParse(value);
                return model;
            }
            catch (e: any) {
                this.logger.logError(e, "Wrong local cache data", [value])
                return undefined;
            }
        }
        return undefined;
    }

    public setHplDictionary(canisterId: string, hplAsset: HplDictionaryDataCacheModel): void {
        const key = this.getKey(canisterId);
        this.storage.setItem(key, jsonStringify(hplAsset));
    }

    public removeDictionary(canisterId: string): void {
        const key = this.getKey(canisterId);
        this.storage.removeItem(key);
    }

    private getKey(canisterId: string): string {
        return `${this.identifierService.getPrincipal()}-${canisterId}-hplAssetDictionaries`;
    }
}