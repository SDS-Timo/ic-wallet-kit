import { itForeach } from "@hpl/__tests_utils/itForeach";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { AddHplAccountForm } from "@hpl/forms";
import { AddHplAccountHandler } from "@hpl/handlers/accounts/addHplAccountHandler/addHplAccountHandler";
import { AddHplAccountInternalHandler } from "@hpl/internalHandlers";
import { HplAccountRepository } from "@hpl/repositories";
import { HplAccount } from "@hpl/types";

describe("Unit AddHplAccountHandler process tests", () => {

    const form: AddHplAccountForm = {
        assetId: 1n,
        accountName: "Test"
    };

    const tests = [
        {
            name: "AddHplAccountHandler: success",
            input: form,
            data: {
                account: {
                    accountId: 2n,
                    name: "",
                    amount: 0n,
                    currencyAmount: "0",
                    transactionFee: "50000",
                    ft: 1n,
                    virtualAccounts: []
                }
            },
            result:
            {
                account:
                    {
                        accountId: 2n,
                        name: "Test",
                        amount: 0n,
                        currencyAmount: "0",
                        transactionFee: "50000",
                        ft: 1n,
                        virtualAccounts: []
                    } as HplAccount
            }
        }
    ];

    itForeach(tests, async (test) => {

        const logger = new MockLogger();
        const addHplAccountInternalHandler = new (<new () => AddHplAccountInternalHandler><unknown>AddHplAccountInternalHandler)() as jest.Mocked<AddHplAccountInternalHandler>;
        addHplAccountInternalHandler.process = jest.fn().mockResolvedValue(Promise.resolve(test.data.account));
        const hplAccountRepository = new (<new () => HplAccountRepository><unknown>HplAccountRepository)() as jest.Mocked<HplAccountRepository>;
        hplAccountRepository.addAccount = jest.fn().mockResolvedValue(Promise.resolve(undefined));

        const addHplAccountHandler = new AddHplAccountHandler(logger,
            addHplAccountInternalHandler,
            hplAccountRepository
        );

        const result = await addHplAccountHandler.process(test.input);

        expect(result).toEqual(test.result);

        expect(addHplAccountInternalHandler.process).toHaveBeenCalledWith(test.input);

        expect(hplAccountRepository.addAccount).toHaveBeenCalledWith(
            expect.objectContaining({
                id: test.result.account.accountId.toString(),
                ftId: test.input.assetId.toString(),
                name: test.input.accountName
            })
        );
    });

});
