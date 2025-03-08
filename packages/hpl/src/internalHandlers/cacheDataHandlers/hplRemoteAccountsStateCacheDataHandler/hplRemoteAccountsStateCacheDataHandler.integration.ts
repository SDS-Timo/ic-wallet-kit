import { Principal } from "@dfinity/principal";
import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplStateCacheDataInfo } from "@hpl/forms";
import { HplRemoteAccountsStateCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplRemoteAccountsStateCacheDataHandler/hplRemoteAccountsStateCacheDataHandler";
import { HplStateCacheRepository } from "@hpl/repositories";
import { HplStateRemoteAccountsCacheModel } from "@hpl/types";
import { FormResult, LoadType } from "@ic-wallet-kit/common";


describe("Unit HplVirtualAccountsStateCacheDataHandler tests", () => {
    const testData = [
        {
            name: "get accounts state from canister",
            input: {
                accountCount: BigInt(0),
                ftAssetCount: BigInt(0),
                virtualAccountCount: BigInt(0),
                remoteAccounts: [{
                    idRange: [Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"), BigInt(0), []]
                }],
                loadType: LoadType.Full
            } as HplStateCacheDataInfo,
            data: {
                cacheData: undefined,
            },
            result: FormResult.success([])
        },
        {
            name: "get accounts state from canister force = true, update cache",
            input: {
                accountCount: BigInt(0),
                ftAssetCount: BigInt(0),
                virtualAccountCount: BigInt(0),
                remoteAccounts: [{
                    idRange: [Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"), BigInt(0), []]
                }],
                loadType: LoadType.Full
            } as HplStateCacheDataInfo,
            data: {
                cacheData: [{
                    remoteAccountId: BigInt(0),
                    remotePrincipal: "lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe",
                    accountState: {
                        ft: BigInt(0),
                    },
                    time: BigInt(1),
                }] as HplStateRemoteAccountsCacheModel[],
            },
            result: FormResult.success([])
        },
        {
            name: "get accounts state from cache",
            input: {
                accountCount: BigInt(0),
                ftAssetCount: BigInt(0),
                virtualAccountCount: BigInt(0),
                remoteAccounts: [{
                    idRange: [Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"), BigInt(0), []]
                }],
                loadType: LoadType.Cache
            } as HplStateCacheDataInfo,
            data: {
                cacheData: [{
                    remoteAccountId: BigInt(0),
                    remotePrincipal: "lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe",
                    accountState: {
                        ft: BigInt(1),
                    },
                    time: BigInt(0),
                }] as HplStateRemoteAccountsCacheModel[],
            },
            result: FormResult.success([{
                accountState: {
                    ft: BigInt(1)
                },
                remoteAccountId: BigInt(0),
                remotePrincipal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                time: BigInt(0)
            }])
        },
        {
            name: "get accounts state from cache, cache is empty",
            input: {
                accountCount: BigInt(0),
                ftAssetCount: BigInt(0),
                virtualAccountCount: BigInt(0),
                remoteAccounts: [{
                    idRange: [Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"), BigInt(0), []]
                }],
                loadType: LoadType.Cache
            } as HplStateCacheDataInfo,
            data: {
                cacheData: undefined,
            },
            result: FormResult.success([])
        }
    ]

    for (let test of testData) {
        it(test.name, async () => {
            jest.restoreAllMocks();

            const identifierService = seedToIdentifierService("test");
            const cacheRepository = new (<new () => HplStateCacheRepository><unknown>HplStateCacheRepository)() as jest.Mocked<HplStateCacheRepository>;
            cacheRepository.getHplRemoteAccountState = jest.fn().mockReturnValue(test.data.cacheData);
            cacheRepository.setHplRemoteAccountState = jest.fn().mockReturnValue(undefined);
            const logger = new MockLogger();
            const hplRemoteAccountsStateCacheDataHandler = new HplRemoteAccountsStateCacheDataHandler(logger, identifierService, cacheRepository, mockCanisterService);

            const result = await hplRemoteAccountsStateCacheDataHandler.handle(test.input);

            expect(result).toEqual(test.result);


        }, 10000);
    }

})