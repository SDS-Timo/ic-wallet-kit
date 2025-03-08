import { HplStateCacheDataInfo } from "@hpl/forms/hplStateCacheDataInfo";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { IHplStateCacheRepository } from "@hpl/repositories/cache/hplStateCacheRepository/hplStateCacheRepository";
import { CanisterService } from "@hpl/service/canisterService";
import { HplStateRemoteAccountsCacheModel } from "@hpl/types";
import { BaseCacheDataHandler, CacheDataError, IdentifierService, ILogger, LoadType } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class HplRemoteAccountsStateCacheDataHandler extends BaseCacheDataHandler<HplStateCacheDataInfo, HplStateRemoteAccountsCacheModel[]> {
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
    async getLocalCacheData(info: HplStateCacheDataInfo): Promise<HplStateRemoteAccountsCacheModel[] | undefined> {
        const hplState = this.hplStateCacheRepository.getHplRemoteAccountState(this.canisterService.getLedgerCanisterId());
        return hplState;
    }

    async getExternalData(info: HplStateCacheDataInfo): Promise<HplStateRemoteAccountsCacheModel[]> {
        const ingressActorWrapper = IngressActorWrapper.create(
            this.identifierService.getAgent(),
            this.canisterService.getLedgerCanisterId(),
            this.logger
        );

        let result: HplStateRemoteAccountsCacheModel[] = []

        try {
            const state = await ingressActorWrapper.getState(
                info.virtualAccountCount,
                info.ftAssetCount,
                info.accountCount,
                info.remoteAccounts
            );
            result = state.remoteAccounts
        }
        catch (e) {
            this.logger.logError(e)
        }
        return result;
    }

    updateField(info: HplStateCacheDataInfo, data: HplStateRemoteAccountsCacheModel[]): void {
        let hplState = this.hplStateCacheRepository.getHplRemoteAccountState(this.canisterService.getLedgerCanisterId());
        if (!hplState) {
            hplState = [];
        }
        for (let model of data) {
            let item = hplState.find((s) => s.remoteAccountId == model.remoteAccountId);
            if (!item) {
                item = {
                    remoteAccountId: model.remoteAccountId,
                    accountState: model.accountState,
                    remotePrincipal: model.remotePrincipal,
                    time: model.time
                }
                hplState.push(item);
            }
            else {
                item.accountState = model.accountState;
                item.time = model.time;
            }
        }

        this.hplStateCacheRepository.setHplRemoteAccountState(this.canisterService.getLedgerCanisterId(), hplState);
    }

    getCacheDataError(info: HplStateCacheDataInfo): CacheDataError {
        return new CacheDataError(
            "state.unavailable",
            "State unavailable"
        );
    }


}