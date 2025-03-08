import { itForeach } from "@hpl/__tests_utils/itForeach";
import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { AddHplAccountForm } from "@hpl/forms/accounts/addHplAccountForm";
import { IngressActorWrapper } from "@hpl/hplWrappers";
import { AddHplAccountInternalHandler } from "@hpl/internalHandlers/accountHandlers/addHplAccountInternalHandler/addHplAccountInternalHandler";
import { HplDataCacheRepository } from "@hpl/repositories";
import { HplDataCacheModel } from "@hpl/types";

describe("Unit AddHplAccountInternalHandler tests", () => {
    const testData = [
        {
            name: "AddHplAccountInternalHandler, should process and return a new HPL account",
            input: {
                assetId: BigInt(0),
                accountName: "Test",
            } as AddHplAccountForm,
            data: {
                mockAccountId: 1n,
                mockAccountInfo: [
                    [null, { ft: 0n }],
                ],
                hplCacheData:
                    {
                        accounts: {
                            accountLastId: BigInt(5),
                            accounts: [
                                {
                                    accountId: BigInt(0),
                                    accountType: {
                                        ft: BigInt(0),
                                    },
                                }
                            ],
                        },
                        virtualAccounts: {
                            virtualAccountLastId: BigInt(0),
                            virtualAccounts: []
                        },
                        ftAssets: {
                            ftAssetLastId: BigInt(0),
                            ftAssets: []
                        },
                        remotes: []
                    } as HplDataCacheModel
            },
            result: {
                accountId: BigInt(1),
                amount: BigInt(0),
                currencyAmount: "0.0",
                ft: BigInt(0),
                name: "Test",
                transactionFee: "0",
                virtualAccounts: []
            }
        },
        {
            name: "AddHplAccountInternalHandler, should create a new HPL data cache if none exists",
            input: {
                assetId: BigInt(0),
                accountName: "Test",
            } as AddHplAccountForm,
            data: {
                mockAccountId: 1n,
                mockAccountInfo: [
                    [null, { ft: 0n }],
                ],
                hplCacheData: undefined
            },
            result: {
                accountId: BigInt(1),
                amount: BigInt(0),
                currencyAmount: "0.0",
                ft: BigInt(0),
                name: "Test",
                transactionFee: "0",
                virtualAccounts: []
            }
        }
    ]

    itForeach(testData, async (test) => {
        const logger = new MockLogger();

        const identifierService = await seedToIdentifierService("b");
        const hplDataCacheRepository = new (<new () => HplDataCacheRepository><unknown>HplDataCacheRepository)() as jest.Mocked<HplDataCacheRepository>;
        hplDataCacheRepository.getHplDataByCanisterId = jest.fn().mockReturnValue(test.data.hplCacheData);
        hplDataCacheRepository.setHplData = jest.fn().mockReturnValue(Promise.resolve(undefined));
        const ingressActorWrapper = new (<new () => IngressActorWrapper><unknown>IngressActorWrapper)() as jest.Mocked<IngressActorWrapper>;
        IngressActorWrapper.create = jest.fn().mockReturnValue(ingressActorWrapper);
        ingressActorWrapper.openAccount = jest.fn().mockReturnValue(Promise.resolve(test.data.mockAccountId));
        ingressActorWrapper.getAccountInfo = jest.fn().mockReturnValue(Promise.resolve(test.data.mockAccountInfo));
        const addInternalHplAccountHandler = new AddHplAccountInternalHandler(logger, identifierService, mockCanisterService, hplDataCacheRepository);
        const result = await addInternalHplAccountHandler.process(test.input);
        expect(result).toEqual(test.result);

        expect(hplDataCacheRepository.getHplDataByCanisterId).toHaveBeenCalledWith(mockCanisterService.getLedgerCanisterId());
    });

})
