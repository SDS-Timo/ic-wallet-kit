import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplCacheDataInfo } from "@hpl/forms";
import { DictionaryActorWrapper } from "@hpl/hplWrappers";
import { HplDictionaryCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplDictionaryCacheDataHandler/hplDictionaryCacheDataHandler";
import { HplDictionaryCacheRepository } from "@hpl/repositories";
import { HplDictionaryDataCacheModel } from "@hpl/types";
import { CacheDataError, LoadType } from "@ic-wallet-kit/common";

describe("Unit HplAccountsStateCacheDataHandler tests", () => {

    const cacheRepository = new (<new () => HplDictionaryCacheRepository><unknown>HplDictionaryCacheRepository)() as jest.Mocked<HplDictionaryCacheRepository>;
    const logger = new MockLogger();
    const identifierService = seedToIdentifierService("a");
    const hplDictionaryCacheDataHandler = new HplDictionaryCacheDataHandler(logger, identifierService, cacheRepository, mockCanisterService);

    const data: HplDictionaryDataCacheModel = {
        assetsDictionary: [
            {
                assetId: 1n,
                creationTime: 0n,
                modificationTime: 0n,
                logo: "mock-logo",
                name: "mock-name",
                symbol: "mock-symbol"
            }
        ]
    };


    it("HplDictionaryCacheDataHandler getLoadForceType", async () => {
        jest.restoreAllMocks();
        await hplDictionaryCacheDataHandler.validate({} as HplCacheDataInfo)
        const result = await hplDictionaryCacheDataHandler.getLoadForceType();
        expect(result).toEqual([LoadType.Full]);
    });

    it("HplDictionaryCacheDataHandler getLocalCacheData", async () => {
        jest.restoreAllMocks();

        cacheRepository.getHplDictionaryByCanisterId = jest.fn().mockReturnValue(data);

        const result = await hplDictionaryCacheDataHandler.getLocalCacheData({} as HplCacheDataInfo);

        expect(result).toEqual(data);

    });

    it("HplDictionaryCacheDataHandler getExternalData", async () => {
        jest.restoreAllMocks();

        const dictionaryActorWrapper = new (<new () => DictionaryActorWrapper><unknown>DictionaryActorWrapper)() as jest.Mocked<DictionaryActorWrapper>;

        dictionaryActorWrapper.allTokens = jest.fn().mockReturnValue(Promise.resolve(data.assetsDictionary));

        DictionaryActorWrapper.create = jest.fn().mockReturnValue(dictionaryActorWrapper);

        const result = await hplDictionaryCacheDataHandler.getExternalData({} as HplCacheDataInfo);

        expect(result).toEqual(data);

    });

    it("HplDictionaryCacheDataHandler getExternalData, logError", async () => {
        jest.restoreAllMocks();

        const dictionaryActorWrapper = new (<new () => DictionaryActorWrapper><unknown>DictionaryActorWrapper)() as jest.Mocked<DictionaryActorWrapper>;

        dictionaryActorWrapper.allTokens = jest.fn().mockRejectedValue("Test Error");

        DictionaryActorWrapper.create = jest.fn().mockReturnValue(dictionaryActorWrapper);

        const result = await hplDictionaryCacheDataHandler.getExternalData({} as HplCacheDataInfo);

        expect(result).toEqual({ assetsDictionary: [] });

    });

    it("HplDictionaryCacheDataHandler updateField", async () => {
        jest.restoreAllMocks();

        let result: HplDictionaryDataCacheModel = {} as HplDictionaryDataCacheModel;

        cacheRepository.getHplDictionaryByCanisterId = jest.fn().mockReturnValue(null);
        cacheRepository.setHplDictionary = jest.fn().mockImplementation((canisterId, hplDictionary) => { result = hplDictionary; })

        await hplDictionaryCacheDataHandler.updateField({} as HplCacheDataInfo, data);

        expect(result).toEqual(data);

    });


    it("HplDictionaryCacheDataHandler getCacheDataError", async () => {
        jest.restoreAllMocks();

        const data = new CacheDataError(
            "dictionary.unavailable",
            "Dictionary unavailable"
        );

        const result = hplDictionaryCacheDataHandler.getCacheDataError({} as HplCacheDataInfo);

        expect(result).toEqual(data);

    });


    it("HplDictionaryCacheDataHandler processError", async () => {
        jest.restoreAllMocks();

        const result = hplDictionaryCacheDataHandler.processError({});

        expect(result).toEqual([]);

    });

})