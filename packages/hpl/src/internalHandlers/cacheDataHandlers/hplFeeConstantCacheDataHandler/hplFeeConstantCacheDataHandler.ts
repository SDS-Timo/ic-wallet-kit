import { HplFeeConstantCacheDataInfo } from "@hpl/forms";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { IHplFeeConstantCacheRepository } from "@hpl/repositories";
import { CanisterService } from "@hpl/service";
import { BaseCacheDataHandler, CacheDataError, IdentifierService, ILogger, LoadType } from "@ic-wallet-kit/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";


@Service()
export class HplFeeConstantCacheDataHandler extends BaseCacheDataHandler<HplFeeConstantCacheDataInfo, bigint> {
    getLoadForceType(): LoadType[] {
        return [LoadType.Full];
    }

    private hplFeeConstantCacheRepository: IHplFeeConstantCacheRepository;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        @Inject("IHplFeeConstantCacheRepository")
        hplFeeConstantCacheRepository: IHplFeeConstantCacheRepository,
        private canisterService: CanisterService
    ) {
        super(logger);
        this.hplFeeConstantCacheRepository = hplFeeConstantCacheRepository;
    }

    async validate(info: HplFeeConstantCacheDataInfo): Promise<void> { }

    // eslint-disable-next-line require-await
    async getLocalCacheData(info: HplFeeConstantCacheDataInfo): Promise<bigint | undefined> {
        const feeConstant = this.hplFeeConstantCacheRepository.getFeeConstantByCanisterId(this.canisterService.getLedgerCanisterId());
        return feeConstant;
    }

    async getExternalData(info: HplFeeConstantCacheDataInfo): Promise<bigint> {
        const ingressActorWrapper = IngressActorWrapper.create(
            this.identifierService.getAgent(),
            this.canisterService.getLedgerCanisterId(),
            this.logger
        );

        let feeConstant: bigint = BigInt(0);

        try {
            feeConstant = await ingressActorWrapper.feeRatio();
        }
        catch (e) {
            this.logger.logError(e)
        }
        return feeConstant;
    }

    updateField(info: HplFeeConstantCacheDataInfo, data: bigint): void {
        let feeConstant = this.hplFeeConstantCacheRepository.getFeeConstantByCanisterId(this.canisterService.getLedgerCanisterId());
        feeConstant = data;
        this.hplFeeConstantCacheRepository.setFeeConstant(this.canisterService.getLedgerCanisterId(), feeConstant);
    }

    getCacheDataError(info: HplFeeConstantCacheDataInfo): CacheDataError {
        return new CacheDataError(
            "fee.constant.unavailable",
            "Fee Constant unavailable"
        );
    }
}