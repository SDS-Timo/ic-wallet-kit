import { Principal } from "@dfinity/principal";
import { itForeach } from "@hpl/__tests_utils/itForeach";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { RemoveHplContactLinkHandler } from "@hpl/handlers/contacts/removeHplContactLinkHandler/removeHplContactLinkHandler";
import { HplContactRepository } from "@hpl/repositories/persists/hplContactRepository/hplContactRepository";

describe("Unit RemoveHplContactLinkHandler tests", () => {
    const testData = [
        {
            name: "RemoveHplContactLinkHandler: success",
            input: {
                principal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe"),
                linkId: "0"
            },
            result: {}
        }
    ]

    itForeach(testData, async (test) => {
        const logger = new MockLogger();
        const hplContactRepository = new (<new () => HplContactRepository><unknown>HplContactRepository)() as jest.Mocked<HplContactRepository>;
        hplContactRepository.removeContactLink = jest.fn().mockReturnValue(Promise.resolve(undefined));
        const removeHplContactLinkHandler = new RemoveHplContactLinkHandler(logger, hplContactRepository);
        const result = await removeHplContactLinkHandler.process(test.input);
        expect(result).toEqual(test.result);

        expect(hplContactRepository.removeContactLink).toHaveBeenCalledWith(
            test.input.principal.toString(), test.input.linkId);
    });
})
