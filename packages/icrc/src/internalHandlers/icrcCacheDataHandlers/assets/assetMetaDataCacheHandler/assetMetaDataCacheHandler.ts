import { BaseCacheDataHandlerV2, CacheDataError, IInfo, ILogger, IdentifierService, LoadType } from "@ic-wallet-middleware/common";
import { IcrcCacheMetadataErrorKey, IcrcCacheMetadataErrorMessage } from "@icrc/errors/cacheErrorMessages";
import { AssetLocalCache } from "@icrc/repositories";
import { LedgerWrapper } from "@icrc/wrappers/icrc/ledgerWrapper/ledgerWrapper";
import { Inject, Service } from "typedi";

export interface AssetMetaDataInfo extends IInfo {
    ledgerAddress: string; // AssetId
}

export interface AssetMetaDataResult {
    symbol: string;
    name: string;
    decimals: number;
    logo: string;
    fee: bigint;
}

@Service()
export class AssetMetaDataCacheHandler extends BaseCacheDataHandlerV2<AssetMetaDataInfo, AssetMetaDataResult> {
    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private localCacheRepository: AssetLocalCache
    ) {
        super(logger);
    }

    getCacheDataError(info: AssetMetaDataInfo): CacheDataError {
        return new CacheDataError(
            IcrcCacheMetadataErrorKey,
            IcrcCacheMetadataErrorMessage
        );
    }

    getLoadForceType(): LoadType[] {
        return [LoadType.Full];
    }

    async getExternalData(info: AssetMetaDataInfo): Promise<AssetMetaDataResult> {
        const ledgerWrapper = LedgerWrapper.create(
            this.identifierService.getAgent(),
            info.ledgerAddress
        );
        const metaData = await ledgerWrapper.getIcrcMetadataInfo();

        const result = {
            symbol: metaData.symbol,
            name: metaData.name,
            decimals: metaData.decimals,
            logo: metaData.logo,
            fee: metaData.fee,
        };
        return result;
    }

    updateField(info: AssetMetaDataInfo, data: AssetMetaDataResult): void {
        let asset = this.localCacheRepository.getAssetById(info.ledgerAddress);
        if (!asset) {
            asset = {
                ledgerAddress: info.ledgerAddress,
                subAccounts: [],
            };
        }
        asset.metaData = {
            decimals: data.decimals,
            fee: data.fee,
            logo: data.logo,
            name: data.name,
            symbol: data.symbol,
        };
        this.localCacheRepository.setAsset(asset);
    }

    getLocalCacheData(
        info: AssetMetaDataInfo
    ): Promise<AssetMetaDataResult | undefined> {
        const asset = this.localCacheRepository.getAssetById(info.ledgerAddress);

        let result: AssetMetaDataResult | undefined = undefined;

        if (asset && asset.metaData) {
            result = {
                symbol: asset.metaData.symbol,
                name: asset.metaData.name,
                decimals: asset.metaData.decimals,
                logo: asset.metaData.logo,
                fee: asset.metaData.fee,
            };

        }
        return Promise.resolve(result);
    }
}
