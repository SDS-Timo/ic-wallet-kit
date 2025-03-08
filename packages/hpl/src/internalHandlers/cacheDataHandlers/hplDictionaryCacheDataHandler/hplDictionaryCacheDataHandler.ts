import { HplCacheDataInfo } from "@hpl/forms/hplCacheDataInfo";
import { DictionaryActorWrapper } from "@hpl/hplWrappers";
import { IHplDictionaryCacheRepository } from "@hpl/repositories/cache/hplDictionaryCacheRepository/hplDictionaryCacheRepository";
import { CanisterService } from "@hpl/service/canisterService";
import { HplDictionaryDataCacheModel } from "@hpl/types/cache/hplDictionaryDataCacheModel";
import { BaseCacheDataHandler, CacheDataError, IdentifierService, ILogger, LoadType } from "@ic-wallet-middleware/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service()
export class HplDictionaryCacheDataHandler extends BaseCacheDataHandler<HplCacheDataInfo, HplDictionaryDataCacheModel> {
    getLoadForceType(): LoadType[] {
        return [LoadType.Full];
    }

    private hplDictionaryCacheRepository: IHplDictionaryCacheRepository;

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        private identifierService: IdentifierService,
        @Inject("IHplDictionaryCacheRepository")
        hplDictionaryCacheRepository: IHplDictionaryCacheRepository,
        private canisterService: CanisterService
    ) {
        super(logger);
        this.hplDictionaryCacheRepository = hplDictionaryCacheRepository;
    }

    async validate(info: HplCacheDataInfo): Promise<void> { }

    // eslint-disable-next-line require-await
    async getLocalCacheData(info: HplCacheDataInfo): Promise<HplDictionaryDataCacheModel | undefined> {
        const hplDictionary = this.hplDictionaryCacheRepository.getHplDictionaryByCanisterId(this.canisterService.getDictionaryCanisterId());
        return hplDictionary;
    }

    async getExternalData(info: HplCacheDataInfo): Promise<HplDictionaryDataCacheModel> {
        const dictionaryActorWrapper = DictionaryActorWrapper.create(
            this.identifierService.getAgent(),
            this.canisterService.getDictionaryCanisterId()
        );

        let result: HplDictionaryDataCacheModel = {
            assetsDictionary: []
        };

        try {
            result.assetsDictionary = await dictionaryActorWrapper.allTokens();
        }
        catch (e) {
            this.logger.logError(e)
        }
        return result;
    }

    updateField(info: HplCacheDataInfo, data: HplDictionaryDataCacheModel): void {
        let hplDictionary = this.hplDictionaryCacheRepository.getHplDictionaryByCanisterId(this.canisterService.getDictionaryCanisterId());
        if (!hplDictionary) {
            hplDictionary = {
                assetsDictionary: []
            };
        }
        hplDictionary.assetsDictionary = data.assetsDictionary;
        this.hplDictionaryCacheRepository.setHplDictionary(this.canisterService.getDictionaryCanisterId(), hplDictionary);
    }

    getCacheDataError(info: HplCacheDataInfo): CacheDataError {
        return new CacheDataError(
            "dictionary.unavailable",
            "Dictionary unavailable"
        );
    }


}