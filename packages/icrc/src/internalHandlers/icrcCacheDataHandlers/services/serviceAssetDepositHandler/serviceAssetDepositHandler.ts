import { BaseCacheDataHandler, CacheDataError, IInfo, ILogger, IdentifierService, LoadType } from "@ic-wallet-middleware/common";
import { IcrcCacheBalanceErrorKey, IcrcCacheBalanceErrorMessage } from "@icrc/errors/cacheErrorMessages";
import { ServiceLocalCache } from "@icrc/repositories";
import { Icrc84ActorWrapper } from "@icrc/wrappers";
import "reflect-metadata";
import { Inject, Service } from "typedi";


export interface ServiceAssetDepositInfo extends IInfo {
    servicePrincipal: string;
    ledgerAddress: string;
}
export interface ServiceAssetDepositResult {
    serviceAssetDeposit: bigint;
}

@Service()
export class ServiceAssetDepositHandler extends BaseCacheDataHandler<
    ServiceAssetDepositInfo,
    ServiceAssetDepositResult
> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private serviceCacheRepository: ServiceLocalCache
    ) {
        super(logger);
    }

    validate(info: ServiceAssetDepositInfo): Promise<void> {
        return Promise.resolve();
    }

    getCacheDataError(info: ServiceAssetDepositInfo): CacheDataError {
        return new CacheDataError(
            IcrcCacheBalanceErrorKey,
            IcrcCacheBalanceErrorMessage
        );
    }

    getLoadForceType(): LoadType[] {
        return [LoadType.Full, LoadType.Quick];
    }

    async getExternalData(info: ServiceAssetDepositInfo): Promise<ServiceAssetDepositResult> {
        const icrc84ActorWrapper = Icrc84ActorWrapper.create(
            this.identifierService.getAgent(),
            info.servicePrincipal,
        );

        const result: ServiceAssetDepositResult = {
            serviceAssetDeposit: BigInt(0)
        };

        try {
            const balance = await icrc84ActorWrapper.trackedDeposit(info.ledgerAddress);
            result.serviceAssetDeposit = balance;
        }
        catch (e) {
            this.logger.logError(e)
        }

        return result;
    }

    updateField(info: ServiceAssetDepositInfo, data: ServiceAssetDepositResult): void {
        let asset = this.serviceCacheRepository.getServiceAsset(info.servicePrincipal, info.ledgerAddress);
        if (!asset) {
            asset = {
                ledgerAddress: info.ledgerAddress,
                deposit: BigInt(0),
                assetDetail: undefined
            };
        }
        asset.deposit = data.serviceAssetDeposit;
        this.serviceCacheRepository.setServiceAsset(info.servicePrincipal, asset);
    }


    getLocalCacheData(
        info: ServiceAssetDepositInfo
    ): Promise<ServiceAssetDepositResult | undefined> {

        let result: ServiceAssetDepositResult | undefined = undefined;

        const serviceAsset = this.serviceCacheRepository.getServiceAsset(
            info.servicePrincipal,
            info.ledgerAddress
        );

        if (serviceAsset) {
            result = {
                serviceAssetDeposit: serviceAsset.deposit,
            };
        }
        return Promise.resolve(result);
    }
}
