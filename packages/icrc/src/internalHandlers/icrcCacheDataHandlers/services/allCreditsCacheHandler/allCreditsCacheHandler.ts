import { BaseCacheDataHandler, CacheDataError, IInfo, ILogger, IdentifierService, LoadType } from "@ic-wallet-middleware/common";
import { IcrcCacheMetadataErrorKey, IcrcCacheMetadataErrorMessage } from "@icrc/errors/cacheErrorMessages";
import { ServiceLocalCache } from "@icrc/repositories";
import { LocalCacheCreditModel } from "@icrc/types/services/localCacheCreditModel";
import { Icrc84ActorWrapper } from "@icrc/wrappers";
import "reflect-metadata";
import { Inject, Service } from "typedi";



export interface AllCreditsInfo extends IInfo {
    servicePrincipal: string;
}
export interface AllCreditsResult {
    credits: LocalCacheCreditModel[];
}

@Service()
export class AllCreditsCacheHandler extends BaseCacheDataHandler<
    AllCreditsInfo,
    AllCreditsResult
> {
    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private serviceCacheRepository: ServiceLocalCache
    ) {
        super(logger);
    }

    async validate(info: AllCreditsInfo): Promise<void> { }

    getLoadForceType(): LoadType[] {
        return [LoadType.Full, LoadType.Quick];
    }

    async getExternalData(info: AllCreditsInfo): Promise<AllCreditsResult> {
        const icrc84ActorWrapper = Icrc84ActorWrapper.create(
            this.identifierService.getAgent(),
            info.servicePrincipal,
        );
        const credits = await icrc84ActorWrapper.getAllCredits();

        const result = {
            credits: credits
        };

        return result;
    }

    updateField(info: AllCreditsInfo, data: AllCreditsResult): void {
        let credits = this.serviceCacheRepository.getAllCredits(info.servicePrincipal);
        if (!credits) {
            credits = [];
        }
        credits = data.credits
        this.serviceCacheRepository.setCredits(info.servicePrincipal, credits);
    }

    getLocalCacheData(
        info: AllCreditsInfo
    ): Promise<AllCreditsResult | undefined> {

        let result: AllCreditsResult | undefined = undefined;

        const credits = this.serviceCacheRepository.getAllCredits(info.servicePrincipal);
        if (credits) {
            result = {
                credits: credits
            };
        }

        return Promise.resolve(result);
    }

    getCacheDataError(info: AllCreditsInfo): CacheDataError {
        return new CacheDataError(
            IcrcCacheMetadataErrorKey,
            IcrcCacheMetadataErrorMessage
        );
    }


}
