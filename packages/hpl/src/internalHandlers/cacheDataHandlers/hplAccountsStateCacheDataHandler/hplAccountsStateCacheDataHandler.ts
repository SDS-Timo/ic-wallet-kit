import { HplStateCacheDataInfo } from "@hpl/forms/hplStateCacheDataInfo";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { IHplStateCacheRepository } from "@hpl/repositories/cache/hplStateCacheRepository/hplStateCacheRepository";
import { CanisterService } from "@hpl/service/canisterService";
import { HplStateAccountsCacheModel } from "@hpl/types/cache/hplStateAccountsCacheModel";
import { BaseCacheDataHandler, CacheDataError, IdentifierService, ILogger, LoadType } from "@ic-wallet-kit/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";
@Service()
export class HplAccountsStateCacheDataHandler extends BaseCacheDataHandler<HplStateCacheDataInfo, HplStateAccountsCacheModel[]> {
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
    async getLocalCacheData(info: HplStateCacheDataInfo): Promise<HplStateAccountsCacheModel[] | undefined> {
        const hplState = this.hplStateCacheRepository.getHplAccountState(this.canisterService.getLedgerCanisterId());
        return hplState;
    }

    async getExternalData(info: HplStateCacheDataInfo): Promise<HplStateAccountsCacheModel[]> {
        const ingressActorWrapper = IngressActorWrapper.create(
            this.identifierService.getAgent(),
            this.canisterService.getLedgerCanisterId(),
            this.logger
        );

        let result: HplStateAccountsCacheModel[] = []

        try {
            const state = await ingressActorWrapper.getState(
                info.virtualAccountCount,
                info.ftAssetCount,
                info.accountCount,
                info.remoteAccounts
            );
            result = state.accounts
        }
        catch (e) {
            this.logger.logError(e)
        }
        return result;
    }

    updateField(info: HplStateCacheDataInfo, data: HplStateAccountsCacheModel[]): void {
        let hplState = this.hplStateCacheRepository.getHplAccountState(this.canisterService.getLedgerCanisterId());
        if (!hplState) {
            hplState = [];
        }
        hplState = data;
        this.hplStateCacheRepository.setHplAccountState(this.canisterService.getLedgerCanisterId(), hplState);
    }

    getCacheDataError(info: HplStateCacheDataInfo): CacheDataError {
        return new CacheDataError(
            "state.unavailable",
            "State unavailable"
        );
    }


}