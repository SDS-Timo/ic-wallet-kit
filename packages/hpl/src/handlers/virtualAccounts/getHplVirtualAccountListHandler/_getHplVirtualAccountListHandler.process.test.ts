import { itForeach } from "@hpl/__tests_utils/itForeach";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { GetHplVirtualAccountListHandler } from "@hpl/handlers/virtualAccounts/getHplVirtualAccountListHandler/getHplVirtualAccountListHandler";
import { LoadHplVirtualAccountsHandler } from "@hpl/internalHandlers";
import { HplVirtualAccountRepository } from "@hpl/repositories";
import { LoadType } from "@ic-wallet-kit/common";

describe("Unit GetHplVirtualAccountListHandler tests", () => {
    const validData = {
        loadHandler: {
            virtualAccounts: [
                {
                    virtualAccountId: BigInt(1),
                    accountId: BigInt(0),
                    accessBy: "",
                    amount: BigInt(0),
                    code: "",
                    currencyAmount: "",
                    isMint: false,
                    name: "",
                    expiration: undefined
                },
                {
                    virtualAccountId: BigInt(2),
                    accountId: BigInt(0),
                    accessBy: "",
                    amount: BigInt(0),
                    code: "",
                    currencyAmount: "",
                    isMint: false,
                    name: "",
                    expiration: undefined
                }
            ]
        },
        virtualAccountRepo: [
            {
                accountId: "0",
                id: "1",
                name: "Test",
            },
        ]
    }

    const testData = [
        {
            name: "GetHplVirtualAccountListHandler: virtual accounts when none exist in the repository",
            input: {
                loadType: LoadType.Full
            },
            data: {
                ...validData,
                virtualAccountRepo: []
            },
            result: {
                virtualAccount: [{
                    virtualAccountId: BigInt(1),
                    accountId: BigInt(0),
                    accessBy: "",
                    amount: BigInt(0),
                    code: "",
                    currencyAmount: "",
                    isMint: false,
                    name: "",
                    expiration: undefined
                },
                {
                    virtualAccountId: BigInt(2),
                    accountId: BigInt(0),
                    accessBy: "",
                    amount: BigInt(0),
                    code: "",
                    currencyAmount: "",
                    isMint: false,
                    name: "",
                    expiration: undefined
                }]
            }
        },
        {
            name: "GetHplVirtualAccountListHandler: virtual accounts with updated names",
            input: {
                loadType: LoadType.Full
            },
            data: { ...validData },
            result: {
                virtualAccount: [{
                    virtualAccountId: BigInt(1),
                    accountId: BigInt(0),
                    accessBy: "",
                    amount: BigInt(0),
                    code: "",
                    currencyAmount: "",
                    isMint: false,
                    name: "Test",
                    expiration: undefined
                },
                {
                    virtualAccountId: BigInt(2),
                    accountId: BigInt(0),
                    accessBy: "",
                    amount: BigInt(0),
                    code: "",
                    currencyAmount: "",
                    isMint: false,
                    name: "",
                    expiration: undefined
                }]
            }
        },
        {
            name: "GetHplVirtualAccountListHandler: handle an empty cache result",
            input: {
                loadType: LoadType.Full
            },
            data: {
                ...validData,
                loadHandler: {
                    virtualAccounts: []
                },
                virtualAccountRepo: []
            },
            result: {
                virtualAccount: []
            }
        }
    ]

    itForeach(testData, async (test) => {
        jest.restoreAllMocks();
        const logger = new MockLogger();
        const loadHplVirtualAccountsHandler = new (<new () => LoadHplVirtualAccountsHandler><unknown>LoadHplVirtualAccountsHandler)() as jest.Mocked<LoadHplVirtualAccountsHandler>;
        loadHplVirtualAccountsHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data.loadHandler));
        const hplVirtualAccountRepository = new (<new () => HplVirtualAccountRepository><unknown>HplVirtualAccountRepository)() as jest.Mocked<HplVirtualAccountRepository>;
        hplVirtualAccountRepository.getVirtualAccounts = jest.fn().mockReturnValue(Promise.resolve(test.data.virtualAccountRepo));
        hplVirtualAccountRepository.addVirtualAccount = jest.fn().mockReturnValue(Promise.resolve(undefined));
        const getHplAccountListHandler = new GetHplVirtualAccountListHandler(logger, loadHplVirtualAccountsHandler, hplVirtualAccountRepository);
        await getHplAccountListHandler.validate(test.input);
        const result = await getHplAccountListHandler.process(test.input);

        expect(result).toEqual(test.result);

        expect(loadHplVirtualAccountsHandler.process).toHaveBeenCalledWith({ loadType: test.input.loadType });
        expect(hplVirtualAccountRepository.getVirtualAccounts).toHaveBeenCalled();
        test.data.loadHandler.virtualAccounts.forEach((item) => {
            if (!test.data.virtualAccountRepo.find((i) => i.id === item.virtualAccountId.toString())) {
                expect(hplVirtualAccountRepository.addVirtualAccount).toHaveBeenCalledWith(expect.objectContaining({
                    id: item.virtualAccountId.toString(),
                    name: item.name,
                    accountId: item.accountId.toString(),
                }));
            }
        })
    });
})