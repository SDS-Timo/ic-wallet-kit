import { itValidate } from "@hpl/__tests_utils/itValidate";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@hpl/__tests_utils/testDefinition";
import { AddHplAccountHandler } from "@hpl/handlers/accounts/addHplAccountHandler/addHplAccountHandler";
import { AddHplAccountInternalHandler } from "@hpl/internalHandlers";
import { HplAccountRepository } from "@hpl/repositories";
import { getPropertyName, ValidationError } from "@ic-wallet-kit/common";



describe("Unit AddHplAccountHandler validate tests", () => {

    const valid = {
        assetId: 1n,
        accountName: "Test"
    };

    const validData = {
        exists: false
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "AddHplAccountHandler validation success",
        tests: [
            {
                name: "AddHplAccountHandler: Field assetId is required",
                input: {
                    key: getPropertyName(valid, v => v.assetId),
                    value: undefined
                },
                result: {},
                error: new ValidationError("adding.hpl.account.assetId.is.required",
                    "assetId",
                    "Field assetId is required")

            }
        ]
    };

    itValidate(valid, validData, tests, async (input, validData) => {

        const logger = new MockLogger();

        const addHplAccountInternalHandler = new (<new () => AddHplAccountInternalHandler><unknown>AddHplAccountInternalHandler)() as jest.Mocked<AddHplAccountInternalHandler>;
        const hplAccountRepository = new (<new () => HplAccountRepository><unknown>HplAccountRepository)() as jest.Mocked<HplAccountRepository>;


        const addHplAccountHandler = new AddHplAccountHandler(logger,
            addHplAccountInternalHandler,
            hplAccountRepository
        );

        await addHplAccountHandler.validate(input);

    });

});
