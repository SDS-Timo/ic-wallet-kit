import { itForeach } from "@hpl/__tests_utils/itForeach";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { EditHplAccountHandler } from "@hpl/handlers/accounts/editHplAccountHandler/editHplAccountHandler";
import { HplAccountRepository } from "@hpl/repositories";
import { ValidationError } from "@ic-wallet-middleware/common";

describe("Unit EditHplAccountHandler process tests", () => {
    const form = {
        accountId: "3",
        name: "Test"
    };

    const tests = [
        {
            name: "EditHplAccountHandler: success",
            input: form,
            result:
            {
            }
        },
        {
            name: "EditHplAccountHandler: account not exists",
            input: form,
            data: {
                updateAccount: jest.fn().mockRejectedValue(new ValidationError("account.not.exists",
                    "accountId",
                    "Account not exists. AccountId: 3")),
            },
            result: {},
            error: new Error("Account not exists. AccountId: 3")

        }
    ];

    itForeach(tests, async (test) => {

        const logger = new MockLogger();

        const hplAccountRepository = new (<new () => HplAccountRepository><unknown>HplAccountRepository)() as jest.Mocked<HplAccountRepository>;
        hplAccountRepository.updateAccount = jest.fn().mockResolvedValue(Promise.resolve(undefined));

        if (test.data?.updateAccount) {
            hplAccountRepository.updateAccount = test.data.updateAccount
        }

        const editHplAccountHandler = new EditHplAccountHandler(logger,
            hplAccountRepository
        );

        const result = await editHplAccountHandler.process(test.input);
        expect(result).toEqual(test.result);

        expect(hplAccountRepository.updateAccount).toHaveBeenCalledWith(
            expect.objectContaining({
                accountId: test.input.accountId,
                name: test.input.name
            })
        );
    });

});
