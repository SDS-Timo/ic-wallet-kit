import { HplMintCacheDataInfo } from "@hpl/forms/hplMintCacheDataInfo";
import { HplMintActorWrapper } from "@hpl/hplWrappers";
import { IHplMintCacheRepository } from "@hpl/repositories/cache/hplMintCacheRepository/hplMintCacheRepository";
import { HplMintCacheModel } from "@hpl/types/cache/hplMintCacheModel";
import { BaseCacheDataHandler, CacheDataError, IdentifierService, ILogger, LoadType } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";


@Service()
export class HplMintCacheDataHandler extends BaseCacheDataHandler<HplMintCacheDataInfo, HplMintCacheModel> {
    getLoadForceType(): LoadType[] {
        return [LoadType.Full];
    }

    private hplMintCacheRepository: IHplMintCacheRepository;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        @Inject("IHplMintCacheRepository")
        hplMintCacheRepository: IHplMintCacheRepository
    ) {
        super(logger);
        this.hplMintCacheRepository = hplMintCacheRepository;
    }

    async validate(info: HplMintCacheDataInfo): Promise<void> { }

    // eslint-disable-next-line require-await
    async getLocalCacheData(info: HplMintCacheDataInfo): Promise<HplMintCacheModel | undefined> {
        const hplDictionary = this.hplMintCacheRepository.getHplMintByCanisterId(info.canisterId);
        return hplDictionary;
    }

    async getExternalData(info: HplMintCacheDataInfo): Promise<HplMintCacheModel> {
        const agent = await this.identifierService.getAnonymousAgent();

        const hplMintActorWrapper = HplMintActorWrapper.create(
            agent,
            info.canisterId
        );
        let result: HplMintCacheModel = {
            canisterId: info.canisterId,
            isMinter: false
        };

        try {
            result.isMinter = await hplMintActorWrapper.isHplMinter();
        }
        catch (e) {
            this.logger.logError(e)
        }
        return result;
    }

    updateField(info: HplMintCacheDataInfo, data: HplMintCacheModel): void {
        let hplMint = this.hplMintCacheRepository.getHplMintByCanisterId(info.canisterId);
        if (!hplMint) {
            hplMint = {
                canisterId: info.canisterId,
                isMinter: false
            };
        }
        hplMint.isMinter = data.isMinter;
        this.hplMintCacheRepository.setHplMint(hplMint);
    }

    getCacheDataError(info: HplMintCacheDataInfo): CacheDataError {
        return new CacheDataError(
            "minter.unavailable",
            "Minter unavailable"
        );
    }


}