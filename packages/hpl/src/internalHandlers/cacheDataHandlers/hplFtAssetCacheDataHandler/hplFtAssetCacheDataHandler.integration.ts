import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplFtAssetCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplFtAssetCacheDataHandler/hplFtAssetCacheDataHandler";
import { HplDataCacheRepository } from "@hpl/repositories";
import { HplDataCacheModel } from "@hpl/types";
import { FormResult, LoadType } from "@ic-wallet-middleware/common";

describe("Unit HplAccountCacheDataHandler tests", () => {
    const testData = [
        {
            name: "get accounts from canister",
            input: {
                loadType: LoadType.Full
            },
            data: {
                cacheData: undefined,
                service: {
                    accounts: {},
                    ftAssets: {
                        ftAssetLastId: BigInt(555),
                        ftAssets: [{
                            assetId: BigInt(0),
                            ftAssetInfo: {
                                controller: "0x10",
                                decimals: 0,
                                description: "Default1",
                            }
                        }]
                    },
                    virtualAccounts: {}
                } as HplDataCacheModel
            },
            result: FormResult.success({
                accounts: {},
                ftAssets: {
                    ftAssetLastId: BigInt(555),
                    ftAssets: [{
                        assetId: BigInt(0),
                        ftAssetInfo: {
                            controller: "0x10",
                            decimals: 0,
                            description: "Default1",
                        }
                    }]
                },
                virtualAccounts: {}
            } as HplDataCacheModel)
        },
        {
            name: "get accounts from cache",
            input: {
                loadType: LoadType.Cache
            },
            data: {
                cacheData: {
                    accounts: {},
                    ftAssets: {
                        ftAssetLastId: BigInt(40),
                        ftAssets: [{
                            assetId: BigInt(0),
                            ftAssetInfo: {
                                controller: "2vxsx-fae",
                                decimals: 0,
                                description: "Default",
                            }
                        }]
                    },
                    virtualAccounts: {}
                } as HplDataCacheModel,
                service: undefined
            },
            result: FormResult.success({
                ftAssetLastId: BigInt(40),
                ftAssets: [
                    {
                        assetId: BigInt(0),
                        ftAssetInfo: {
                            controller: "2vxsx-fae",
                            decimals: 0,
                            description: "Default"
                        }
                    }
                ]
            })
        },
        {
            name: "get accounts from cache, cache is empty",
            input: {
                loadType: LoadType.Cache
            },
            data: {
                cacheData: undefined,
                service: {
                    accounts: {},
                    ftAssets: {
                        ftAssetLastId: BigInt(33),
                        ftAssets: [{
                            assetId: BigInt(444),
                            ftAssetInfo: {
                                controller: "0x11",
                                decimals: 3,
                                description: "Default3",
                            }
                        }]
                    },
                    virtualAccounts: {}
                } as HplDataCacheModel
            },
            result: FormResult.success({
                accounts: {},
                ftAssets: {
                    ftAssetLastId: BigInt(33),
                    ftAssets: [{
                        assetId: BigInt(444),
                        ftAssetInfo: {
                            controller: "0x11",
                            decimals: 3,
                            description: "Default3",
                        }
                    }]
                },
                virtualAccounts: {}
            } as HplDataCacheModel)
        }
    ]

    for (let test of testData) {
        it(test.name, async () => {
            jest.restoreAllMocks();

            const identifierService = seedToIdentifierService("a");

            const cacheRepository = new (<new () => HplDataCacheRepository><unknown>HplDataCacheRepository)() as jest.Mocked<HplDataCacheRepository>;
            cacheRepository.getHplDataByCanisterId = jest.fn().mockReturnValue(test.data.cacheData);
            cacheRepository.setHplData = jest.fn().mockImplementation(() => { });

            const logger = new MockLogger();
            const hplFtAssetCacheDataHandler = new HplFtAssetCacheDataHandler(logger, identifierService, cacheRepository, mockCanisterService);

            hplFtAssetCacheDataHandler.getExternalData = jest.fn().mockReturnValue(test.data.service);

            const result = await hplFtAssetCacheDataHandler.handle(test.input);

            expect(result).toEqual(test.result);
        }, 10000);
    }

})