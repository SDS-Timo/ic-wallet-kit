import { itForeach } from "@hpl/__tests_utils/itForeach";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { GetHplAccountListInfo } from "@hpl/forms";
import { GetHplAccountListHandler } from "@hpl/handlers/accounts/getHplAccountListHandler/getHplAccountListHandler";
import { LoadHplAccountsHandler } from "@hpl/internalHandlers";
import { HplAccountRepository, HplVirtualAccountRepository } from "@hpl/repositories";
import { HplAccount, HplAccountDataModel, HplVirtualAccountDataModel } from "@hpl/types";
import { LoadType } from "@ic-wallet-middleware/common";

describe("Unit GetHplAccountListHandler process tests", () => {

    const form: GetHplAccountListInfo = {
        loadType: LoadType.Cache
    };

    const validData = {
        dbAccounts: [
            {
                id: "1",
                ftId: "1",
                name: "Account 1"
            },
            {
                id: "2",
                ftId: "2",
                name: "Account 2"
            },
        ] as HplAccountDataModel[],
        dbVirtualAccounts: [
            {
                id: "1",
                accountId: "1",
                name: "Virtual Account 1"
            },
            {
                id: "2",
                accountId: "1",
                name: "Virtual Account 2"
            },
        ] as HplVirtualAccountDataModel[],
        cacheAccounts: {
            accounts: [
                {
                    accountId: 1n,
                    name: "",
                    amount: 0n,
                    currencyAmount: "0",
                    transactionFee: "50000",
                    ft: 1n,
                    virtualAccounts: [
                        {
                            accessBy: "",
                            accountId: 1n,
                            amount: 10n,
                            assetId: 1n,
                            assetSymbol: "MS",
                            code: "043",
                            currencyAmount: "",
                            isMint: false,
                            name: "",
                            virtualAccountId: 1n,
                            expiration: 0n
                        }
                    ]
                },
                {
                    accountId: 2n,
                    name: "",
                    amount: 0n,
                    currencyAmount: "0",
                    transactionFee: "50000",
                    ft: 2n,
                    virtualAccounts: []
                }
            ] as HplAccount[]
        }
    }

    const tests = [
        {
            name: "GetHplAccountListHandler: success",
            input: form,
            data: validData,
            result:
            {
                accounts: [
                    {
                        accountId: 1n,
                        name: "Account 1",
                        amount: 0n,
                        currencyAmount: "0",
                        transactionFee: "50000",
                        ft: 1n,
                        virtualAccounts: [
                            {
                                accessBy: "",
                                accountId: 1n,
                                amount: 10n,
                                assetId: 1n,
                                assetSymbol: "MS",
                                code: "043",
                                currencyAmount: "",
                                isMint: false,
                                name: "Virtual Account 1",
                                virtualAccountId: 1n,
                                expiration: 0n
                            }
                        ]
                    },
                    {
                        accountId: 2n,
                        name: "Account 2",
                        amount: 0n,
                        currencyAmount: "0",
                        transactionFee: "50000",
                        ft: 2n,
                        virtualAccounts: []
                    }
                ] as HplAccount[]
            }
        },
        {
            name: "GetHplAccountListHandler: db is empty",
            input: form,
            data: {
                ...validData,
                dbAccounts: [],
                dbVirtualAccounts: []
            },
            result:
            {
                accounts: [
                    {
                        accountId: 1n,
                        name: "Account 1",
                        amount: 0n,
                        currencyAmount: "0",
                        transactionFee: "50000",
                        ft: 1n,
                        virtualAccounts: [{
                            accessBy: "",
                            accountId: 1n,
                            amount: 10n,
                            assetId: 1n,
                            assetSymbol: "MS",
                            code: "043",
                            currencyAmount: "",
                            isMint: false,
                            name: "",
                            virtualAccountId: 1n,
                            expiration: 0n
                        }]
                    },
                    {
                        accountId: 2n,
                        name: "Account 2",
                        amount: 0n,
                        currencyAmount: "0",
                        transactionFee: "50000",
                        ft: 2n,
                        virtualAccounts: []
                    }
                ] as HplAccount[]
            }
        }
    ];

    itForeach(tests, async (test) => {

        const logger = new MockLogger();
        const hplAccountRepository = new (<new () => HplAccountRepository><unknown>HplAccountRepository)() as jest.Mocked<HplAccountRepository>;
        hplAccountRepository.getAccounts = jest.fn().mockResolvedValue(Promise.resolve(test.data.dbAccounts));
        hplAccountRepository.addAccount = jest.fn().mockResolvedValue(Promise.resolve(undefined));

        const hplVirtualAccountRepository = new (<new () => HplVirtualAccountRepository><unknown>HplVirtualAccountRepository)() as jest.Mocked<HplVirtualAccountRepository>;
        hplVirtualAccountRepository.getVirtualAccounts = jest.fn().mockResolvedValue(Promise.resolve(test.data.dbVirtualAccounts));

        const loadHplAccountsHandler = new (<new () => LoadHplAccountsHandler><unknown>LoadHplAccountsHandler)() as jest.Mocked<LoadHplAccountsHandler>;
        loadHplAccountsHandler.process = jest.fn().mockResolvedValue(Promise.resolve(test.data.cacheAccounts));

        const getHplAccountListHandler = new GetHplAccountListHandler(logger,
            loadHplAccountsHandler,
            hplAccountRepository,
            hplVirtualAccountRepository
        );
        await getHplAccountListHandler.validate(test.input);
        const result = await getHplAccountListHandler.process(test.input);

        expect(result).toEqual(test.result);

        expect(loadHplAccountsHandler.process).toHaveBeenCalledWith({
            loadType: test.input.loadType
        });

        if (test.data.dbAccounts.length == 0) {
            const accounts = test.data.cacheAccounts.accounts;
            accounts.forEach((account) => {
                expect(hplAccountRepository.addAccount).toHaveBeenCalledWith(
                    expect.objectContaining({
                        id: account.accountId.toString(),
                        ftId: account.ft.toString(),
                        name: account.name
                    })
                );
            });
        }
    });

});
