import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplMintCacheDataInfo } from "@hpl/forms";
import { HplMintCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplMintCacheDataHandler/hplMintCacheDataHandler";
import { HplMintCacheRepository } from "@hpl/repositories";
import { HplMintCacheModel } from "@hpl/types";
import { FormResult, LoadType } from "@ic-wallet-kit/common";

describe("Unit HplAccountCacheDataHandler tests", () => {
    const testData = [
        {
            name: "get accounts from canister",
            input: {
                canisterId: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe",
                loadType: LoadType.Full
            } as HplMintCacheDataInfo,
            data: {
                cacheData: undefined,
            },
            result: FormResult.success({
                canisterId: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe",
                isMinter: false
            } as HplMintCacheModel)
        },
        {
            name: "get accounts from cache",
            input: {
                canisterId: "lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe",
                loadType: LoadType.Cache
            },
            data: {
                cacheData: {
                    canisterId: "lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe",
                    isMinter: false
                } as HplMintCacheModel
            },
            result: FormResult.success({
                canisterId: "lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe",
                isMinter: false
            } as HplMintCacheModel)
        },
        {
            name: "get accounts from cache, cache is empty",
            input: {
                canisterId: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe",
                loadType: LoadType.Cache
            },
            data: {
                cacheData: undefined,
            },
            result: FormResult.success({
                canisterId: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe",
                isMinter: false
            } as HplMintCacheModel)
        }
    ]

    for (let test of testData) {
        it(test.name, async () => {
            jest.restoreAllMocks();

            const identifierService = seedToIdentifierService("b");

            const cacheRepository = new (<new () => HplMintCacheRepository><unknown>HplMintCacheRepository)() as jest.Mocked<HplMintCacheRepository>;
            cacheRepository.getHplMintByCanisterId = jest.fn().mockReturnValue(test.data.cacheData);
            cacheRepository.setHplMint = jest.fn().mockReturnValue(undefined);
            const logger = new MockLogger();
            const mintStartTime = performance.now();
            const hplMintCacheDataHandler = new HplMintCacheDataHandler(logger, identifierService, cacheRepository);
            const result = await hplMintCacheDataHandler.handle(test.input);
            const mintEndTime = performance.now();
            console.log(`${test.name} Call to getExternalData took ${(mintEndTime - mintStartTime) / 1000} seconds`);
            expect(result).toEqual(test.result);

        }, 100000);
    }

})