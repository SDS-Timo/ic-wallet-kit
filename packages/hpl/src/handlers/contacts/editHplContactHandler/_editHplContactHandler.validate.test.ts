import { Principal } from "@dfinity/principal";
import { itValidate } from "@hpl/__tests_utils/itValidate";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@hpl/__tests_utils/testDefinition";
import { EditHplContactHandler } from "@hpl/handlers/contacts/editHplContactHandler/editHplContactHandler";
import { GetHplContactRemotesHandler } from "@hpl/internalHandlers";
import { HplContactRepository } from "@hpl/repositories/persists/hplContactRepository/hplContactRepository";
import { getPropertyName, ValidationError } from "@ic-wallet-kit/common";



describe("Unit EditHplContactHandler validate tests", () => {

    const valid = {
        contactName: "Test",
        principal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
        linkIds: []
    };

    const validData = {
        exists: false
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "EditHplContactHandler validation success",
        tests: [
            {
                name: "EditHplContactHandler: Field contactName is required",
                input: {
                    key: getPropertyName(valid, v => v.contactName),
                    value: ""
                },
                result: {},
                error: new ValidationError("editing.hpl.contact.name.is.required",
                    "contactName",
                    "Field contactName is required")
            },
            {
                name: "EditHplContactHandler: Field principal is required",
                input: {
                    key: getPropertyName(valid, v => v.principal),
                    value: ""
                },
                result: {},
                error: new ValidationError("editing.hpl.contact.principal.is.required",
                    "principal",
                    "Field principal is required")
            }
        ]
    };

    itValidate(valid, validData, tests, async (input, validData) => {

        const logger = new MockLogger();
        const getHplContactRemotesHandler = new (<new () => GetHplContactRemotesHandler><unknown>GetHplContactRemotesHandler)() as jest.Mocked<GetHplContactRemotesHandler>;
        const hplContactRepository = new (<new () => HplContactRepository><unknown>HplContactRepository)() as jest.Mocked<HplContactRepository>;
        const editHplContactHandler = new EditHplContactHandler(logger, hplContactRepository, getHplContactRemotesHandler);

        await editHplContactHandler.validate(input);
    });

});
