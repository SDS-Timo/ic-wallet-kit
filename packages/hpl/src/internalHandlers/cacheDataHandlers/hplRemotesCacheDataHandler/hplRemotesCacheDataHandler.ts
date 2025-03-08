
import { HplRemoteCacheDataInfo, HplRemotesCacheDataResult } from "@hpl/forms";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { IHplDataCacheRepository } from "@hpl/repositories/cache/hplDataCacheRepository/hplDataCacheRepository";
import { CanisterService } from "@hpl/service/canisterService";
import { BaseCacheDataHandler, CacheDataError, IdentifierService, ILogger, LoadType } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class HplRemotesCacheDataHandler extends BaseCacheDataHandler<HplRemoteCacheDataInfo, HplRemotesCacheDataResult> {
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


    async validate(info: HplRemoteCacheDataInfo): Promise<void> { }

    // eslint-disable-next-line require-await
    async getLocalCacheData(info: HplRemoteCacheDataInfo): Promise<HplRemotesCacheDataResult | undefined> {
        const hplData = this.hplDataCacheRepository.getHplDataByCanisterId(this.canisterService.getLedgerCanisterId());
        if (hplData && hplData.remotes) {
            return {
                remotes: hplData.remotes
            }
        }
        return undefined;
    }

    async getExternalData(info: HplRemoteCacheDataInfo): Promise<HplRemotesCacheDataResult> {
        const ingressActorWrapper = IngressActorWrapper.create(
            this.identifierService.getAgent(),
            this.canisterService.getLedgerCanisterId(),
            this.logger
        );

        const result: HplRemotesCacheDataResult = {
            remotes: []
        }

        try {
            const infoResult = await ingressActorWrapper.remoteAccountInfo({
                idRange: [info.principal, BigInt(0), []]
            });
            result.remotes = infoResult.map((rai) => {
                return {
                    remoteId: rai[0][0],
                    accountId: rai[0][1],
                    remoteInfo: rai[1]
                }
            });
        }
        catch (e) {
            this.logger.logError(e);
        }

        return result;
    }

    updateField(info: HplRemoteCacheDataInfo, data: HplRemotesCacheDataResult): void {
        let hplData = this.hplDataCacheRepository.getHplDataByCanisterId(this.canisterService.getLedgerCanisterId());
        if (!hplData) {
            hplData = {
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
        hplData.remotes = data.remotes
        this.hplDataCacheRepository.setHplData(this.canisterService.getLedgerCanisterId(), hplData);
    }
    getCacheDataError(info: HplRemoteCacheDataInfo): CacheDataError {
        return new CacheDataError(
            "remotes.unavailable",
            "Remotes unavailable"
        );
    }

}