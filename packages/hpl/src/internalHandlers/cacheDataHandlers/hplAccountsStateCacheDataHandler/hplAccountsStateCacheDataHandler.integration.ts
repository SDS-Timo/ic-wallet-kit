import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplStateCacheDataInfo } from "@hpl/forms";
import { HplAccountsStateCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplAccountsStateCacheDataHandler/hplAccountsStateCacheDataHandler";
import { HplStateCacheRepository } from "@hpl/repositories";
import { HplStateAccountsCacheModel } from "@hpl/types";
import { FormResult, LoadType } from "@ic-wallet-middleware/common";


describe("Unit HplAccountsStateCacheDataHandler tests", () => {
    const testData = [
        {
            name: "get accounts state from canister",
            input: {
                accountCount: BigInt(0),
                ftAssetCount: BigInt(0),
                virtualAccountCount: BigInt(0),
                remoteAccounts: [],
                loadType: LoadType.Full
            } as HplStateCacheDataInfo,
            data: {
                cacheData: undefined,
            },
            result: FormResult.success([])
        },
        {
            name: "get accounts state from cache",
            input: {
                accountCount: BigInt(0),
                ftAssetCount: BigInt(0),
                virtualAccountCount: BigInt(0),
                remoteAccounts: [],
                loadType: LoadType.Cache
            } as HplStateCacheDataInfo,
            data: {
                cacheData: [{
                    accountId: BigInt(0),
                    accountState: {
                        ft: BigInt(2),
                    },
                }] as HplStateAccountsCacheModel[],
            },
            result: FormResult.success([{
                accountId: BigInt(0),
                accountState: {
                    ft: BigInt(2),
                },
            }] as HplStateAccountsCacheModel[])
        },
        {
            name: "get accounts state from cache, cache is empty",
            input: {
                accountCount: BigInt(0),
                ftAssetCount: BigInt(0),
                virtualAccountCount: BigInt(0),
                remoteAccounts: [],
                loadType: LoadType.Cache
            } as HplStateCacheDataInfo,
            data: {
                cacheData: undefined,
            },
            result: FormResult.success([] as HplStateAccountsCacheModel[])
        }
    ]

    for (let test of testData) {
        it(test.name, async () => {
            jest.restoreAllMocks();

            const identifierService = seedToIdentifierService("supperTest32412");
            const logger = new MockLogger();

            const cacheRepository = new (<new () => HplStateCacheRepository><unknown>HplStateCacheRepository)() as jest.Mocked<HplStateCacheRepository>;

            //const cacheRepository = new HplStateCacheRepository(logger, identifierService, new {});

            cacheRepository["identifierService"] = identifierService;

            cacheRepository.getHplAccountState = jest.fn().mockReturnValue(test.data.cacheData);
            cacheRepository.setHplAccountState = jest.fn().mockImplementation(() => { });

            const hplAccountCacheDataHandler = new HplAccountsStateCacheDataHandler(logger, identifierService, cacheRepository, mockCanisterService);
            const result = await hplAccountCacheDataHandler.handle(test.input);

            expect(result).toEqual(test.result);
        }, 10000);
    }

})