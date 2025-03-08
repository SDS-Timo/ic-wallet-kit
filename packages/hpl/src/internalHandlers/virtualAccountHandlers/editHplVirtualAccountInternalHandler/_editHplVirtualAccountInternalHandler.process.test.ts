import { itForeach } from "@hpl/__tests_utils/itForeach";
import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { EditHplVirtualAccountForm, HplVirtualAccountsCacheDataResult } from "@hpl/forms";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { HplMintCacheDataHandler, HplOwnerCacheDataHandler, HplVirtualAccountCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers";
import { EditHplVirtualAccountInternalHandler } from "@hpl/internalHandlers/virtualAccountHandlers/editHplVirtualAccountInternalHandler/editHplVirtualAccountInternalHandler";
import { HplMintCacheModel, HplOwnerDataCacheModel, HplVirtualAccount, HplVirtualAccountDataModel } from "@hpl/types";
import { ValidationError } from "@ic-wallet-middleware/common";

describe("Unit EditHplVirtualAccountInternalHandler tests", () => {
    const testData = [
        {
            name: "load assets",
            input: {
                virtualAccountId: BigInt(1),
                accountId: BigInt(0),
                virtualAccountName: "Test",
                amount: BigInt(1),
                expiration: undefined
            } as EditHplVirtualAccountForm,
            data: {
                dbData: [{
                    accountId: "0",
                    id: "1",
                    name: ""
                }] as HplVirtualAccountDataModel[],
                hplCacheData:
                    {
                        virtualAccountLastId: BigInt(2),
                        virtualAccounts: [{
                            virtualAccountId: BigInt(1),
                            virtualAccountInfo: {
                                principal: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
                                accountType: {
                                    ft: BigInt(1)
                                }
                            }
                        }]

                    } as HplVirtualAccountsCacheDataResult,
                mintCacheData: {
                    canisterId: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
                    isMinter: false
                } as HplMintCacheModel,
                ownerCacheData: {
                    ownerId: 1n
                } as HplOwnerDataCacheModel
            },
            result: {
                accessBy: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
                accountId: BigInt(0),
                amount: BigInt(1),
                code: "011",
                assetId: BigInt(1),
                assetSymbol: "",
                currencyAmount: "0.0",
                expiration: undefined,
                isMint: false,
                name: "Test",
                virtualAccountId: BigInt(1),
            } as HplVirtualAccount
        },
        {
            name: "load assets, cache is empty",
            input: {
                virtualAccountId: BigInt(1),
                accountId: BigInt(0),
                virtualAccountName: "Test",
                amount: BigInt(1),
                expiration: undefined
            } as EditHplVirtualAccountForm,
            data: {
                dbData: [{
                    accountId: "0",
                    id: "1",
                    name: ""
                }] as HplVirtualAccountDataModel[],
                hplCacheData: {
                    virtualAccountLastId: BigInt(0),
                    virtualAccounts: []
                } as HplVirtualAccountsCacheDataResult,
                mintCacheData: {
                    canisterId: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
                    isMinter: false
                } as HplMintCacheModel,
                ownerCacheData: {
                    ownerId: 1n
                } as HplOwnerDataCacheModel
            },
            result: {},
            error: new ValidationError(
                "virtual.account.not.found",
                "virtualAccountId",
                "Virtual Account not found"
            )
        },
        {
            name: "load assets, ",
            input: {
                virtualAccountId: BigInt(1),
                accountId: BigInt(0),
                virtualAccountName: "Test",
                amount: BigInt(1),
                expiration: undefined
            } as EditHplVirtualAccountForm,
            data: {
                dbData: [] as HplVirtualAccountDataModel[],
                hplCacheData: {
                    virtualAccountLastId: BigInt(2),
                    virtualAccounts: [{
                        virtualAccountId: BigInt(0),
                        virtualAccountInfo: {
                            principal: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
                            accountType: {
                                ft: BigInt(1)
                            }
                        }
                    }]
                } as HplVirtualAccountsCacheDataResult,
                mintCacheData: undefined,
                ownerCacheData: {
                    ownerId: undefined
                } as HplOwnerDataCacheModel
            },
            result: {},
            error: new ValidationError(
                "virtual.account.not.found",
                "virtualAccountId",
                "Virtual Account not found"
            )
        },
        {
            name: "load assets",
            input: {
                virtualAccountId: BigInt(1),
                accountId: BigInt(0),
                virtualAccountName: "Test",
                amount: BigInt(1),
                expiration: undefined
            } as EditHplVirtualAccountForm,
            data: {
                dbData: [{
                    accountId: "0",
                    id: "1",
                    name: ""
                }] as HplVirtualAccountDataModel[],
                hplCacheData:
                    {
                        virtualAccountLastId: BigInt(2),
                        virtualAccounts: [{
                            virtualAccountId: BigInt(1),
                            virtualAccountInfo: {
                                principal: "rln4c-rqaaa-aaaao-aatra-cai",
                                accountType: {
                                    ft: BigInt(1)
                                }
                            }
                        }]

                    } as HplVirtualAccountsCacheDataResult,
                mintCacheData: {
                    canisterId: "rln4c-rqaaa-aaaao-aatra-cai",
                    isMinter: false
                } as HplMintCacheModel,
                ownerCacheData: {
                    ownerId: undefined
                } as HplOwnerDataCacheModel
            },
            result: {
                accessBy: "rln4c-rqaaa-aaaao-aatra-cai",
                accountId: BigInt(0),
                amount: BigInt(1),
                code: "001",
                assetId: BigInt(1),
                assetSymbol: "",
                currencyAmount: "0.0",
                expiration: undefined,
                isMint: false,
                name: "Test",
                virtualAccountId: BigInt(1),
            } as HplVirtualAccount
        },
    ]

    itForeach(testData, async (test) => {
        const logger = new MockLogger();
        const identifierService = seedToIdentifierService("b");

        const hplVirtualAccountCacheDataHandler = new (<new () => HplVirtualAccountCacheDataHandler><unknown>HplVirtualAccountCacheDataHandler)() as jest.Mocked<HplVirtualAccountCacheDataHandler>;
        const hplMintCacheDataHandler = new (<new () => HplMintCacheDataHandler><unknown>HplMintCacheDataHandler)() as jest.Mocked<HplMintCacheDataHandler>;
        const hplOwnerCacheDataHandler = new (<new () => HplOwnerCacheDataHandler><unknown>HplOwnerCacheDataHandler)() as jest.Mocked<HplOwnerCacheDataHandler>;
        hplMintCacheDataHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.mintCacheData));
        hplOwnerCacheDataHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.ownerCacheData));
        hplVirtualAccountCacheDataHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.hplCacheData));
        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;
        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);
        ingressActorWrapper.updateVirtualAccount = jest.fn().mockReturnValue(Promise.resolve([0n, 0n]));
        const editHplVirtualAccountInternalHandler = new EditHplVirtualAccountInternalHandler(
            logger,
            identifierService,
            mockCanisterService,
            hplVirtualAccountCacheDataHandler,
            hplOwnerCacheDataHandler,
            hplMintCacheDataHandler);

        const result = await editHplVirtualAccountInternalHandler.process(test.input);
        expect(result).toEqual(test.result);
    });
})
