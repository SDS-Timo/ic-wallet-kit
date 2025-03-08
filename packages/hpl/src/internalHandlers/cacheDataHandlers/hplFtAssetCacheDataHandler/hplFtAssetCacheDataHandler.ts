import { HplCacheDataInfo } from "@hpl/forms/hplCacheDataInfo";
import { HplFtAssetsCacheDataResult } from "@hpl/forms/hplFtAssetsCacheDataResult";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { IHplDataCacheRepository } from "@hpl/repositories/cache/hplDataCacheRepository/hplDataCacheRepository";
import { CanisterService } from "@hpl/service/canisterService";
import { BaseCacheDataHandler, CacheDataError, IdentifierService, ILogger, LoadType } from "@ic-wallet-kit/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class HplFtAssetCacheDataHandler extends BaseCacheDataHandler<HplCacheDataInfo, HplFtAssetsCacheDataResult> {
    getLoadForceType(): LoadType[] {
        return [LoadType.Full];
    }
    private hplDataCacheRepository: IHplDataCacheRepository;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        @Inject("IHplDataCacheRepository")
        hplDataCacheRepository: IHplDataCacheRepository,
        private canisterService: CanisterService
    ) {
        super(logger);
        this.hplDataCacheRepository = hplDataCacheRepository;
    }


    async validate(info: HplCacheDataInfo): Promise<void> { }

    // eslint-disable-next-line require-await
    async getLocalCacheData(info: HplCacheDataInfo): Promise<HplFtAssetsCacheDataResult | undefined> {
        const hplAsset = this.hplDataCacheRepository.getHplDataByCanisterId(this.canisterService.getLedgerCanisterId());
        if (hplAsset && hplAsset.ftAssets) {
            return hplAsset.ftAssets;
        }
        return undefined;
    }

    async getExternalData(info: HplCacheDataInfo): Promise<HplFtAssetsCacheDataResult> {
        const ingressActorWrapper = IngressActorWrapper.create(
            this.identifierService.getAgent(),
            this.canisterService.getLedgerCanisterId(),
            this.logger
        );

        const result: HplFtAssetsCacheDataResult = {
            ftAssetLastId: BigInt(0),
            ftAssets: []
        };

        try {
            result.ftAssetLastId = await ingressActorWrapper.getFtAssets();
        }
        catch (e) {
            this.logger.logError(e);
        }

        if (result.ftAssetLastId !== BigInt(0)) {
            const ftAssetInfo = await ingressActorWrapper.getFtAssetInfo(result.ftAssetLastId);
            result.ftAssets = ftAssetInfo.map((fai) => {
                return {
                    assetId: fai.assetId,
                    ftAssetInfo: {
                        controller: fai.controller,
                        decimals: fai.decimals,
                        description: fai.description
                    }
                }
            });
        }

        return result;
    }

    updateField(info: HplCacheDataInfo, data: HplFtAssetsCacheDataResult): void {
        let hplAsset = this.hplDataCacheRepository.getHplDataByCanisterId(this.canisterService.getLedgerCanisterId());
        if (!hplAsset) {
            hplAsset = {
                accounts: {
                    accountLastId: BigInt(0),
                    accounts: []
                },
                virtualAccounts: {
                    virtualAccountLastId: BigInt(0),
                    virtualAccounts: []
                },
                ftAssets: {
                    ftAssetLastId: BigInt(0),
                    ftAssets: []
                },
                remotes: []
            };
        }
        hplAsset.ftAssets = {
            ftAssetLastId: data.ftAssetLastId,
            ftAssets: data.ftAssets
        };
        this.hplDataCacheRepository.setHplData(this.canisterService.getLedgerCanisterId(), hplAsset);
    }
    getCacheDataError(info: HplCacheDataInfo): CacheDataError {
        return new CacheDataError(
            "assets.unavailable",
            "Assets unavailable"
        );
    }

}