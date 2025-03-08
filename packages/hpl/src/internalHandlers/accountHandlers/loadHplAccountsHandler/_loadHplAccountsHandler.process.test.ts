import { itForeach } from "@hpl/__tests_utils/itForeach";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplAccountsCacheDataResult, HplVirtualAccountsCacheDataResult, LoadHplAssetForm } from "@hpl/forms";
import {
    HplAccountCacheDataHandler,
    HplAccountsStateCacheDataHandler,
    HplMintCacheDataHandler,
    HplOwnerCacheDataHandler,
    HplVirtualAccountCacheDataHandler,
    HplVirtualAccountsStateCacheDataHandler,
    LoadHplAccountsHandler
} from "@hpl/internalHandlers";
import { HplOwnerDataCacheModel } from "@hpl/types";
import { LoadType } from "@ic-wallet-middleware/common";

describe("Unit GetHplAccountListHandler tests", () => {
    const testData = [
        {
            name: "GetHplAccountListHandler, process and return HPL accounts",
            input: {
                loadType: LoadType.Full
            } as LoadHplAssetForm,
            data: {
                accountsCacheData:
                    {
                        accountLastId: BigInt(1),
                        accounts: [{
                            accountId: BigInt(0),
                            accountType: {
                                ft: BigInt(2)
                            }
                        }]
                    } as HplAccountsCacheDataResult,
                virtualAccountsCacheData:
                    {
                        virtualAccountLastId: BigInt(1),
                        virtualAccounts: [{
                            virtualAccountId: BigInt(0),
                            virtualAccountInfo: {
                                principal: "abduh-diaaa-aaaal-qbg2a-cai",
                                accountType: {
                                    ft: BigInt(0),
                                },
                            },
                        }]
                    } as HplVirtualAccountsCacheDataResult,
                accountStateCacheData:
                    [{
                        accountId: BigInt(0),
                        accountState: {
                            ft: BigInt(2),
                        },
                    }]
                ,
                virtualAccountStateCacheData: [{
                    accountId: BigInt(0),
                    accountState: {
                        ft: BigInt(0),
                    },
                    time: BigInt(0),
                    virtualAccountId: BigInt(0),
                }],

                ownerCacheData: {
                    ownerId: undefined
                } as HplOwnerDataCacheModel,
                mintCacheData: jest.fn().mockReturnValue(Promise.resolve({
                    canisterId: "abduh-diaaa-aaaal-qbg2a-cai",
                    isMinter: true
                }))
            },
            result: {
                accounts: [{
                    name: "",
                    accountId: BigInt(0),
                    amount: BigInt(2),
                    currencyAmount: "0.00",
                    transactionFee: "0",
                    ft: BigInt(2),
                    virtualAccounts: [
                        {
                            name: "",
                            virtualAccountId: 0n,
                            amount: 0n,
                            currencyAmount: "0.00",
                            expiration: 0n,
                            accessBy: "abduh-diaaa-aaaal-qbg2a-cai",
                            accountId: 0n,
                            assetId: 0n,
                            assetSymbol: "",
                            code: "000",
                            isMint: true
                        }
                    ]
                }]
            }
        },
        {
            name: "GetHplAccountListHandler,",
            input: {
                loadType: LoadType.Full
            } as LoadHplAssetForm,
            data: {
                accountsCacheData:
                    {
                        accountLastId: BigInt(1),
                        accounts: [{
                            accountId: BigInt(0),
                            accountType: {
                                ft: BigInt(2)
                            }
                        }]
                    } as HplAccountsCacheDataResult,
                virtualAccountsCacheData:
                    {
                        virtualAccountLastId: BigInt(1),
                        virtualAccounts: [{
                            virtualAccountId: BigInt(0),
                            virtualAccountInfo: {
                                principal: "abduh-diaaa-aaaal-qbg2a-cai",
                                accountType: {
                                    ft: BigInt(0),
                                },
                            },
                        }]
                    } as HplVirtualAccountsCacheDataResult,
                accountStateCacheData:
                    [{
                        accountId: BigInt(1),
                        accountState: {
                            ft: BigInt(2),
                        },
                    }]
                ,
                virtualAccountStateCacheData: [{
                    accountId: BigInt(0),
                    accountState: {
                        ft: BigInt(0),
                    },
                    time: BigInt(0),
                    virtualAccountId: BigInt(1),
                }],

                ownerCacheData: {
                    ownerId: BigInt(4)
                } as HplOwnerDataCacheModel,
                mintCacheData: jest.fn().mockRejectedValue(new Error("Test Error"))
            },
            result: {
                accounts: [{
                    name: "",
                    accountId: BigInt(1),
                    amount: BigInt(2),
                    currencyAmount: "0.00",
                    transactionFee: "0",
                    ft: BigInt(0),
                    virtualAccounts: []
                }]
            }
        }
    ]

    itForeach(testData, async (test) => {
        const logger = new MockLogger();

        const identifierService = seedToIdentifierService("a");

        const hplAccountCacheDataHandler = new (<new () => HplAccountCacheDataHandler><unknown>HplAccountCacheDataHandler)() as jest.Mocked<HplAccountCacheDataHandler>;
        const hplVirtualAccountCacheDataHandler = new (<new () => HplVirtualAccountCacheDataHandler><unknown>HplVirtualAccountCacheDataHandler)() as jest.Mocked<HplVirtualAccountCacheDataHandler>;
        const hplAccountsStateCacheDataHandler = new (<new () => HplAccountsStateCacheDataHandler><unknown>HplAccountsStateCacheDataHandler)() as jest.Mocked<HplAccountsStateCacheDataHandler>;
        const hplVirtualAccountsStateCacheDataHandler = new (<new () => HplVirtualAccountsStateCacheDataHandler><unknown>HplVirtualAccountsStateCacheDataHandler)() as jest.Mocked<HplVirtualAccountsStateCacheDataHandler>;
        const hplOwnerCacheDataHandler = new (<new () => HplOwnerCacheDataHandler><unknown>HplOwnerCacheDataHandler)() as jest.Mocked<HplOwnerCacheDataHandler>;
        const hplMintCacheDataHandler = new (<new () => HplMintCacheDataHandler><unknown>HplMintCacheDataHandler)() as jest.Mocked<HplMintCacheDataHandler>;
        hplAccountCacheDataHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.accountsCacheData));
        hplVirtualAccountCacheDataHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.virtualAccountsCacheData));
        hplAccountsStateCacheDataHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.accountStateCacheData));
        hplVirtualAccountsStateCacheDataHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.virtualAccountStateCacheData));
        hplOwnerCacheDataHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.ownerCacheData));
        hplMintCacheDataHandler.process = test.data.mintCacheData;

        const loadHplAccountsHandler = new LoadHplAccountsHandler(logger,
            identifierService,
            hplAccountCacheDataHandler,
            hplVirtualAccountCacheDataHandler,
            hplAccountsStateCacheDataHandler,
            hplVirtualAccountsStateCacheDataHandler,
            hplOwnerCacheDataHandler,
            hplMintCacheDataHandler);
        await loadHplAccountsHandler.validate(test.input);
        const result = await loadHplAccountsHandler.process(test.input);

        expect(result).toEqual(test.result);

        expect(hplAccountCacheDataHandler.process).toHaveBeenCalledWith({
            loadType: test.input.loadType
        });

        expect(hplVirtualAccountCacheDataHandler.process).toHaveBeenCalledWith({
            loadType: test.input.loadType
        });

        expect(hplOwnerCacheDataHandler.process).toHaveBeenCalledWith({
            principal: identifierService.getPrincipal(),
            loadType: test.input.loadType
        });

        expect(hplVirtualAccountsStateCacheDataHandler.process).toHaveBeenCalledWith({
            accountCount: BigInt(1),
            ftAssetCount: BigInt(0),
            virtualAccountCount: BigInt(1),
            remoteAccounts: [],
            loadType: test.input.loadType
        });

        expect(hplAccountsStateCacheDataHandler.process).toHaveBeenCalledWith({
            accountCount: BigInt(1),
            ftAssetCount: BigInt(0),
            virtualAccountCount: BigInt(1),
            remoteAccounts: [],
            loadType: test.input.loadType
        });
    });
})
