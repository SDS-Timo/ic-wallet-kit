import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplStateCacheDataInfo } from "@hpl/forms";
import { HplVirtualAccountsStateCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplVirtualAccountsStateCacheDataHandler/hplVirtualAccountsStateCacheDataHandler";
import { HplStateCacheRepository } from "@hpl/repositories";
import { HplStateVirtualAccountsCacheModel } from "@hpl/types";
import { FormResult, LoadType } from "@ic-wallet-middleware/common";

describe("Unit HplVirtualAccountsStateCacheDataHandler tests", () => {
    const testData = [
        {
            name: "get accounts state from canister",
            input: {
                accountCount: BigInt(0),
                ftAssetCount: BigInt(0),
                virtualAccountCount: BigInt(1),
                remoteAccounts: [],
                loadType: LoadType.Full
            } as HplStateCacheDataInfo,
            data: {
                cacheData: undefined,
                service: [
                    {
                        accountId: BigInt(2),
                        accountState: {
                            ft: BigInt(2),
                        },
                        time: BigInt(2),
                        virtualAccountId: BigInt(2),
                    }
                ]
            },
            result: FormResult.success([
                {
                    accountId: BigInt(2),
                    accountState: {
                        ft: BigInt(2),
                    },
                    time: BigInt(2),
                    virtualAccountId: BigInt(2),
                }
            ] as HplStateVirtualAccountsCacheModel[])
        },
        {
            name: "get accounts state from cache",
            input: {
                accountCount: BigInt(0),
                ftAssetCount: BigInt(0),
                virtualAccountCount: BigInt(1),
                remoteAccounts: [],
                loadType: LoadType.Cache
            } as HplStateCacheDataInfo,
            data: {
                cacheData: [{
                    accountId: BigInt(0),
                    accountState: {
                        ft: BigInt(0),
                    },
                    time: BigInt(0),
                    virtualAccountId: BigInt(0),
                }] as HplStateVirtualAccountsCacheModel[],
            },
            result: FormResult.success([
                {
                    accountId: BigInt(0),
                    accountState: {
                        ft: BigInt(0),
                    },
                    time: BigInt(0),
                    virtualAccountId: BigInt(0),
                }
            ] as HplStateVirtualAccountsCacheModel[])
        },
        {
            name: "get accounts state from cache, cache is empty",
            input: {
                accountCount: BigInt(0),
                ftAssetCount: BigInt(0),
                virtualAccountCount: BigInt(1),
                remoteAccounts: [],
                loadType: LoadType.Cache
            } as HplStateCacheDataInfo,
            data: {
                cacheData: undefined,
                service: [
                    {
                        accountId: BigInt(5),
                        accountState: {
                            ft: BigInt(5),
                        },
                        time: BigInt(5),
                        virtualAccountId: BigInt(5),
                    }
                ]
            },
            result: FormResult.success([
                {
                    accountId: BigInt(5),
                    accountState: {
                        ft: BigInt(5),
                    },
                    time: BigInt(5),
                    virtualAccountId: BigInt(5),
                }
            ] as HplStateVirtualAccountsCacheModel[])
        }
    ]

    for (let test of testData) {
        it(test.name, async () => {
            jest.restoreAllMocks();

            const identifierService = seedToIdentifierService("testUnitHplVirtual".toLocaleLowerCase());

            const cacheRepository = new (<new () => HplStateCacheRepository><unknown>HplStateCacheRepository)() as jest.Mocked<HplStateCacheRepository>;
            cacheRepository.getHplVirtualAccountState = jest.fn().mockReturnValue(test.data.cacheData);

            cacheRepository.setHplVirtualAccountState = jest.fn().mockImplementation(() => { });

            const logger = new MockLogger();
            const hplVirtualAccountsStateCacheDataHandler = new HplVirtualAccountsStateCacheDataHandler(logger, identifierService, cacheRepository, mockCanisterService);

            hplVirtualAccountsStateCacheDataHandler.getExternalData = jest.fn().mockReturnValue(test.data.service);

            const result = await hplVirtualAccountsStateCacheDataHandler.handle(test.input);
            expect(result).toEqual(test.result);
        }, 10000);
    }

})