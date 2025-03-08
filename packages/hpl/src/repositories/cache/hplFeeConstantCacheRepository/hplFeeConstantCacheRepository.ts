import { IdentifierService, ILocalCacheStorage, ILogger, IStorage, jsonParse, jsonStringify } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";


export interface IHplFeeConstantCacheRepository extends ILocalCacheStorage {
    getFeeConstantByCanisterId(canisterId: string): bigint | undefined;
    setFeeConstant(canisterId: string, feeConstant: bigint): void;
    removeFeeConstant(canisterId: string): void;
}

@Service("IHplFeeConstantCacheRepository")
export class HplFeeConstantCacheRepository implements IHplFeeConstantCacheRepository {

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

    public getFeeConstantByCanisterId(canisterId: string): bigint | undefined {
        const key = this.getKey(canisterId);
        const value = this.storage.getItem(key);
        if (value) {
            try {
                const feeConstant: bigint = jsonParse(value);
                return feeConstant;
            }
            catch (e: any) {
                this.logger.logError(e, "Wrong local cache data", [value])
                return undefined;
            }
        }
        return undefined;
    }

    public setFeeConstant(canisterId: string, feeConstant: bigint): void {
        const key = this.getKey(canisterId);
        this.storage.setItem(key, jsonStringify(feeConstant));
    }

    public removeFeeConstant(canisterId: string): void {
        const key = this.getKey(canisterId);
        this.storage.removeItem(key);
    }

    private getKey(canisterId: string): string {
        return `${this.identifierService.getPrincipal()}-${canisterId}-hplFeeConstant`;
    }
}