import { itForeach } from "@hpl/__tests_utils/itForeach";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { HplVirtualAccountsCacheDataResult, LoadHplAssetForm, LoadHplVirtualAccountForm } from "@hpl/forms";
import {
    HplMintCacheDataHandler,
    HplOwnerCacheDataHandler,
    HplVirtualAccountCacheDataHandler,
    HplVirtualAccountsStateCacheDataHandler,
    LoadHplVirtualAccountsHandler
} from "@hpl/internalHandlers";
import { HplOwnerDataCacheModel } from "@hpl/types";
import { LoadType } from "@ic-wallet-kit/common";

describe("Unit LoadHplVirtualAccountsHandler tests", () => {
    const virtualAccountsCacheData: HplVirtualAccountsCacheDataResult =
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
    };

    const virtualAccountStateCacheData =
        [{
            accountId: BigInt(0),
            accountState: {
                ft: BigInt(0),
            },
            time: BigInt(0),
            virtualAccountId: BigInt(0),
        }];

    const ownerCacheData: HplOwnerDataCacheModel = {
        ownerId: BigInt(1)
    };

    const mintCacheData = {
        canisterId: "abduh-diaaa-aaaal-qbg2a-cai",
        isMinter: true
    }

    const testData = [
        {
            name: "load virtual account",
            input: {
                loadType: LoadType.Full
            } as LoadHplVirtualAccountForm,
            data: {
                virtualAccountsCacheData: jest.fn().mockReturnValue(Promise.resolve(virtualAccountsCacheData)),
                virtualAccountStateCacheData: jest.fn().mockReturnValue(Promise.resolve(virtualAccountStateCacheData)),
                ownerCacheData: jest.fn().mockReturnValue(Promise.resolve(ownerCacheData)),
                mintCacheData: jest.fn().mockReturnValue(Promise.resolve(mintCacheData))
            },
            result: {
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
                        code: "010",
                        isMint: true
                    }
                ]
            }
        },
        {
            name: "load virtual account, virtualAccounts cache error",
            input: {
                loadType: LoadType.Full
            } as LoadHplAssetForm,
            data: {
                virtualAccountsCacheData: jest.fn().mockRejectedValue("Test Error"),
                virtualAccountStateCacheData: jest.fn().mockRejectedValue("Test Error"),
                ownerCacheData: jest.fn().mockReturnValue(Promise.resolve(ownerCacheData)),
                mintCacheData: jest.fn().mockReturnValue(Promise.resolve(mintCacheData))
            },
            result: {},
            error:
                "Test Error"

        },
        {
            name: "load virtual account, owner cache error",
            input: {
                loadType: LoadType.Full
            } as LoadHplVirtualAccountForm,
            data: {
                virtualAccountsCacheData: jest.fn().mockReturnValue(Promise.resolve(virtualAccountsCacheData)),
                virtualAccountStateCacheData: jest.fn().mockReturnValue(Promise.resolve(virtualAccountStateCacheData)),
                ownerCacheData: jest.fn().mockRejectedValue("Test Error"),
                mintCacheData: jest.fn().mockRejectedValue("Test Error"),
            },
            result: {},
            error: "Test Error"
        },
        {
            name: "load virtual account, virtual account state cache undefined",
            input: {
                loadType: LoadType.Full
            } as LoadHplVirtualAccountForm,
            data: {
                virtualAccountsCacheData: jest.fn().mockReturnValue(Promise.resolve(
                    {
                        ...virtualAccountsCacheData,
                        virtualAccounts: [{
                            virtualAccountId: BigInt(1),
                            virtualAccountInfo: {
                                principal: "abduh-diaaa-aaaal-qbg2a-cai",
                                accountType: {
                                    ft: BigInt(0),
                                },
                            },
                        }]
                    }
                )),
                virtualAccountStateCacheData: jest.fn().mockReturnValue(Promise.resolve(virtualAccountStateCacheData)),
                ownerCacheData: jest.fn().mockReturnValue(Promise.resolve({
                    ...ownerCacheData,
                    ownerId: undefined
                })),
                mintCacheData: jest.fn().mockRejectedValue("Test Error"),
            },
            result: {
                virtualAccounts: [
                    {
                        name: "",
                        virtualAccountId: 0n,
                        amount: 0n,
                        currencyAmount: "0.00",
                        expiration: 0n,
                        accessBy: "",
                        accountId: 0n,
                        assetId: 0n,
                        assetSymbol: "",
                        code: "000",
                        isMint: false
                    }
                ]
            }
        },
    ]

    itForeach(testData, async (test) => {

        const identifierService = seedToIdentifierService("a");
        const hplVirtualAccountCacheDataHandler = new (<new () => HplVirtualAccountCacheDataHandler><unknown>HplVirtualAccountCacheDataHandler)() as jest.Mocked<HplVirtualAccountCacheDataHandler>;
        const hplVirtualAccountsStateCacheDataHandler = new (<new () => HplVirtualAccountsStateCacheDataHandler><unknown>HplVirtualAccountsStateCacheDataHandler)() as jest.Mocked<HplVirtualAccountsStateCacheDataHandler>;
        const hplOwnerCacheDataHandler = new (<new () => HplOwnerCacheDataHandler><unknown>HplOwnerCacheDataHandler)() as jest.Mocked<HplOwnerCacheDataHandler>;
        const hplMintCacheDataHandler = new (<new () => HplMintCacheDataHandler><unknown>HplMintCacheDataHandler)() as jest.Mocked<HplMintCacheDataHandler>;

        hplVirtualAccountCacheDataHandler.process = test.data.virtualAccountsCacheData;
        hplVirtualAccountsStateCacheDataHandler.process = test.data.virtualAccountStateCacheData;
        hplOwnerCacheDataHandler.process = test.data.ownerCacheData;
        hplMintCacheDataHandler.process = test.data.mintCacheData;
        const logger = new MockLogger();
        const loadHplAccountsHandler = new LoadHplVirtualAccountsHandler(logger,
            identifierService,
            hplVirtualAccountCacheDataHandler,
            hplVirtualAccountsStateCacheDataHandler,
            hplOwnerCacheDataHandler,
            hplMintCacheDataHandler);
        await loadHplAccountsHandler.validate(test.input);
        const result = await loadHplAccountsHandler.process(test.input);

        expect(result).toEqual(test.result);

    });
})
