import { itValidate } from "@hpl/__tests_utils/itValidate";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@hpl/__tests_utils/testDefinition";
import { DeleteHplVirtualAccountForm } from "@hpl/forms";
import { DeleteHplVirtualAccountHandler } from "@hpl/handlers/virtualAccounts/deleteHplVirtualAccountHandler/deleteHplVirtualAccountHandler";
import { DeleteHplVirtualAccountInternalHandler } from "@hpl/internalHandlers";
import { HplVirtualAccountRepository } from "@hpl/repositories";
import { getPropertyName, ValidationError } from "@ic-wallet-kit/common";



describe("Unit DeleteHplVirtualAccountHandler validate tests", () => {

    const valid: DeleteHplVirtualAccountForm = {
        virtualAccountId: 1n
    };

    const validData = {
        exists: false
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "DeleteHplVirtualAccountHandler validation success",
        tests: [
            {
                name: "DeleteHplVirtualAccountHandler: Field virtualAccountId is required",
                input: {
                    key: getPropertyName(valid, v => v.virtualAccountId),
                    value: undefined
                },
                result: {},
                error: new ValidationError("removing.hpl.virtualAccount.virtualAccountId.is.required",
                    "virtualAccountId",
                    "Field virtualAccountId is required")

            }
        ]
    };

    itValidate(valid, validData, tests, async (input, validData) => {

        const logger = new MockLogger();

        const deleteHplVirtualAccountInternalHandler = new (<new () => DeleteHplVirtualAccountInternalHandler><unknown>DeleteHplVirtualAccountInternalHandler)() as jest.Mocked<DeleteHplVirtualAccountInternalHandler>;
        const hplVirtualAccountRepository = new (<new () => HplVirtualAccountRepository><unknown>HplVirtualAccountRepository)() as jest.Mocked<HplVirtualAccountRepository>;
        const deleteHplVirtualAccountHandler = new DeleteHplVirtualAccountHandler(logger, deleteHplVirtualAccountInternalHandler, hplVirtualAccountRepository);

        await deleteHplVirtualAccountHandler.validate(input);

    });

});
