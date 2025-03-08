import { Principal } from "@dfinity/principal";
import { itForeach } from "@hpl/__tests_utils/itForeach";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { RemoveHplContactHandler } from "@hpl/handlers/contacts/removeHplContactHandler/removeHplContactHandler";
import { HplContactRepository } from "@hpl/repositories/persists/hplContactRepository/hplContactRepository";

describe("Unit RemoveHplContactHandler tests", () => {
    const testData = [
        {
            name: "RemoveHplContactHandler: success",
            input: {
                principal: Principal.fromText("lprj7-waklu-335mt-2nt4k-2gpby-emi7t-h6d5h-d2mgk-3xyes-2o7nj-4qe")
            },
            result: {}
        },
    ]

    itForeach(testData, async (test) => {
        const logger = new MockLogger();
        const hplContactRepository = new (<new () => HplContactRepository><unknown>HplContactRepository)() as jest.Mocked<HplContactRepository>;
        hplContactRepository.removeContact = jest.fn().mockReturnValue(Promise.resolve(undefined));
        const removeHplContactHandler = new RemoveHplContactHandler(logger, hplContactRepository);
        const result = await removeHplContactHandler.process(test.input);
        expect(result).toEqual(test.result);

        expect(hplContactRepository.removeContact).toHaveBeenCalledWith(
            test.input.principal.toString());
    });
})
