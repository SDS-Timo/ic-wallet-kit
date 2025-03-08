import { HplAccountsCacheDataResult } from "@hpl/forms/hplAccountsCacheDataResult";
import { HplCacheDataInfo } from "@hpl/forms/hplCacheDataInfo";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { IHplDataCacheRepository } from "@hpl/repositories/cache/hplDataCacheRepository/hplDataCacheRepository";
import { CanisterService } from "@hpl/service/canisterService";
import { BaseCacheDataHandler, CacheDataError, IdentifierService, ILogger, LoadType } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class HplAccountCacheDataHandler extends BaseCacheDataHandler<HplCacheDataInfo, HplAccountsCacheDataResult> {

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
    async getLocalCacheData(info: HplCacheDataInfo): Promise<HplAccountsCacheDataResult | undefined> {
        const hplAsset = this.hplDataCacheRepository.getHplDataByCanisterId(this.canisterService.getLedgerCanisterId());
        if (hplAsset && hplAsset.accounts) {
            return hplAsset.accounts;
        }

        return undefined;
    }

    async getExternalData(info: HplCacheDataInfo): Promise<HplAccountsCacheDataResult> {
        const ingressActorWrapper = IngressActorWrapper.create(
            this.identifierService.getAgent(),
            this.canisterService.getLedgerCanisterId(),
            this.logger
        );

        const result: HplAccountsCacheDataResult = {
            accountLastId: BigInt(0),
            accounts: []
        };

        try {
            result.accountLastId = await ingressActorWrapper.getAccounts();
        }
        catch (e) {
            this.logger.logError(e);
        }

        if (result.accountLastId !== BigInt(0)) {
            const accountInfo = await ingressActorWrapper.getAllAccountsInfo(result.accountLastId);
            result.accounts = accountInfo;
        }

        return result;
    }

    updateField(info: HplCacheDataInfo, data: HplAccountsCacheDataResult): void {
        let hplAsset = this.hplDataCacheRepository.getHplDataByCanisterId(this.canisterService.getLedgerCanisterId());
        if (!hplAsset) {
            hplAsset = {
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
        hplAsset.accounts = {
            accountLastId: data.accountLastId,
            accounts: data.accounts
        };
        this.hplDataCacheRepository.setHplData(this.canisterService.getLedgerCanisterId(), hplAsset);
    }

    getCacheDataError(info: HplCacheDataInfo): CacheDataError {
        return new CacheDataError(
            "accounts.unavailable",
            "Accounts unavailable"
        );
    }


}