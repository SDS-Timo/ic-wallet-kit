import { Principal } from "@dfinity/principal";
import { itForeach } from "@hpl/__tests_utils/itForeach";
import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { AddHplVirtualAccountForm } from "@hpl/forms";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { HplMintCacheDataHandler, HplOwnerCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers";
import { AddHplVirtualAccountInternalHandler } from "@hpl/internalHandlers/virtualAccountHandlers/addHplVirtualAccountInternalHandler/addHplVirtualAccountInternalHandler";
import { HplDataCacheRepository } from "@hpl/repositories";
import { HplDataCacheModel, HplMintCacheModel, HplOwnerDataCacheModel } from "@hpl/types";

describe("Unit AddHplVirtualAccountInternalHandler tests", () => {
    const mintCacheData = {
        isSuccess: true,
        data: {
            canisterId: "lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe",
            isMinter: true
        } as HplMintCacheModel
    }

    const ownerCacheData = {
        isSuccess: true,
        data: {
            ownerId: BigInt(4)
        } as HplOwnerDataCacheModel
    }

    const testData = [
        {
            name: "load assets",
            input: {
                accountId: BigInt(0),
                assetId: BigInt(0),
                virtualAccountName: "Test",
                accessByPrincipal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                amount: BigInt(1),
            } as AddHplVirtualAccountForm,
            data: {
                mockVirtualAccountId: 1n,
                hplCacheData:
                    {
                        accounts: {
                            accountLastId: BigInt(0),
                            accounts: []
                        },
                        virtualAccounts: {
                            virtualAccountLastId: BigInt(1),
                            virtualAccounts: [{
                                virtualAccountId: BigInt(1),
                                virtualAccountInfo: {
                                    principal: "lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe",
                                    accountType: {
                                        ft: BigInt(0)
                                    }
                                }
                            }]
                        },
                        ftAssets: {
                            ftAssetLastId: BigInt(0),
                            ftAssets: []
                        },
                        remotes: []
                    } as HplDataCacheModel,
                mintCacheData: mintCacheData,
                ownerCacheData: ownerCacheData
            },
            result: {
                accessBy: "lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe",
                accountId: BigInt(0),
                amount: BigInt(1),
                code: "041",
                assetId: 0n,
                assetSymbol: "",
                currencyAmount: "0.0",
                expiration: undefined,
                isMint: true,
                name: "Test",
                virtualAccountId: BigInt(1),
            }
        },
        {
            name: "load assets, cache is empty",
            input: {
                accountId: BigInt(0),
                assetId: BigInt(0),
                virtualAccountName: "Test",
                accessByPrincipal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                amount: BigInt(1),
            } as AddHplVirtualAccountForm,
            data: {
                mockVirtualAccountId: 1n,
                hplCacheData: undefined,
                mintCacheData: mintCacheData,
                ownerCacheData: ownerCacheData
            },
            result: {
                accessBy: "lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe",
                accountId: BigInt(0),
                amount: BigInt(1),
                code: "041",
                assetId: 0n,
                assetSymbol: "",
                currencyAmount: "0.0",
                expiration: undefined,
                isMint: true,
                name: "Test",
                virtualAccountId: BigInt(1),
            }
        },
        {
            name: "load assets, cache is empty",
            input: {
                accountId: BigInt(0),
                assetId: BigInt(0),
                virtualAccountName: "Test",
                accessByPrincipal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                amount: BigInt(1),
            } as AddHplVirtualAccountForm,
            data: {
                mockVirtualAccountId: 1n,
                hplCacheData: undefined,
                mintCacheData: {
                    ...mintCacheData,
                    isSuccess: false,
                    data: undefined,
                    errors: [new Error("MintCacheData Error")]
                },
                ownerCacheData: {
                    ...ownerCacheData,
                    isSuccess: false,
                    data: undefined,
                    errors: [new Error("OwnerCacheData Error")]
                }
            },
            result: {},
            error: [new Error("MintCacheData Error")]

        },
        {
            name: "load assets, cache is empty",
            input: {
                accountId: BigInt(0),
                assetId: BigInt(0),
                virtualAccountName: "Test",
                accessByPrincipal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                amount: BigInt(1),
            } as AddHplVirtualAccountForm,
            data: {
                mockVirtualAccountId: 1n,
                hplCacheData: undefined,
                mintCacheData: {
                    ...mintCacheData
                },
                ownerCacheData: {
                    ...ownerCacheData,
                    isSuccess: false,
                    data: undefined,
                    errors: [new Error("OwnerCacheData Error")]
                }
            },
            result: {},
            error: [new Error("OwnerCacheData Error")]
        },
        {
            name: "load assets, cache is empty",
            input: {
                accountId: BigInt(0),
                assetId: BigInt(0),
                virtualAccountName: "Test",
                accessByPrincipal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                amount: BigInt(1),
            } as AddHplVirtualAccountForm,
            data: {
                mockVirtualAccountId: 1n,
                hplCacheData: undefined,
                mintCacheData: {
                    ...mintCacheData,
                    isSuccess: true,
                    data: undefined,
                },
                ownerCacheData: {
                    ...ownerCacheData,
                    isSuccess: true,
                    data: undefined
                }
            },
            result: {
                accessBy: "lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe",
                accountId: BigInt(0),
                amount: BigInt(1),
                code: "001",
                assetId: 0n,
                assetSymbol: "",
                currencyAmount: "0.0",
                expiration: undefined,
                isMint: false,
                name: "Test",
                virtualAccountId: BigInt(1),
            },

        }
    ]

    itForeach(testData, async (test) => {
        const logger = new MockLogger();
        const identifierService = await seedToIdentifierService("b");
        const hplDataCacheRepository = new (<new () => HplDataCacheRepository><unknown>HplDataCacheRepository)() as jest.Mocked<HplDataCacheRepository>;
        const hplMintCacheDataHandler = new (<new () => HplMintCacheDataHandler><unknown>HplMintCacheDataHandler)() as jest.Mocked<HplMintCacheDataHandler>;
        const hplOwnerCacheDataHandler = new (<new () => HplOwnerCacheDataHandler><unknown>HplOwnerCacheDataHandler)() as jest.Mocked<HplOwnerCacheDataHandler>;
        hplMintCacheDataHandler.handle = jest.fn().mockReturnValue(Promise.resolve(test.data.mintCacheData));
        hplOwnerCacheDataHandler.handle = jest.fn().mockReturnValue(Promise.resolve(test.data.ownerCacheData));
        hplDataCacheRepository.getHplDataByCanisterId = jest.fn().mockReturnValue(test.data.hplCacheData);
        hplDataCacheRepository.setHplData = jest.fn().mockReturnValue(Promise.resolve(undefined));
        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;
        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);
        ingressActorWrapper.openVirtualAccount = jest.fn().mockReturnValue(Promise.resolve(test.data.mockVirtualAccountId));


        const addHplVirtualAccountInternalHandler = new AddHplVirtualAccountInternalHandler(
            logger,
            identifierService,
            mockCanisterService,
            hplDataCacheRepository,
            hplOwnerCacheDataHandler,
            hplMintCacheDataHandler);
        const result = await addHplVirtualAccountInternalHandler.process(test.input);
        expect(result).toEqual(test.result);
    });
})
