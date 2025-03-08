import { ILogger, IStorage, IdentifierService, jsonParse, jsonStringify } from "@ic-wallet-middleware/common";
import { LocalCacheCreditModel } from "@icrc/types/services/localCacheCreditModel";
import { LocalCacheServiceAssetModel } from "@icrc/types/services/localCacheServiceAssetModel";
import { LocalCacheServiceModel } from "@icrc/types/services/localCacheServiceModel";
import { Inject, Service } from "typedi";

@Service()
export class ServiceLocalCache {
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

    public getService(serviceId: string): LocalCacheServiceModel | undefined {
        return this.getServiceInternal(serviceId);
    }

    public setService(service: LocalCacheServiceModel): void {
        const key = this.getKey(service.servicePrincipal);
        this.storage.setItem(key, jsonStringify(service));
    }

    public getServiceAsset(serviceId: string, ledgerAddress: string): LocalCacheServiceAssetModel | undefined {
        const model = this.getServiceInternal(serviceId);
        if (model) {
            const asset = model.assets.find(
                (a) => a.ledgerAddress === ledgerAddress
            );
            return asset;
        }
        return undefined;
    }

    public setServiceAsset(serviceId: string, asset: LocalCacheServiceAssetModel): void {
        const service = this.getServiceInternal(serviceId);
        if (service) {
            const assetCache = service.assets.find((a) => a.ledgerAddress === asset.ledgerAddress);

            if (assetCache) {
                assetCache.deposit = asset.deposit;
            } else {
                service.assets.push(asset);
            }
            this.setService(service);
        }
    }

    public getAllCredits(serviceId: string): LocalCacheCreditModel[] | undefined {
        const key = this.getKeyCredits(serviceId);
        const value = this.storage.getItem(key);
        if (value) {
            try {
                const model: LocalCacheCreditModel[] = jsonParse(value);
                return model;
            }
            catch (e: any) {
                this.logger.logError(e, "Wrong local cache data", [value])
                return undefined;
            }
        }
        return undefined;
    }

    public setCredits(serviceId: string, credits: LocalCacheCreditModel[]): void {
        const key = this.getKeyCredits(serviceId);
        this.storage.setItem(key, jsonStringify(credits));
    }

    private getServiceInternal(serviceId: string): LocalCacheServiceModel | undefined {
        const key = this.getKey(serviceId);
        const value = this.storage.getItem(key);
        if (value) {
            try {
                const model: LocalCacheServiceModel = jsonParse(value);
                return model;
            }
            catch (e: any) {
                this.logger.logError(e, "Wrong local cache data", [value])
                return undefined;
            }
        }
        return undefined;
    }

    private getKey(serviceId: string): string {
        return `${this.identifierService.getPrincipal()}-supported-assets-${serviceId}`;
    }

    private getKeyCredits(serviceId: string): string {
        return `${this.identifierService.getPrincipal()}-credits-${serviceId}`;
    }
}