import { HplMintCacheModel } from "@hpl/types/cache/hplMintCacheModel";
import { HplMintDataCacheModel } from "@hpl/types/cache/hplMintDataCacheModel";
import { IdentifierService, ILocalCacheStorage, ILogger, IStorage, jsonParse, jsonStringify, ValidationError } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";


export interface IHplMintCacheRepository extends ILocalCacheStorage {
    getHplMintByCanisterId(canisterId: string): HplMintCacheModel | undefined;
    setHplMint(hplAsset: HplMintCacheModel): void;
    removeMint(canisterId: string): void;
}

@Service("IHplMintCacheRepository")
export class HplMintCacheRepository implements IHplMintCacheRepository {

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

    public getHplMintByCanisterId(canisterId: string): HplMintCacheModel | undefined {
        const key = this.getKey();
        const value = this.storage.getItem(key);
        if (value) {
            try {
                const model: HplMintDataCacheModel = jsonParse(value);
                return model.virtualAccountsMints.find((va) => va.canisterId === canisterId);
            }
            catch (e: any) {
                this.logger.logError(e, "Wrong local cache data", [value])
                return undefined;
            }
        }
        return undefined;
    }

    public setHplMint(hplMint: HplMintCacheModel): void {
        const key = this.getKey();
        let model = this.getItem(key);
        if (!model) {
            model = {
                virtualAccountsMints: []
            }
        }
        const item = model.virtualAccountsMints.find((va) => va.canisterId === hplMint.canisterId);
        if (item) {
            item.isMinter = hplMint.isMinter;
        }
        else {
            model.virtualAccountsMints.push(hplMint);
        }
        this.storage.setItem(key, jsonStringify(model));
    }

    public removeMint(canisterId: string): void {
        const key = this.getKey();
        this.storage.removeItem(key);
        const model = this.getItem(key);

        if (!model) {
            throw new ValidationError("virtual.account.not.found",
                "",
                "Virtual Account Not Found")
        }

        const item = model.virtualAccountsMints.find((a) => a.canisterId === canisterId);

        if (item) {
            model.virtualAccountsMints = model.virtualAccountsMints.filter((a) => a.canisterId !== canisterId);
        }
        this.storage.setItem(key, jsonStringify(model));
    }

    private getItem(key: string): HplMintDataCacheModel | undefined {
        const value = this.storage.getItem(key);
        if (value) {
            try {
                const model: HplMintDataCacheModel = jsonParse(value);
                return model;
            }
            catch (e: any) {
                console.log("catch");
                this.logger.logError(e, "Wrong local cache data", [value])
                return undefined;
            }
        }
        return undefined
    }

    private getKey(): string {
        return `${this.identifierService.getPrincipal()}-hplMints`;
    }
}