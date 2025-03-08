import { itValidate } from "@hpl/__tests_utils/itValidate";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { testValidate, testValidateDefinition } from "@hpl/__tests_utils/testDefinition";
import { CheckLedgerPrincipalHandler } from "@hpl/handlers/checks/checkLedgerPrincipalHandler/checkLedgerPrincipalHandler";
import { getPropertyName, ValidationError } from "@ic-wallet-middleware/common";

describe("Unit CheckLedgerPrincipalHandler validate tests", () => {

    const valid = { ledgerPrincipal: "mock-principal" };



    const tests: testValidate<testValidateDefinition> =
    {
        name: "CheckLedgerPrincipalHandler validation success",
        tests: [
            {
                name: "CheckLedgerPrincipalHandler: Field ledgerPrincipal is required",
                input: {
                    key: getPropertyName(valid, v => v.ledgerPrincipal),
                    value: ""
                },
                result: {},
                error: new ValidationError("check.ledger.principal.ledgerPrincipal.is.required",
                    "ledgerPrincipal",
                    "Field ledgerPrincipal is required")

            }
        ]
    };

    itValidate(valid, {}, tests, async (input) => {

        const logger = new MockLogger();
        const identifierService = seedToIdentifierService("b");

        const editHplAssetHandler = new CheckLedgerPrincipalHandler(logger,
            identifierService
        );
        await editHplAssetHandler.validate(input);

    });

});
