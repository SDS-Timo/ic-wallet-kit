import { HplVirtualAccountStateCacheDataInfo } from "@hpl/forms/virtualAccounts/hplVirtualAccountStateCacheDataInfo";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { IHplStateCacheRepository } from "@hpl/repositories/cache/hplStateCacheRepository/hplStateCacheRepository";
import { CanisterService } from "@hpl/service/canisterService";
import { HplStateVirtualAccountsCacheModel } from "@hpl/types/cache/hplStateVirtualAccountsCacheModel";
import { BaseCacheDataHandler, CacheDataError, IdentifierService, ILogger, LoadType } from "@ic-wallet-kit/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class HplVirtualAccountStateCacheDataHandler extends BaseCacheDataHandler<HplVirtualAccountStateCacheDataInfo, HplStateVirtualAccountsCacheModel> {
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

    async validate(info: HplVirtualAccountStateCacheDataInfo): Promise<void> { }

    // eslint-disable-next-line require-await
    async getLocalCacheData(info: HplVirtualAccountStateCacheDataInfo): Promise<HplStateVirtualAccountsCacheModel | undefined> {
        const hplState = this.hplStateCacheRepository.getHplVirtualAccountState(this.canisterService.getLedgerCanisterId());
        if (hplState) {
            return hplState.find((va) => va.virtualAccountId === info.virtualAccountId);
        }
        return undefined;
    }

    async getExternalData(info: HplVirtualAccountStateCacheDataInfo): Promise<HplStateVirtualAccountsCacheModel> {
        const ingressActorWrapper = IngressActorWrapper.create(
            this.identifierService.getAgent(),
            this.canisterService.getLedgerCanisterId(),
            this.logger
        );
        const result = await ingressActorWrapper.getVirtualAccountState(
            info.virtualAccountId,
        );
        return result;
    }

    updateField(info: HplVirtualAccountStateCacheDataInfo, data: HplStateVirtualAccountsCacheModel): void {
        let hplState = this.hplStateCacheRepository.getHplVirtualAccountState(this.canisterService.getLedgerCanisterId());
        if (!hplState) {
            hplState = [];
        }
        const virtualAccount = hplState.find((va) => va.virtualAccountId === info.virtualAccountId);
        if (virtualAccount) {
            virtualAccount.accountId = data.accountId;
            virtualAccount.accountState = data.accountState;
            virtualAccount.time = data.time;
        }
        else {
            hplState.push(data);
        }
        this.hplStateCacheRepository.setHplVirtualAccountState(this.canisterService.getLedgerCanisterId(), hplState);
    }

    getCacheDataError(info: HplVirtualAccountStateCacheDataInfo): CacheDataError {
        return new CacheDataError(
            "state.unavailable",
            "State unavailable"
        );
    }


}