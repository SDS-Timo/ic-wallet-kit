import { Principal } from "@dfinity/principal";
import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { phraseToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplOwnerCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplOwnerCacheDataHandler/hplOwnerCacheDataHandler";
import { HplOwnerCacheRepository } from "@hpl/repositories";
import { HplOwnerDataCacheModel } from "@hpl/types";
import { FormResult, LoadType } from "@ic-wallet-kit/common";

describe("Unit HplAccountCacheDataHandler tests", () => {
    const testData = [
        {
            name: "get accounts from canister",
            input: {
                principal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                loadType: LoadType.Full
            },
            data: {
                cacheData: undefined,
            },
            result: FormResult.success({
                ownerId: BigInt(42)
            } as HplOwnerDataCacheModel)
        },
        {
            name: "get accounts from cache",
            input: {
                principal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                loadType: LoadType.Cache
            },
            data: {
                cacheData: {
                    ownerId: BigInt(0)
                } as HplOwnerDataCacheModel
            },
            result: FormResult.success({
                ownerId: BigInt(0)
            } as HplOwnerDataCacheModel)
        },
        {
            name: "get accounts from cache, cache is empty",
            input: {
                principal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                loadType: LoadType.Cache
            },
            data: {
                cacheData: undefined,
            },
            result: FormResult.success({
                ownerId: BigInt(42)
            } as HplOwnerDataCacheModel)
        }
    ]

    for (let test of testData) {
        it(test.name, async () => {
            jest.restoreAllMocks();

            const identifierService = await phraseToIdentifierService("hair guilt comic still lesson helmet glare material avocado venue giggle essence");

            const cacheRepository = new (<new () => HplOwnerCacheRepository><unknown>HplOwnerCacheRepository)() as jest.Mocked<HplOwnerCacheRepository>;
            cacheRepository.getHplOwnerByCanisterId = jest.fn().mockReturnValue(test.data.cacheData);
            cacheRepository.setHplOwner = jest.fn().mockReturnValue(undefined);
            const logger = new MockLogger();
            const hplOwnerCacheDataHandler = new HplOwnerCacheDataHandler(logger, identifierService, cacheRepository, mockCanisterService);
            const result = await hplOwnerCacheDataHandler.handle(test.input);
            expect(result).toEqual(test.result);

        }, 10000);
    }

})