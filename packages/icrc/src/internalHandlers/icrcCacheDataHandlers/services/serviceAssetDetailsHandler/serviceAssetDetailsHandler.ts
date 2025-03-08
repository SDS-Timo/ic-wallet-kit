import { BaseCacheDataHandler, CacheDataError, IInfo, ILogger, IdentifierService, LoadType } from "@ic-wallet-kit/common";
import { IcrcCacheBalanceErrorKey, IcrcCacheBalanceErrorMessage } from "@icrc/errors/cacheErrorMessages";
import { ServiceLocalCache } from "@icrc/repositories";
import { AssetDetailModel } from "@icrc/types/services/assetDetailModel";
import { Icrc84ActorWrapper } from "@icrc/wrappers";
import "reflect-metadata";
import { Inject, Service } from "typedi";


export interface ServiceAssetDetailsInfo extends IInfo {
    servicePrincipal: string;
    ledgerAddress: string;
}
export interface ServiceAssetDetailsResult {
    assetDetail: AssetDetailModel;
}

@Service()
export class ServiceAssetDetailsHandler extends BaseCacheDataHandler<
    ServiceAssetDetailsInfo,
    ServiceAssetDetailsResult
> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private serviceCacheRepository: ServiceLocalCache
    ) {
        super(logger);
    }

    validate(info: ServiceAssetDetailsInfo): Promise<void> {
        return Promise.resolve();
    }

    getCacheDataError(info: ServiceAssetDetailsInfo): CacheDataError {
        return new CacheDataError(
            IcrcCacheBalanceErrorKey,
            IcrcCacheBalanceErrorMessage
        );
    }

    getLoadForceType(): LoadType[] {
        return [LoadType.Full, LoadType.Quick];
    }

    async getExternalData(info: ServiceAssetDetailsInfo): Promise<ServiceAssetDetailsResult> {
        const icrc84ActorWrapper = Icrc84ActorWrapper.create(
            this.identifierService.getAgent(),
            info.servicePrincipal,
        );

        try {
            const details = await icrc84ActorWrapper.getAssetInfo(info.ledgerAddress);
            return {
                assetDetail: {
                    allowanceFee: details.allowance_fee,
                    depositFee: details.deposit_fee,
                    withdrawalFee: details.withdrawal_fee
                }
            }
        }
        catch (e) {
            throw new CacheDataError("", "");
        }
    }

    updateField(info: ServiceAssetDetailsInfo, data: ServiceAssetDetailsResult): void {
        let asset = this.serviceCacheRepository.getServiceAsset(info.servicePrincipal, info.ledgerAddress);
        if (!asset) {
            asset = {
                ledgerAddress: info.ledgerAddress,
                deposit: BigInt(0),
                assetDetail: undefined
            };
        }
        asset.assetDetail = data.assetDetail;
        this.serviceCacheRepository.setServiceAsset(info.servicePrincipal, asset);
    }

    getLocalCacheData(
        info: ServiceAssetDetailsInfo
    ): Promise<ServiceAssetDetailsResult | undefined> {

        let result: ServiceAssetDetailsResult | undefined = undefined;

        const serviceAsset = this.serviceCacheRepository.getServiceAsset(
            info.servicePrincipal,
            info.ledgerAddress
        );
        if (serviceAsset && serviceAsset.assetDetail) {
            result = {
                assetDetail: serviceAsset.assetDetail,
            };
        }
        return Promise.resolve(result);
    }
}
