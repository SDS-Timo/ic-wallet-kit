import { itValidate } from "@hpl/__tests_utils/itValidate";
import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { testValidate, testValidateDefinition } from "@hpl/__tests_utils/testDefinition";
import { CheckLinkCodeForm } from "@hpl/forms";
import { CheckLinkCodeHandler } from "@hpl/handlers/virtualAccounts/checkLinkCodeHandler/checkLinkCodeHandler";
import { HplAssetRepository } from "@hpl/repositories";
import { getPropertyName, ValidationError } from "@ic-wallet-middleware/common";



describe("Unit CheckLinkCodeHandler validate tests", () => {

    const valid: CheckLinkCodeForm = {
        linkCode: "043",
    };

    const validData = {
        exists: false
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "CheckLinkCodeHandler validation success",
        tests: [
            {
                name: "CheckLinkCodeHandler: Field linkCode is required",
                input: {
                    key: getPropertyName(valid, v => v.linkCode),
                    value: ""
                },
                result: {},
                error: new ValidationError("check.code.linkCode.is.required",
                    "amount",
                    "Field linkCode is required")

            }
        ]
    };

    itValidate(valid, validData, tests, async (input) => {
        const logger = new MockLogger();
        const identifierService = seedToIdentifierService("b");
        const hplAssetRepository = new (<new () => HplAssetRepository><unknown>HplAssetRepository)() as jest.Mocked<HplAssetRepository>;

        const checkLinCodeHandler = new CheckLinkCodeHandler(logger,
            identifierService,
            mockCanisterService,
            hplAssetRepository
        );

        await checkLinCodeHandler.validate(input);

    });

});