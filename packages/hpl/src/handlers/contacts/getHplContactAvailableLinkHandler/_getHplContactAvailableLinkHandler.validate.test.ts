import { Principal } from "@dfinity/principal";
import { itValidate } from "@hpl/__tests_utils/itValidate";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { testValidate, testValidateDefinition } from "@hpl/__tests_utils/testDefinition";
import { GetHplContactAvailableLinkInfo } from "@hpl/forms";
import { GetHplContactAvailableLinkHandler } from "@hpl/handlers/contacts/getHplContactAvailableLinkHandler/getHplContactAvailableLinkHandler";
import { GetHplContactRemotesHandler } from "@hpl/internalHandlers";
import { getPropertyName, LoadType, ValidationError } from "@ic-wallet-middleware/common";



describe("Unit GetHplContactAvailableLinkHandler validate tests", () => {

    const valid: GetHplContactAvailableLinkInfo = {
        loadType: LoadType.Full,
        principal: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe")
    };

    const validData = {
        exists: false
    };

    const tests: testValidate<testValidateDefinition> =
    {
        name: "GetHplContactAvailableLinkHandler validation success",
        tests: [
            {
                name: "GetHplContactAvailableLinkHandler: Field principal is required",
                input: {
                    key: getPropertyName(valid, v => v.principal),
                    value: ""
                },
                result: {},
                error: new ValidationError("get.hpl.contact.available.link.principal.is.required",
                    "principal",
                    "Field principal is required")

            }
        ]
    };

    itValidate(valid, validData, tests, async (input) => {

        const logger = new MockLogger();

        const getHplContactRemotesHandler = new (<new () => GetHplContactRemotesHandler><unknown>GetHplContactRemotesHandler)() as jest.Mocked<GetHplContactRemotesHandler>;

        const getHplContactAvailableLinkHandler = new GetHplContactAvailableLinkHandler(logger,
            getHplContactRemotesHandler
        );

        await getHplContactAvailableLinkHandler.validate(input);

    });

});
