import { itForeach } from "@hpl/__tests_utils/itForeach";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { HplAccountsCacheDataResult, HplFtAssetsCacheDataResult, HplVirtualAccountsCacheDataResult, LoadHplAssetForm } from "@hpl/forms";
import {
    HplAccountCacheDataHandler,
    HplAdminStateCacheDataHandler, HplDictionaryCacheDataHandler,
    HplFtAssetCacheDataHandler, HplFtSuppliesStateCacheDataHandler,
    HplVirtualAccountCacheDataHandler,
    LoadHplAssetHandler
} from "@hpl/internalHandlers";
import { HplDictionaryDataCacheModel, HplFtSuppliesCacheModel } from "@hpl/types";
import { LoadType } from "@ic-wallet-middleware/common";

describe("Unit LoadHplAssetHandler tests", () => {
    const testData = [
        {
            name: "LoadHplAssetHandler, process and return HPL assets with dictionary",
            input: {
                loadType: LoadType.Full
            } as LoadHplAssetForm,
            data: {
                assetsCacheData:
                    {
                        ftAssetLastId: BigInt(1),
                        ftAssets: [{
                            assetId: BigInt(0),
                            ftAssetInfo: {
                                controller: "2vxsx-fae",
                                decimals: 0,
                                description: "Default",
                            }
                        },]
                    } as HplFtAssetsCacheDataResult,
                accountsCacheData: {
                    accountLastId: BigInt(1),
                    accounts: [{
                        accountId: BigInt(0),
                        accountType: {
                            ft: BigInt(0)
                        }
                    }]
                } as HplAccountsCacheDataResult,
                virtualAccountsCacheData: {
                    virtualAccountLastId: BigInt(1),
                    virtualAccounts: [
                        {
                            virtualAccountId: BigInt(0)
                        }
                    ]
                } as HplVirtualAccountsCacheDataResult,
                suppliesCacheData: [
                    {
                        assetId: BigInt(0),
                        ftSupply: BigInt(21015)
                    }] as HplFtSuppliesCacheModel[],
                adminStateCacheData: {
                    accounts: [
                        {
                            accountId: BigInt(0),
                            accountState: {
                                ft: BigInt(0),
                            },
                        },
                    ],
                    ftSupplies: [],
                    remoteAccounts: [],
                    virtualAccounts: [],
                },
                dictionaryCacheData: {
                    assetsDictionary: [{
                        assetId: 0n,
                        creationTime: 1708803516699538823n,
                        logo: "",
                        modificationTime: 1708999855546228757n,
                        name: "Wrapped toy token",
                        symbol: "MYX.H"
                    }]
                } as HplDictionaryDataCacheModel

            },
            result: {
                ftAssets: [{
                    assetName: "Wrapped toy token",
                    assetSymbol: "MYX.H",
                    controller: "2vxsx-fae",
                    decimal: 0,
                    description: "Default",
                    id: 0n,
                    ledgerBalance: 0n,
                    logo: "",
                    supply: BigInt(21015),
                    accountCount: 1,
                    virtualAccountCount: 1
                }]
            }
        },
        {
            name: "LoadHplAssetHandler, process and return HPL assets without dictionary",
            input: {
                loadType: LoadType.Full
            } as LoadHplAssetForm,
            data: {
                assetsCacheData:
                    {
                        ftAssetLastId: BigInt(1),
                        ftAssets: []
                    } as HplFtAssetsCacheDataResult,
                accountsCacheData: {
                    accountLastId: BigInt(1),
                    accounts: [{
                        accountId: BigInt(0),
                        accountType: {
                            ft: BigInt(0)
                        }
                    }]
                } as HplAccountsCacheDataResult,
                virtualAccountsCacheData: {
                    virtualAccountLastId: BigInt(1),
                    virtualAccounts: [
                        {
                            virtualAccountId: BigInt(0)
                        }
                    ]
                } as HplVirtualAccountsCacheDataResult,
                suppliesCacheData: [
                    {
                        assetId: BigInt(0),
                        ftSupply: BigInt(21015)
                    }] as HplFtSuppliesCacheModel[],
                adminStateCacheData: {
                    accounts: [],
                    ftSupplies: [],
                    remoteAccounts: [],
                    virtualAccounts: [],
                },
                dictionaryCacheData: {
                    assetsDictionary: [{
                        assetId: 9n,
                        creationTime: 1708803516699538823n,
                        logo: "",
                        modificationTime: 1708999855546228757n,
                        name: "Wrapped toy token",
                        symbol: "MYX.H"
                    }]
                } as HplDictionaryDataCacheModel

            },
            result: {
                ftAssets: [{
                    assetName: "",
                    assetSymbol: "",
                    controller: "",
                    decimal: 0,
                    description: "",
                    id: 0n,
                    ledgerBalance: 0n,
                    logo: "",
                    supply: BigInt(21015),
                    accountCount: 1,
                    virtualAccountCount: 1
                }]
            }
        }

    ]

    itForeach(testData, async (test) => {
        const hplFtAssetCacheDataHandler = new (<new () => HplFtAssetCacheDataHandler><unknown>HplFtAssetCacheDataHandler)() as jest.Mocked<HplFtAssetCacheDataHandler>;
        const hplAccountCacheDataHandler = new (<new () => HplAccountCacheDataHandler><unknown>HplAccountCacheDataHandler)() as jest.Mocked<HplAccountCacheDataHandler>;
        const hplVirtualAccountCacheDataHandler = new (<new () => HplVirtualAccountCacheDataHandler><unknown>HplVirtualAccountCacheDataHandler)() as jest.Mocked<HplVirtualAccountCacheDataHandler>;
        const hplFtSuppliesStateCacheDataHandler = new (<new () => HplFtSuppliesStateCacheDataHandler><unknown>HplFtSuppliesStateCacheDataHandler)() as jest.Mocked<HplFtSuppliesStateCacheDataHandler>;
        const hplAdminStateCacheDataHandler = new (<new () => HplAdminStateCacheDataHandler><unknown>HplAdminStateCacheDataHandler)() as jest.Mocked<HplAdminStateCacheDataHandler>;
        const hplDictionaryCacheDataHandler = new (<new () => HplDictionaryCacheDataHandler><unknown>HplDictionaryCacheDataHandler)() as jest.Mocked<HplDictionaryCacheDataHandler>;
        hplFtAssetCacheDataHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.assetsCacheData));
        hplAccountCacheDataHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.accountsCacheData));
        hplVirtualAccountCacheDataHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.virtualAccountsCacheData));
        hplFtSuppliesStateCacheDataHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.suppliesCacheData));
        hplAdminStateCacheDataHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.adminStateCacheData));
        hplDictionaryCacheDataHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.dictionaryCacheData));
        const logger = new MockLogger();
        const loadHplAssetHandler = new LoadHplAssetHandler(logger,
            hplFtAssetCacheDataHandler,
            hplAccountCacheDataHandler,
            hplVirtualAccountCacheDataHandler,
            hplFtSuppliesStateCacheDataHandler,
            hplAdminStateCacheDataHandler,
            hplDictionaryCacheDataHandler);
        await loadHplAssetHandler.validate(test.input);
        const result = await loadHplAssetHandler.process(test.input);
        expect(result).toEqual(test.result);
    });
})
