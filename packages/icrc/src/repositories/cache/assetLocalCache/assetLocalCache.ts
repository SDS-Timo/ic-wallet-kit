import { ILogger, IStorage, IdentifierService, ValidationError, jsonParse, jsonStringify } from "@ic-wallet-kit/common";
import { LocalCacheAssetModel, LocalCacheSubAccountModel, SubAccountId } from "@icrc/types";
import { Inject, Service } from "typedi";

@Service()
export class AssetLocalCache {
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

    public getSubAccountById(
        ledgerAddress: string,
        subAccountId: string
    ): LocalCacheSubAccountModel | undefined {
        const asset = this.getAssetById(ledgerAddress);
        if (asset) {
            const subAccount = asset.subAccounts.find(
                (a) => a.subAccountId === subAccountId
            );
            return subAccount;
        }
        return undefined;
    }

    public getAssetById(ledgerAddress: string): LocalCacheAssetModel | undefined {
        const key = this.getKey(ledgerAddress);
        const value = this.storage.getItem(key);
        if (value) {
            try {
                const model: LocalCacheAssetModel = jsonParse(value);
                return model;
            }
            catch (e: any) {
                this.logger.logError(e, "Wrong local cache data", [value])
                return undefined;
            }
        }
        return undefined;
    }

    public setSubAccount(ledgerAddress: string, subAccount: LocalCacheSubAccountModel): void {
        const asset = this.getAssetById(ledgerAddress);
        if (asset) {
            const subAccountCache = asset.subAccounts.find((a) => a.subAccountId === subAccount.subAccountId);

            if (subAccountCache) {
                subAccountCache.balance = subAccount.balance;
            } else {
                asset.subAccounts.push(subAccount);
            }
            this.setAsset(asset);
        }
    }

    public setAsset(asset: LocalCacheAssetModel): void {
        const key = this.getKey(asset.ledgerAddress);
        this.storage.setItem(key, jsonStringify(asset));
    }

    public removeAsset(ledgerAddress: string): void {
        const key = this.getKey(ledgerAddress);
        this.storage.removeItem(key);
    }

    public removeSubAccount(ledgerAddress: string, subAccountId: SubAccountId): void {
        const asset = this.getAssetById(ledgerAddress);

        if (!asset) {
            throw new ValidationError("asset.not.found",
                "ledgerAddress",
                "Asset Not Found");
        }

        const subAccount = asset.subAccounts.find((a) => a.subAccountId === subAccountId.toString());

        if (subAccount && subAccount.balance > 0) {
            throw new ValidationError("subAccount.balance.not0",
                "",
                "Sub-Account balance more that 0");
        }

        asset.subAccounts = asset.subAccounts.filter((a) => a.subAccountId !== subAccountId.toString());

        this.setAsset(asset);
    }

    private getKey(ledgerAddress: string): string {
        return `${this.identifierService.getPrincipal()}-${ledgerAddress}`;
    }
}