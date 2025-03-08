import { Principal } from "@dfinity/principal";
import { itValidate } from "@hpl/__tests_utils/itValidate";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@hpl/__tests_utils/testDefinition";
import { RemoveHplContactForm } from "@hpl/forms";
import { RemoveHplContactHandler } from "@hpl/handlers/contacts/removeHplContactHandler/removeHplContactHandler";
import { HplContactRepository } from "@hpl/repositories/persists/hplContactRepository/hplContactRepository";
import { getPropertyName, ValidationError } from "@ic-wallet-kit/common";



describe("Unit RemoveHplContactHandler validate tests", () => {

    const valid: RemoveHplContactForm = {
        principal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe")
    };

    const validData = {
        exists: false
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "RemoveHplContactHandler validation success",
        tests: [
            {
                name: "RemoveHplContactHandler: Field principal is required",
                input: {
                    key: getPropertyName(valid, v => v.principal),
                    value: ""
                },
                result: {},
                error: new ValidationError("removing.hpl.contact.principal.is.required",
                    "principal",
                    "Field principal is required")

            }
        ]
    };

    itValidate(valid, validData, tests, async (input, validData) => {

        const logger = new MockLogger();

        const hplContactRepository = new (<new () => HplContactRepository><unknown>HplContactRepository)() as jest.Mocked<HplContactRepository>;
        const removeHplContactHandler = new RemoveHplContactHandler(logger, hplContactRepository);

        await removeHplContactHandler.validate(input);

    });

});
