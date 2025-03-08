import { itValidate } from "@hpl/__tests_utils/itValidate";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@hpl/__tests_utils/testDefinition";
import { EditHplAccountHandler } from "@hpl/handlers/accounts/editHplAccountHandler/editHplAccountHandler";
import { HplAccountRepository } from "@hpl/repositories";
import { getPropertyName, ValidationError } from "@ic-wallet-middleware/common";



describe("Unit EditHplAccountHandler validate tests", () => {

    const valid = {
        accountId: "3",
        name: "Test"
    };

    const validData = {
        exists: false
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "EditHplAccountHandler validation success",
        tests: [
            {
                name: "EditHplAccountHandler: Field accountId is required",
                input: {
                    key: getPropertyName(valid, v => v.accountId),
                    value: undefined
                },
                result: {},
                error: new ValidationError("editing.hpl.account.accountId.is.required",
                    "accountId",
                    "Field accountId is required")

            }
        ]
    };

    itValidate(valid, validData, tests, async (input, validData) => {

        const logger = new MockLogger();

        const hplAccountRepository = new (<new () => HplAccountRepository><unknown>HplAccountRepository)() as jest.Mocked<HplAccountRepository>;

        const editHplAccountHandler = new EditHplAccountHandler(logger,
            hplAccountRepository
        );

        await editHplAccountHandler.validate(input);

    });

});
