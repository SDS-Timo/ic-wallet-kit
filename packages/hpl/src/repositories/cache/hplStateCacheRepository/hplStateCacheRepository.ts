import { HplFtSuppliesCacheModel } from "@hpl/types/cache/hplFtSuppliesCacheModel";
import { HplStateAccountsCacheModel } from "@hpl/types/cache/hplStateAccountsCacheModel";
import { HplStateCacheModel } from "@hpl/types/cache/hplStateCacheModel";
import { HplStateRemoteAccountsCacheModel } from "@hpl/types/cache/hplStateRemoteAccountsCacheModel";
import { HplStateVirtualAccountsCacheModel } from "@hpl/types/cache/hplStateVirtualAccountsCacheModel";
import { IdentifierService, ILocalCacheStorage, ILogger, IStorage, jsonParse, jsonStringify } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

export interface IHplStateCacheRepository extends ILocalCacheStorage {
    getHplFtSuppliesState(canisterId: string): HplFtSuppliesCacheModel[] | undefined;
    setHplFtSuppliesState(canisterId: string, hplState: HplFtSuppliesCacheModel[]): void;
    removeHplFtSuppliesState(canisterId: string): void;
    getHplAccountState(canisterId: string): HplStateAccountsCacheModel[] | undefined;
    setHplAccountState(canisterId: string, hplState: HplStateAccountsCacheModel[]): void;
    getHplRemoteAccountState(canisterId: string): HplStateRemoteAccountsCacheModel[] | undefined;
    setHplRemoteAccountState(canisterId: string, hplState: HplStateRemoteAccountsCacheModel[]): void;
    removeHplAccountState(canisterId: string): void;
    getHplVirtualAccountState(canisterId: string): HplStateVirtualAccountsCacheModel[] | undefined;
    setHplVirtualAccountState(canisterId: string, hplState: HplStateVirtualAccountsCacheModel[]): void;
    removeHplVirtualAccountState(canisterId: string): void;
    getHplAdminState(canisterId: string): HplStateCacheModel | undefined;
    setHplAdminState(canisterId: string, hplState: HplStateCacheModel): void;
    removeAdminState(canisterId: string): void;
}

@Service("IHplStateCacheRepository")
export class HplStateCacheRepository implements IHplStateCacheRepository {

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

    public getHplRemotesToLookState(canisterId: string): HplStateRemoteAccountsCacheModel[] | undefined {
        const key = this.getRemotesToLookStateKey(canisterId);
        return this.getInternalState(key);
    }

    public setHplRemotesToLookState(canisterId: string, hplAsset: HplStateRemoteAccountsCacheModel[]): void {
        const key = this.getRemotesToLookStateKey(canisterId);
        this.storage.setItem(key, jsonStringify(hplAsset));
    }

    public removeHplRemotesToLookState(canisterId: string): void {
        const key = this.getRemotesToLookStateKey(canisterId);
        this.storage.removeItem(key);
    }

    public getHplVirtualAccountState(canisterId: string): HplStateVirtualAccountsCacheModel[] | undefined {
        const key = this.getVirtualAccountStateKey(canisterId);
        return this.getInternalState<HplStateVirtualAccountsCacheModel[]>(key);
    }

    public setHplVirtualAccountState(canisterId: string, hplVirtualAccount: HplStateVirtualAccountsCacheModel[]): void {
        const key = this.getVirtualAccountStateKey(canisterId);
        this.storage.setItem(key, jsonStringify(hplVirtualAccount));
    }

    public removeHplVirtualAccountState(canisterId: string): void {
        const key = this.getVirtualAccountStateKey(canisterId);
        this.storage.removeItem(key);
    }

    public getHplAccountState(canisterId: string): HplStateAccountsCacheModel[] | undefined {
        const key = this.getAccountStateKey(canisterId);
        return this.getInternalState<HplStateAccountsCacheModel[]>(key);
    }

    public setHplAccountState(canisterId: string, hplAccounts: HplStateAccountsCacheModel[]): void {
        const key = this.getAccountStateKey(canisterId);
        this.storage.setItem(key, jsonStringify(hplAccounts));
    }

    public getHplRemoteAccountState(canisterId: string): HplStateRemoteAccountsCacheModel[] | undefined {
        const key = this.getRemoteAccountStateKey(canisterId);
        return this.getInternalState<HplStateRemoteAccountsCacheModel[]>(key);
    }

    public setHplRemoteAccountState(canisterId: string, hplAccounts: HplStateRemoteAccountsCacheModel[]): void {
        const key = this.getRemoteAccountStateKey(canisterId);
        this.storage.setItem(key, jsonStringify(hplAccounts));
    }

    public removeHplAccountState(canisterId: string): void {
        const key = this.getAccountStateKey(canisterId);
        this.storage.removeItem(key);
    }

    public getHplFtSuppliesState(canisterId: string): HplFtSuppliesCacheModel[] | undefined {
        const key = this.getStateKey(canisterId);
        return this.getInternalState(key);
    }

    public setHplFtSuppliesState(canisterId: string, hplAsset: HplFtSuppliesCacheModel[]): void {
        const key = this.getStateKey(canisterId);
        this.storage.setItem(key, jsonStringify(hplAsset));
    }

    public removeHplFtSuppliesState(canisterId: string): void {
        const key = this.getStateKey(canisterId);
        this.storage.removeItem(key);
    }

    public getHplAdminState(canisterId: string): HplStateCacheModel | undefined {
        const key = this.getAdminStateKey(canisterId);
        return this.getInternalState(key);
    }

    public setHplAdminState(canisterId: string, hplAsset: HplStateCacheModel): void {
        const key = this.getAdminStateKey(canisterId);
        this.storage.setItem(key, jsonStringify(hplAsset));
    }

    public removeAdminState(canisterId: string): void {
        const key = this.getAdminStateKey(canisterId);
        this.storage.removeItem(key);
    }

    private getInternalState<T>(key: string): T | undefined {
        const value = this.storage.getItem(key);
        if (value) {
            try {
                const model: T = jsonParse(value);
                return model;
            }
            catch (e: any) {
                this.logger.logError(e, "Wrong local cache data", [value])
                return undefined;
            }
        }
        return undefined;
    }

    private getStateKey(canisterId: string): string {
        return `${this.identifierService.getPrincipal()}-${canisterId}-hplFtSuppliesState`;
    }
    private getAccountStateKey(canisterId: string): string {
        return `${this.identifierService.getPrincipal()}-${canisterId}-hplAccountState`;
    }
    private getRemoteAccountStateKey(canisterId: string): string {
        return `${this.identifierService.getPrincipal()}-${canisterId}-hplRemoteAccountState`;
    }
    private getVirtualAccountStateKey(canisterId: string): string {
        return `${this.identifierService.getPrincipal()}-${canisterId}-hplVirtualAccountState`;
    }
    private getRemotesToLookStateKey(canisterId: string): string {
        return `${this.identifierService.getPrincipal()}-${canisterId}-hplRemotesToLookState`;
    }
    private getAdminStateKey(canisterId: string): string {
        return `${this.identifierService.getPrincipal()}-${canisterId}-hplAdminState`;
    }
}