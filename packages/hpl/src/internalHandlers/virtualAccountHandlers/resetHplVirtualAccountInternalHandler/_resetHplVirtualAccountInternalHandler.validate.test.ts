import { itValidate } from "@hpl/__tests_utils/itValidate";
import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { testValidate, testValidateDefinition } from "@hpl/__tests_utils/testDefinition";
import { HplVirtualAccountStateCacheDataHandler, ResetHplVirtualAccountInternalHandler } from "@hpl/internalHandlers";
import { getPropertyName, ValidationError } from "@ic-wallet-middleware/common";



describe("Unit ResetHplVirtualAccountInternalHandler validate tests", () => {

    const valid = {
        virtualAccountId: 1n
    };

    const validData = {
        exists: false
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "ResetHplVirtualAccountInternalHandler validation success",
        tests: [
            {
                name: "ResetHplVirtualAccountInternalHandler: Field virtualAccountId is required",
                input: {
                    key: getPropertyName(valid, v => v.virtualAccountId),
                    value: undefined
                },
                result: {},
                error: new ValidationError("Reset.hpl.virtual.account.internal.virtualAccountId.is.required",
                    "virtualAccountId",
                    "Field virtualAccountId is required")

            }
        ]
    };

    itValidate(valid, validData, tests, async (input) => {
        const logger = new MockLogger();
        const identifierService = await seedToIdentifierService("b");
        const hplVirtualAccountStateCacheDataHandler = new (<new () => HplVirtualAccountStateCacheDataHandler><unknown>HplVirtualAccountStateCacheDataHandler)() as jest.Mocked<HplVirtualAccountStateCacheDataHandler>;
        const resetHplVirtualAccountInternalHandler = new ResetHplVirtualAccountInternalHandler(
            logger,
            identifierService,
            mockCanisterService,
            hplVirtualAccountStateCacheDataHandler
        );

        await resetHplVirtualAccountInternalHandler.validate(input);

    });

});
