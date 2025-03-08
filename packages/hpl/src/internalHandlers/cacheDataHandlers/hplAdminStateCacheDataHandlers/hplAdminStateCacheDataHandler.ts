import { HplStateCacheDataInfo } from "@hpl/forms/hplStateCacheDataInfo";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { IHplStateCacheRepository } from "@hpl/repositories/cache/hplStateCacheRepository/hplStateCacheRepository";
import { CanisterService } from "@hpl/service/canisterService";
import { HplStateCacheModel } from "@hpl/types/cache/hplStateCacheModel";
import { BaseCacheDataHandler, CacheDataError, IdentifierService, ILogger, LoadType } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";


@Service()
export class HplAdminStateCacheDataHandler extends BaseCacheDataHandler<HplStateCacheDataInfo, HplStateCacheModel> {

    private hplStateCacheRepository: IHplStateCacheRepository;

    getLoadForceType(): LoadType[] {
        return [LoadType.Full];
    }

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
    async getLocalCacheData(info: HplStateCacheDataInfo): Promise<HplStateCacheModel | undefined> {
        const hplState = this.hplStateCacheRepository.getHplAdminState(this.canisterService.getLedgerCanisterId());
        return hplState;
    }

    async getExternalData(info: HplStateCacheDataInfo): Promise<HplStateCacheModel> {
        const ingressActorWrapper = IngressActorWrapper.create(
            this.identifierService.getAgent(),
            this.canisterService.getLedgerCanisterId(),
            this.logger
        );

        let result: HplStateCacheModel = {
            accounts: [],
            ftSupplies: [],
            virtualAccounts: [],
            remoteAccounts: []
        };

        try {
            result = await ingressActorWrapper.getAdminState();
        }
        catch (e) {
            this.logger.logError(e)
        }
        return result;
    }

    updateField(info: HplStateCacheDataInfo, data: HplStateCacheModel): void {
        let hplState = this.hplStateCacheRepository.getHplAdminState(this.canisterService.getLedgerCanisterId());
        if (!hplState) {
            hplState = {
                ftSupplies: [],
                accounts: [],
                virtualAccounts: [],
                remoteAccounts: []
            };
        }
        hplState.ftSupplies = data.ftSupplies;
        hplState.accounts = data.accounts;
        hplState.virtualAccounts = data.virtualAccounts;
        hplState.remoteAccounts = data.remoteAccounts;
        this.hplStateCacheRepository.setHplAdminState(this.canisterService.getLedgerCanisterId(), hplState);
    }

    getCacheDataError(info: HplStateCacheDataInfo): CacheDataError {
        return new CacheDataError(
            "state.unavailable",
            "State unavailable"
        );
    }


}