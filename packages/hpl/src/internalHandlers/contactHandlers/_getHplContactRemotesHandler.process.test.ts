import { Principal } from "@dfinity/principal";
import { itForeach } from "@hpl/__tests_utils/itForeach";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { HplRemotesCacheDataResult } from "@hpl/forms";
import {
    GetHplContactRemotesHandler,
    HplDictionaryCacheDataHandler,
    HplOwnerCacheDataHandler,
    HplRemoteAccountsStateCacheDataHandler,
    HplRemotesCacheDataHandler
} from "@hpl/internalHandlers";
import { HplAssetRepository } from "@hpl/repositories";
import { HplDictionaryCacheModel, HplOwnerDataCacheModel, HplStateRemoteAccountsCacheModel } from "@hpl/types";
import { LoadType } from "@ic-wallet-kit/common";

describe("Unit GetHplContactRemotesHandler tests", () => {
    const remotesCacheData = {
        isSuccess: true,
        data: {
            remotes: [{
                accountId: BigInt(0),
                remoteId: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                remoteInfo: {
                    ft: BigInt(1)
                }
            }]
        } as HplRemotesCacheDataResult
    };

    const hplRemoteAccountsStateCacheData = {
        isSuccess: true,
        data: [{
            accountState: {
                ft: BigInt(1)
            },
            remoteAccountId: BigInt(0),
            remotePrincipal: "lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe",
            time: BigInt(0)
        }] as HplStateRemoteAccountsCacheModel[]
    };

    const hplOwnerCacheData = {
        isSuccess: true,
        data: {
            ownerId: BigInt(42)
        } as HplOwnerDataCacheModel
    };

    const hplDictionary = {
        isSuccess: true,
        data: {
            assetsDictionary: [
                {
                    assetId: 1n,
                    name: "Test",
                    symbol: "Test",
                    logo: "logo-mock",
                    creationTime: 0n,
                    modificationTime: 0n
                } as HplDictionaryCacheModel
            ]
        }
    };

    const testData = [
        {
            name: "GetHplContactRemotesHandler, process and return formatted remotes",
            input: {
                principal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                loadType: LoadType.Full
            },
            data: {
                remotesCacheData: { ...remotesCacheData },
                hplRemoteAccountsStateCacheData: { ...hplRemoteAccountsStateCacheData },
                hplOwnerCacheData: { ...hplOwnerCacheData },
                assets: [{
                    id: "1",
                    name: "Test",
                    symbol: "Test",
                    assetName: "Test",
                    assetSymbol: "Test",
                    logo: "logo-mock"
                }],
                hplDictionary: hplDictionary
            },
            result: [{
                name: "",
                remoteAccountId: "0",
                expired: 0,
                amount: "1",
                assetId: "1",
                assetName: "Test",
                assetSymbol: "Test",
                assetLogo: "logo-mock",
                code: "02a0"
            }]
        },
        {
            name: "GetHplContactRemotesHandler,process and return formatted remotes, if remotesCache is empty",
            input: {
                principal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                loadType: LoadType.Full
            },
            data: {
                remotesCacheData:
                {
                    ...remotesCacheData,
                    isSuccess: false,
                    data: undefined
                },
                hplRemoteAccountsStateCacheData: { ...hplRemoteAccountsStateCacheData },
                hplOwnerCacheData: { ...hplOwnerCacheData },
                assets: [],
                hplDictionary: hplDictionary
            },
            result: []
        },
        {
            name: "GetHplContactRemotesHandler,process and return formatted remotes, if remoteAccountsStateCache is empty",
            input: {
                principal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                loadType: LoadType.Full
            },
            data: {
                remotesCacheData:
                {
                    ...remotesCacheData
                },
                hplRemoteAccountsStateCacheData: {
                    ...hplRemoteAccountsStateCacheData,
                    isSuccess: false,
                    data: undefined
                },
                hplOwnerCacheData: { ...hplOwnerCacheData },
                assets: [],
                hplDictionary: hplDictionary
            },
            result: []
        },
        {
            name: "GetHplContactRemotesHandler,process and return formatted remotes, if ownerCache is empty",
            input: {
                principal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                loadType: LoadType.Full
            },
            data: {
                remotesCacheData:
                {
                    ...remotesCacheData
                },
                hplRemoteAccountsStateCacheData: {
                    ...hplRemoteAccountsStateCacheData,
                },
                hplOwnerCacheData: {
                    ...hplOwnerCacheData,
                    isSuccess: false,
                    data: undefined
                },
                assets: [{
                    id: "1",
                    name: "",
                    symbol: "",
                    assetName: "Test",
                    assetSymbol: "Test",
                    logo: ""
                }],
                hplDictionary: {
                    ...hplDictionary
                }
            },
            result: [{
                name: "",
                remoteAccountId: "0",
                expired: 0,
                amount: "1",
                assetId: "1",
                assetName: "Test",
                assetSymbol: "Test",
                assetLogo: "logo-mock",
                code: ""
            }]
        },
        {
            name: "GetHplContactRemotesHandler,process and return formatted remotes, if asset list is empty",
            input: {
                principal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                loadType: LoadType.Full
            },
            data: {
                remotesCacheData:
                {
                    ...remotesCacheData
                },
                hplRemoteAccountsStateCacheData: {
                    ...hplRemoteAccountsStateCacheData,
                },
                hplOwnerCacheData: {
                    ...hplOwnerCacheData
                },
                assets: [],
                hplDictionary: {
                    ...hplDictionary,
                    isSuccess: false,
                    data: undefined
                }
            },
            result: [{
                name: "",
                remoteAccountId: "0",
                expired: 0,
                amount: "1",
                assetId: "1",
                assetName: "",
                assetSymbol: "",
                assetLogo: "",
                code: "02a0"
            }]
        }
    ]

    itForeach(testData, async (test) => {
        const logger = new MockLogger();

        const hplRemotesCacheDataHandler = new (<new () => HplRemotesCacheDataHandler><unknown>HplRemotesCacheDataHandler)() as jest.Mocked<HplRemotesCacheDataHandler>;
        const hplRemoteAccountsStateCacheDataHandler = new (<new () => HplRemoteAccountsStateCacheDataHandler><unknown>HplRemoteAccountsStateCacheDataHandler)() as jest.Mocked<HplRemoteAccountsStateCacheDataHandler>;
        const hplOwnerCacheDataHandler = new (<new () => HplOwnerCacheDataHandler><unknown>HplOwnerCacheDataHandler)() as jest.Mocked<HplOwnerCacheDataHandler>;
        const hplAssetRepository = new (<new () => HplAssetRepository><unknown>HplAssetRepository)() as jest.Mocked<HplAssetRepository>;
        const hplDictionaryCacheDataHandler = new (<new () => HplDictionaryCacheDataHandler><unknown>HplDictionaryCacheDataHandler)() as jest.Mocked<HplDictionaryCacheDataHandler>;

        hplRemotesCacheDataHandler.handle = jest.fn().mockReturnValue(Promise.resolve(test.data.remotesCacheData));
        hplRemoteAccountsStateCacheDataHandler.handle = jest.fn().mockReturnValue(Promise.resolve(test.data.hplRemoteAccountsStateCacheData));
        hplOwnerCacheDataHandler.handle = jest.fn().mockReturnValue(Promise.resolve(test.data.hplOwnerCacheData));
        hplAssetRepository.getAssets = jest.fn().mockReturnValue(Promise.resolve(test.data.assets));
        hplDictionaryCacheDataHandler.handle = jest.fn().mockReturnValue(Promise.resolve(test.data.hplDictionary));

        const getHplContactRemotesHandler = new GetHplContactRemotesHandler(logger,
            hplRemotesCacheDataHandler,
            hplRemoteAccountsStateCacheDataHandler,
            hplOwnerCacheDataHandler,
            hplAssetRepository,
            hplDictionaryCacheDataHandler
        );
        const result = await getHplContactRemotesHandler.process(test.input);
        expect(result).toEqual(test.result);
    });
})
