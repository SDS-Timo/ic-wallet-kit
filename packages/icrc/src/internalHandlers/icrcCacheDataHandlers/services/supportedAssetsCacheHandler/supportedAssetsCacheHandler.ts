import { BaseCacheDataHandler, CacheDataError, IInfo, ILogger, IdentifierService, LoadType, jsonStringify } from "@ic-wallet-kit/common";
import { IcrcCacheMetadataErrorKey, IcrcCacheMetadataErrorMessage } from "@icrc/errors/cacheErrorMessages";
import { ServiceLocalCache } from "@icrc/repositories";
import { Icrc84ActorWrapper } from "@icrc/wrappers";

import "reflect-metadata";
import { Inject, Service } from "typedi";



export interface SupportedAssetsInfo extends IInfo {
    servicePrincipal: string;
}
export interface SupportedAssetsResult {
    principals: string[];
}

@Service()
export class SupportedAssetsCacheHandler extends BaseCacheDataHandler<
    SupportedAssetsInfo,
    SupportedAssetsResult
> {
    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        private serviceCacheRepository: ServiceLocalCache
    ) {
        super(logger);
    }

    getCacheDataError(info: SupportedAssetsInfo): CacheDataError {
        return new CacheDataError(
            IcrcCacheMetadataErrorKey,
            IcrcCacheMetadataErrorMessage
        );
    }

    async validate(info: SupportedAssetsInfo): Promise<void> { }

    getLoadForceType(): LoadType[] {
        return [LoadType.Full];
    }



    async getExternalData(info: SupportedAssetsInfo): Promise<SupportedAssetsResult> {
        const icrc84ActorWrapper = Icrc84ActorWrapper.create(
            this.identifierService.getAgent(),
            info.servicePrincipal,
        );
        const supportedAssets = await icrc84ActorWrapper.getSupportedAssets();


        console.log(jsonStringify(supportedAssets));

        return {
            principals: supportedAssets.map((p) => p.toString()),
        }

    }

    updateField(info: SupportedAssetsInfo, data: SupportedAssetsResult): void {
        let service = this.serviceCacheRepository.getService(info.servicePrincipal);
        if (!service) {
            service = {
                servicePrincipal: info.servicePrincipal,
                assets: []
            }
        }
        const assets = service.assets.filter((as) => data.principals.includes(as.ledgerAddress));
        data.principals.forEach((item) => {
            if (!assets.some((as) => as.ledgerAddress === item)) {
                assets.push({
                    ledgerAddress: item,
                    assetDetail: undefined,
                    deposit: BigInt(0)
                })
            }
        });
        service.assets = assets
        this.serviceCacheRepository.setService(service);
    }

    async getLocalCacheData(
        info: SupportedAssetsInfo
    ): Promise<SupportedAssetsResult | undefined> {

        let result: SupportedAssetsResult | undefined = undefined;
        const service = this.serviceCacheRepository.getService(info.servicePrincipal);
        if (service) {
            result = {
                principals: service.assets.map((a) => a.ledgerAddress)
            };
        }
        return result;
    }
}
