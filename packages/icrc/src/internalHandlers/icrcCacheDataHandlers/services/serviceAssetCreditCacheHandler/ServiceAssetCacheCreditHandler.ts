import { BaseCacheDataHandler, CacheDataError, IInfo, ILogger, IdentifierService, LoadType } from "@ic-wallet-kit/common";
import { IcrcCacheMetadataErrorKey, IcrcCacheMetadataErrorMessage } from "@icrc/errors/cacheErrorMessages";
import { ServiceLocalCache } from "@icrc/repositories";
import { LocalCacheCreditModel } from "@icrc/types/services/localCacheCreditModel";
import { Icrc84ActorWrapper } from "@icrc/wrappers";
import "reflect-metadata";
import { Inject, Service } from "typedi";



export interface ServiceAssetCreditInfo extends IInfo {
    servicePrincipal: string;
    ledgerAddress: string;
}

@Service()
export class ServiceAssetCacheCreditHandler extends BaseCacheDataHandler<
    ServiceAssetCreditInfo,
    LocalCacheCreditModel
> {
    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private serviceCacheRepository: ServiceLocalCache
    ) {
        super(logger);
    }

    getCacheDataError(info: ServiceAssetCreditInfo): CacheDataError {
        return new CacheDataError(
            IcrcCacheMetadataErrorKey,
            IcrcCacheMetadataErrorMessage
        );
    }

    getLoadForceType(): LoadType[] {
        return [LoadType.Full, LoadType.Quick];
    }

    async validate(info: ServiceAssetCreditInfo): Promise<void> { }



    async getExternalData(info: ServiceAssetCreditInfo): Promise<LocalCacheCreditModel> {
        const icrc84ActorWrapper = Icrc84ActorWrapper.create(
            this.identifierService.getAgent(),
            info.servicePrincipal,
        );
        const credit = await icrc84ActorWrapper.getCredit(info.ledgerAddress);
        const result = {
            ledgerAddress: info.ledgerAddress,
            credit: credit
        }

        return result;
    }

    updateField(info: ServiceAssetCreditInfo, data: LocalCacheCreditModel): void {
        let credits = this.serviceCacheRepository.getAllCredits(info.servicePrincipal);
        if (!credits) {
            credits = [];
        }
        const item = credits.find((c) => c.ledgerAddress === data.ledgerAddress)
        if (item) {
            item.credit = data.credit
        }
        else {
            credits.push(data)
        }
        this.serviceCacheRepository.setCredits(info.servicePrincipal, credits);
    }

    getLocalCacheData(
        info: ServiceAssetCreditInfo
    ): Promise<LocalCacheCreditModel | undefined> {
        const credits = this.serviceCacheRepository.getAllCredits(info.servicePrincipal);
        const result = credits?.find((c) => c.ledgerAddress === info.ledgerAddress);

        return Promise.resolve(result);
    }
}
