import { Principal } from "@dfinity/principal";
import { itValidate } from "@hpl/__tests_utils/itValidate";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@hpl/__tests_utils/testDefinition";
import { RemoveHplContactLinkForm } from "@hpl/forms";
import { RemoveHplContactLinkHandler } from "@hpl/handlers/contacts/removeHplContactLinkHandler/removeHplContactLinkHandler";
import { HplContactRepository } from "@hpl/repositories/persists/hplContactRepository/hplContactRepository";
import { getPropertyName, ValidationError } from "@ic-wallet-kit/common";



describe("Unit RemoveHplContactLinkHandler validate tests", () => {

    const valid: RemoveHplContactLinkForm = {
        principal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
        linkId: "1"
    };

    const validData = {
        exists: false
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "RemoveHplContactLinkHandler validation success",
        tests: [
            {
                name: "RemoveHplContactLinkHandler: Field principal is required",
                input: {
                    key: getPropertyName(valid, v => v.principal),
                    value: undefined
                },
                result: {},
                error: new ValidationError("removing.hpl.contact.link.principal.is.required",
                    "principal",
                    "Field principal is required")

            },
            {
                name: "RemoveHplContactLinkHandler: Field linkId is required",
                input: {
                    key: getPropertyName(valid, v => v.linkId),
                    value: ""
                },
                result: {},
                error: new ValidationError("removing.hpl.contact.link.linkId.is.required",
                    "linkId",
                    "Field linkId is required")

            }
        ]
    };

    itValidate(valid, validData, tests, async (input, validData) => {

        const logger = new MockLogger();

        const hplContactRepository = new (<new () => HplContactRepository><unknown>HplContactRepository)() as jest.Mocked<HplContactRepository>;
        hplContactRepository.removeContactLink = jest.fn().mockReturnValue(Promise.resolve(undefined));
        const removeHplContactLinkHandler = new RemoveHplContactLinkHandler(logger, hplContactRepository);

        await removeHplContactLinkHandler.validate(input);

    });

});
