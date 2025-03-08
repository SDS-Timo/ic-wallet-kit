import { Principal } from "@dfinity/principal";
import { itValidate } from "@hpl/__tests_utils/itValidate";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@hpl/__tests_utils/testDefinition";
import { AddHplContactRemotesHandler } from "@hpl/handlers/contacts/addHplContactRemotesHandler/addHplContactRemotesHandler";
import { GetHplContactRemotesHandler } from "@hpl/internalHandlers";
import { HplContactRepository } from "@hpl/repositories/persists/hplContactRepository/hplContactRepository";
import { getPropertyName, ValidationError } from "@ic-wallet-kit/common";



describe("Unit AddHplContactRemotesHandler validate tests", () => {

    const valid = {
        contactPrincipal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
        linkIds: []
    };

    const validData = {
        exists: false
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "AddHplContactRemotesHandler validation success",
        tests: [
            {
                name: "AddHplContactRemotesHandler: Field principal is required",
                input: {
                    key: getPropertyName(valid, v => v.contactPrincipal),
                    value: ""
                },
                result: {},
                error: new ValidationError("adding.hpl.contact.remotes.principal.is.required",
                    "contactPrincipal",
                    "Field contactPrincipal is required")
            }
        ]
    };

    itValidate(valid, validData, tests, async (input, validData) => {

        const logger = new MockLogger();

        const getHplContactRemotesHandler = new (<new () => GetHplContactRemotesHandler><unknown>GetHplContactRemotesHandler)() as jest.Mocked<GetHplContactRemotesHandler>;
        const hplContactRepository = new (<new () => HplContactRepository><unknown>HplContactRepository)() as jest.Mocked<HplContactRepository>;

        const addHplContactRemotesHandler = new AddHplContactRemotesHandler(logger,
            hplContactRepository,
            getHplContactRemotesHandler
        );

        await addHplContactRemotesHandler.validate(input);

    });

});
