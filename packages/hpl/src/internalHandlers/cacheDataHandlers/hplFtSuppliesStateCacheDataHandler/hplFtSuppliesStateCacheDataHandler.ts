import { HplStateCacheDataInfo } from "@hpl/forms/hplStateCacheDataInfo";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { IHplStateCacheRepository } from "@hpl/repositories/cache/hplStateCacheRepository/hplStateCacheRepository";
import { CanisterService } from "@hpl/service/canisterService";
import { HplFtSuppliesCacheModel } from "@hpl/types/cache/hplFtSuppliesCacheModel";
import { BaseCacheDataHandler, CacheDataError, IdentifierService, ILogger, LoadType } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class HplFtSuppliesStateCacheDataHandler extends BaseCacheDataHandler<HplStateCacheDataInfo, HplFtSuppliesCacheModel[]> {
    getLoadForceType(): LoadType[] {
        return [LoadType.Full, LoadType.Quick];
    }

    private hplStateCacheRepository: IHplStateCacheRepository;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        @Inject("IHplStateCacheRepository")
        hplStateCacheRepository: IHplStateCacheRepository,
        private canisterService: CanisterService
    ) {
        super(logger);
        this.hplStateCacheRepository = hplStateCacheRepository;
    }

    async validate(info: HplStateCacheDataInfo): Promise<void> { }

    // eslint-disable-next-line require-await
    async getLocalCacheData(info: HplStateCacheDataInfo): Promise<HplFtSuppliesCacheModel[] | undefined> {
        const hplState = this.hplStateCacheRepository.getHplFtSuppliesState(this.canisterService.getLedgerCanisterId());
        return hplState;
    }

    async getExternalData(info: HplStateCacheDataInfo): Promise<HplFtSuppliesCacheModel[]> {
        const ingressActorWrapper = IngressActorWrapper.create(
            this.identifierService.getAgent(),
            this.canisterService.getLedgerCanisterId(),
            this.logger
        );

        let result: HplFtSuppliesCacheModel[] = [];

        try {
            const state = await ingressActorWrapper.getState(
                info.virtualAccountCount,
                info.ftAssetCount,
                info.accountCount,
                info.remoteAccounts
            );
            result = state.ftSupplies
        }
        catch (e) {
            this.logger.logError(e)
        }
        return result;
    }

    updateField(info: HplStateCacheDataInfo, data: HplFtSuppliesCacheModel[]): void {
        let hplState = this.hplStateCacheRepository.getHplFtSuppliesState(this.canisterService.getLedgerCanisterId());
        if (!hplState) {
            hplState = [];
        }
        hplState = data;
        this.hplStateCacheRepository.setHplFtSuppliesState(this.canisterService.getLedgerCanisterId(), hplState);
    }

    getCacheDataError(info: HplStateCacheDataInfo): CacheDataError {
        return new CacheDataError(
            "state.unavailable",
            "State unavailable"
        );
    }


}