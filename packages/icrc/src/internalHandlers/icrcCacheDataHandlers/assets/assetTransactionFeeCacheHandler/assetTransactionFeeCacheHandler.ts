
import { BaseCacheDataHandlerV2, CacheDataError, IInfo, ILogger, IdentifierService, LoadType } from "@ic-wallet-kit/common";
import { IcrcCacheTransactionFeeErrorKey, IcrcCacheTransactionFeeErrorMessage } from "@icrc/errors/cacheErrorMessages";
import { AssetLocalCache } from "@icrc/repositories";
import { LedgerWrapper } from "@icrc/wrappers/icrc/ledgerWrapper/ledgerWrapper";
import { Inject, Service } from "typedi";

export interface AssetTransactionFeeInfo extends IInfo {
    ledgerAddress: string; // AssetId
}
export interface AssetTransactionFeeResult {
    transactionFee: bigint;
}

@Service()
export class AssetTransactionFeeCacheHandler extends BaseCacheDataHandlerV2<
    AssetTransactionFeeInfo,
    AssetTransactionFeeResult
> {
    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private localCacheRepository: AssetLocalCache
    ) {
        super(logger);
        this.localCacheRepository = localCacheRepository;
    }

    getCacheDataError(info: AssetTransactionFeeInfo): CacheDataError {
        return new CacheDataError(
            IcrcCacheTransactionFeeErrorKey,
            IcrcCacheTransactionFeeErrorMessage
        );
    }

    getLoadForceType(): LoadType[] {
        return [LoadType.Full];
    }

    async getExternalData(
        info: AssetTransactionFeeInfo
    ): Promise<AssetTransactionFeeResult> {
        const ledgerWrapper = LedgerWrapper.create(
            this.identifierService.getAgent(),
            info.ledgerAddress
        );
        const transactionFee = await ledgerWrapper.getTransactionFee();

        const result = {
            transactionFee: transactionFee,
        };
        return result;
    }

    updateField(
        info: AssetTransactionFeeInfo,
        data: AssetTransactionFeeResult
    ): void {
        let asset = this.localCacheRepository.getAssetById(info.ledgerAddress);
        if (!asset) {
            asset = {
                ledgerAddress: info.ledgerAddress,
                subAccounts: [],
            };
        }
        asset.transactionFee = data.transactionFee;
        this.localCacheRepository.setAsset(asset);
    }


    async getLocalCacheData(
        info: AssetTransactionFeeInfo
    ): Promise<AssetTransactionFeeResult | undefined> {

        let result: AssetTransactionFeeResult | undefined = undefined;

        const asset = this.localCacheRepository.getAssetById(info.ledgerAddress);
        if (asset && asset.transactionFee) {
            result = {
                transactionFee: asset.transactionFee,
            };
        }
        return Promise.resolve(result);
    }
}
