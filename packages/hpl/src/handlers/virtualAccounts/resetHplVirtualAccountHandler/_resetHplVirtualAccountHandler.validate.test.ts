import { itValidate } from "@hpl/__tests_utils/itValidate";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@hpl/__tests_utils/testDefinition";
import { ResetHplVirtualAccountHandler } from "@hpl/handlers/virtualAccounts/resetHplVirtualAccountHandler/resetHplVirtualAccountHandler";
import { ResetHplVirtualAccountInternalHandler } from "@hpl/internalHandlers";
import { getPropertyName, ValidationError } from "@ic-wallet-middleware/common";



describe("Unit ResetHplVirtualAccountHandler validate tests", () => {

    const valid = {
        virtualAccountId: BigInt(1)
    };

    const validData = {
        exists: false
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "ResetHplVirtualAccountHandler validation success",
        tests: [
            {
                name: "ResetHplVirtualAccountHandler: Field virtualAccountId is required",
                input: {
                    key: getPropertyName(valid, v => v.virtualAccountId),
                    value: undefined
                },
                result: {},
                error: new ValidationError("reset.hpl.virtualAccount.virtualAccountId.is.required",
                    "virtualAccountId",
                    "Field virtualAccountId is required")

            }
        ]
    };

    itValidate(valid, validData, tests, async (input, validData) => {

        const logger = new MockLogger();

        const resetHplVirtualAccountInternalHandler = new (<new () => ResetHplVirtualAccountInternalHandler><unknown>ResetHplVirtualAccountInternalHandler)() as jest.Mocked<ResetHplVirtualAccountInternalHandler>;
        const resetHplVirtualAccountHandler = new ResetHplVirtualAccountHandler(logger, resetHplVirtualAccountInternalHandler);

        await resetHplVirtualAccountHandler.validate(input);

    });

});
