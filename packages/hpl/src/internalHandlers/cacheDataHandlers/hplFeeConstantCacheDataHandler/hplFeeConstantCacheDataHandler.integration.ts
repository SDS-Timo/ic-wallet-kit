import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { phraseToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplFeeConstantCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplFeeConstantCacheDataHandler/hplFeeConstantCacheDataHandler";
import { HplFeeConstantCacheRepository } from "@hpl/repositories";
import { LoadType } from "@ic-wallet-middleware/common";

describe("Unit HplFeeConstantCacheDataHandler tests", () => {
    const testData = [
        {
            name: "get feeConstant from canister",
            input: {
                loadType: LoadType.Full
            },
            data: {
                cacheData: BigInt(10000),
            },
            result: BigInt(50000)
        },
        {
            name: "get feeConstant from cache",
            input: {
                loadType: LoadType.Cache
            },
            data: {
                cacheData: BigInt(10000)
            },
            result: BigInt(10000)
        },
        {
            name: "get feeConstant from cache, cache is empty",
            input: {
                loadType: LoadType.Cache
            },
            data: {
                cacheData: undefined,
            },
            result: BigInt(50000)
        }
    ]

    for (let test of testData) {
        it(test.name, async () => {
            jest.restoreAllMocks();

            const identifierService = await phraseToIdentifierService("hair guilt comic still lesson helmet glare material avocado venue giggle essence");

            const cacheRepository = new (<new () => HplFeeConstantCacheRepository><unknown>HplFeeConstantCacheRepository)() as jest.Mocked<HplFeeConstantCacheRepository>;
            cacheRepository.getFeeConstantByCanisterId = jest.fn().mockReturnValue(test.data.cacheData);
            cacheRepository.setFeeConstant = jest.fn().mockReturnValue(undefined);
            const logger = new MockLogger();
            const hplOwnerCacheDataHandler = new HplFeeConstantCacheDataHandler(logger, identifierService, cacheRepository, mockCanisterService);
            const result = await hplOwnerCacheDataHandler.process(test.input);
            expect(result).toEqual(test.result);

        }, 10000);
    }

})