import { HplOwnerCacheDataInfo } from "@hpl/forms";
import { OwnersActorWrapper } from "@hpl/hplWrappers";
import { IHplOwnerCacheRepository } from "@hpl/repositories/cache/hplOwnerCacheRepository/hplOwnerCacheRepository";
import { CanisterService } from "@hpl/service/canisterService";
import { HplOwnerDataCacheModel } from "@hpl/types/cache/hplOwnerDataCacheModel";
import { BaseCacheDataHandler, CacheDataError, IdentifierService, ILogger, LoadType } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class HplOwnerCacheDataHandler extends BaseCacheDataHandler<HplOwnerCacheDataInfo, HplOwnerDataCacheModel> {
    getLoadForceType(): LoadType[] {
        return [LoadType.Full];
    }

    private hplOwnerCacheRepository: IHplOwnerCacheRepository;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        @Inject("IHplOwnerCacheRepository")
        hplOwnerCacheRepository: IHplOwnerCacheRepository,
        private canisterService: CanisterService
    ) {
        super(logger);
        this.hplOwnerCacheRepository = hplOwnerCacheRepository;
    }

    async validate(info: HplOwnerCacheDataInfo): Promise<void> { }

    // eslint-disable-next-line require-await
    async getLocalCacheData(info: HplOwnerCacheDataInfo): Promise<HplOwnerDataCacheModel | undefined> {
        const hplDictionary = this.hplOwnerCacheRepository.getHplOwnerByCanisterId(this.canisterService.getOwnerCanisterId());
        return hplDictionary;
    }

    async getExternalData(info: HplOwnerCacheDataInfo): Promise<HplOwnerDataCacheModel> {
        const ownersActorWrapper = OwnersActorWrapper.create(
            this.identifierService.getAgent(),
            this.canisterService.getOwnerCanisterId()
        );

        let result: HplOwnerDataCacheModel = {
            ownerId: undefined
        };

        try {
            const ownerId = await ownersActorWrapper.lookup(info.principal);
            result.ownerId = ownerId[0]
        }
        catch (e) {
            this.logger.logError(e)
        }
        return result;
    }

    updateField(info: HplOwnerCacheDataInfo, data: HplOwnerDataCacheModel): void {
        let hplOwner = this.hplOwnerCacheRepository.getHplOwnerByCanisterId(this.canisterService.getOwnerCanisterId());
        if (!hplOwner) {
            hplOwner = {
                ownerId: undefined
            };
        }
        hplOwner.ownerId = data.ownerId;
        this.hplOwnerCacheRepository.setHplOwner(this.canisterService.getOwnerCanisterId(), hplOwner);
    }

    getCacheDataError(info: HplOwnerCacheDataInfo): CacheDataError {
        return new CacheDataError(
            "owner.unavailable",
            "Owner unavailable"
        );
    }


}