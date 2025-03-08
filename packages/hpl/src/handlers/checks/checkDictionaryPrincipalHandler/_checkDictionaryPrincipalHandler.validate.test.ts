import { itValidate } from "@hpl/__tests_utils/itValidate";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { testValidate, testValidateDefinition } from "@hpl/__tests_utils/testDefinition";
import { CheckDictionaryPrincipalHandler } from "@hpl/handlers/checks/checkDictionaryPrincipalHandler/checkDictionaryPrincipalHandler";
import { getPropertyName, ValidationError } from "@ic-wallet-kit/common";

describe("Unit CheckDictionaryPrincipalHandler validate tests", () => {

    const valid = { dictionaryPrincipal: "mock-principal" };



    const tests: testValidate<testValidateDefinition> =
    {
        name: "CheckDictionaryPrincipalHandler validation success",
        tests: [
            {
                name: "CheckDictionaryPrincipalHandler: Field dictionaryPrincipal is required",
                input: {
                    key: getPropertyName(valid, v => v.dictionaryPrincipal),
                    value: ""
                },
                result: {},
                error: new ValidationError("check.dictionary.principal.dictionaryPrincipal.is.required",
                    "dictionaryPrincipal",
                    "Field dictionaryPrincipal is required")

            }
        ]
    };

    itValidate(valid, {}, tests, async (input) => {

        const logger = new MockLogger();
        const identifierService = seedToIdentifierService("b");

        const editHplAssetHandler = new CheckDictionaryPrincipalHandler(logger,
            identifierService
        );
        await editHplAssetHandler.validate(input);

    });

});
