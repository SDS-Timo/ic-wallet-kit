import { HplStateCacheDataInfo } from "@hpl/forms/hplStateCacheDataInfo";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { IHplStateCacheRepository } from "@hpl/repositories/cache/hplStateCacheRepository/hplStateCacheRepository";
import { CanisterService } from "@hpl/service/canisterService";
import { HplStateVirtualAccountsCacheModel } from "@hpl/types/cache/hplStateVirtualAccountsCacheModel";
import { BaseCacheDataHandler, CacheDataError, IdentifierService, ILogger, LoadType } from "@ic-wallet-kit/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class HplVirtualAccountsStateCacheDataHandler extends BaseCacheDataHandler<HplStateCacheDataInfo, HplStateVirtualAccountsCacheModel[]> {
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
    async getLocalCacheData(info: HplStateCacheDataInfo): Promise<HplStateVirtualAccountsCacheModel[] | undefined> {
        const hplState = this.hplStateCacheRepository.getHplVirtualAccountState(this.canisterService.getLedgerCanisterId());
        return hplState;
    }

    async getExternalData(info: HplStateCacheDataInfo): Promise<HplStateVirtualAccountsCacheModel[]> {
        const ingressActorWrapper = IngressActorWrapper.create(
            this.identifierService.getAgent(),
            this.canisterService.getLedgerCanisterId(),
            this.logger
        );

        let result: HplStateVirtualAccountsCacheModel[] = []

        try {
            const state = await ingressActorWrapper.getState(
                info.virtualAccountCount,
                info.ftAssetCount,
                info.accountCount,
                info.remoteAccounts
            );
            result = state.virtualAccounts;
        }
        catch (e) {
            this.logger.logError(e)
        }
        return result;
    }

    updateField(info: HplStateCacheDataInfo, data: HplStateVirtualAccountsCacheModel[]): void {
        let hplState = this.hplStateCacheRepository.getHplVirtualAccountState(this.canisterService.getLedgerCanisterId());
        if (!hplState) {
            hplState = [];
        }
        hplState = data;
        this.hplStateCacheRepository.setHplVirtualAccountState(this.canisterService.getLedgerCanisterId(), hplState);
    }

    getCacheDataError(info: HplStateCacheDataInfo): CacheDataError {
        return new CacheDataError(
            "state.unavailable",
            "State unavailable"
        );
    }


}