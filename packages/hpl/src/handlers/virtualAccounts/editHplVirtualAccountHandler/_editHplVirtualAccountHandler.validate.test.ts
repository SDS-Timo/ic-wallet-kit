import { itValidate } from "@hpl/__tests_utils/itValidate";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@hpl/__tests_utils/testDefinition";
import { EditHplVirtualAccountForm } from "@hpl/forms";
import { EditHplVirtualAccountHandler } from "@hpl/handlers/virtualAccounts/editHplVirtualAccountHandler/editHplVirtualAccountHandler";
import { EditHplVirtualAccountInternalHandler } from "@hpl/internalHandlers";
import { HplVirtualAccountRepository } from "@hpl/repositories";
import { getPropertyName, ValidationError } from "@ic-wallet-middleware/common";



describe("Unit EditHplVirtualAccountHandler validate tests", () => {

    const valid: EditHplVirtualAccountForm = {
        accountId: 1n,
        virtualAccountId: 1n,
        virtualAccountName: "Test VA",
        amount: 2n
    };

    const validData = {
        exists: false
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "EditHplVirtualAccountHandler validation success",
        tests: [
            {
                name: "EditHplVirtualAccountHandler: Field accountId is required",
                input: {
                    key: getPropertyName(valid, v => v.accountId),
                    value: undefined
                },
                result: {},
                error: new ValidationError("editing.hpl.virtual.account.accountId.is.required",
                    "accountId",
                    "Field accountId is required")

            },
            {
                name: "EditHplVirtualAccountHandler: Field virtualAccountId is required",
                input: {
                    key: getPropertyName(valid, v => v.virtualAccountId),
                    value: undefined
                },
                result: {},
                error: new ValidationError("editing.hpl.virtual.account.virtualAccountId.is.required",
                    "virtualAccountId",
                    "Field virtualAccountId is required")

            },
            {
                name: "EditHplVirtualAccountHandler: Field amount is required",
                input: {
                    key: getPropertyName(valid, v => v.amount),
                    value: undefined
                },
                result: {},
                error: new ValidationError("editing.hpl.virtual.account.amount.is.required",
                    "amount",
                    "Field amount is required")

            }
        ]
    };

    itValidate(valid, validData, tests, async (input, validData) => {

        const logger = new MockLogger();

        const editHplVirtualAccountInternalHandler = new (<new () => EditHplVirtualAccountInternalHandler><unknown>EditHplVirtualAccountInternalHandler)() as jest.Mocked<EditHplVirtualAccountInternalHandler>;
        const hplVirtualAccountRepository = new (<new () => HplVirtualAccountRepository><unknown>HplVirtualAccountRepository)() as jest.Mocked<HplVirtualAccountRepository>;

        const editHplVirtualAccountHandler = new EditHplVirtualAccountHandler(logger,
            editHplVirtualAccountInternalHandler,
            hplVirtualAccountRepository
        );

        await editHplVirtualAccountHandler.validate(input);

    });

});
