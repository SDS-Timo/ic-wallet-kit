import { HplCacheDataInfo } from "@hpl/forms/hplCacheDataInfo";
import { HplVirtualAccountsCacheDataResult } from "@hpl/forms/virtualAccounts/hplVirtualAccountsCacheDataResult";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { IHplDataCacheRepository } from "@hpl/repositories/cache/hplDataCacheRepository/hplDataCacheRepository";
import { CanisterService } from "@hpl/service/canisterService";
import { BaseCacheDataHandler, CacheDataError, IdentifierService, ILogger, LoadType } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class HplVirtualAccountCacheDataHandler extends BaseCacheDataHandler<HplCacheDataInfo, HplVirtualAccountsCacheDataResult> {

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
    async getLocalCacheData(info: HplCacheDataInfo): Promise<HplVirtualAccountsCacheDataResult | undefined> {
        const hplAsset = this.hplDataCacheRepository.getHplDataByCanisterId(this.canisterService.getLedgerCanisterId());
        if (hplAsset && hplAsset.virtualAccounts) {
            return hplAsset.virtualAccounts;
        }
        return undefined;
    }

    async getExternalData(info: HplCacheDataInfo): Promise<HplVirtualAccountsCacheDataResult> {
        const ingressActorWrapper = IngressActorWrapper.create(
            this.identifierService.getAgent(),
            this.canisterService.getLedgerCanisterId(),
            this.logger
        );

        const result: HplVirtualAccountsCacheDataResult = {
            virtualAccountLastId: BigInt(0),
            virtualAccounts: []
        };

        try {
            result.virtualAccountLastId = await ingressActorWrapper.getVirtualAccounts();
        }
        catch (e) {
            throw new CacheDataError(
                "virtualAccount.getVirtualAccounts.unavailable",
                "getVirtualAccounts canister method unavailable"
            );
        }
        if (result.virtualAccountLastId !== BigInt(0)) {
            const virtualAccountInfo = await ingressActorWrapper.getAllVirtualAccountInfo(result.virtualAccountLastId);
            result.virtualAccounts = virtualAccountInfo;
        }

        return result;
    }

    updateField(info: HplCacheDataInfo, data: HplVirtualAccountsCacheDataResult): void {
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
        hplData.virtualAccounts = {
            virtualAccountLastId: data.virtualAccountLastId,
            virtualAccounts: data.virtualAccounts
        };
        this.hplDataCacheRepository.setHplData(this.canisterService.getLedgerCanisterId(), hplData);
    }
    getCacheDataError(info: HplCacheDataInfo): CacheDataError {
        return new CacheDataError(
            "virtualAccount.unavailable",
            "Virtual Account unavailable"
        );
    }

}