import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockLedgerAddress, mockPrincipal } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { RemoveAssetContactHandler } from "@icrc/handlers/contactHandlers/removeAssetContactHandler/removeAssetContactHandler";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { RemoveAssetContactForm } from "@icrc/types/contacts/removeAssetContactForm";


describe("RemoveAssetContactHandler Process Tests", () => {
    const validForm: RemoveAssetContactForm = {
        principal: mockPrincipal,
        ledgerAddress: mockLedgerAddress,
    };

    const tests: testDefinition[] = [
        {
            name: "RemoveAssetContactHandler: Successfully removes asset contact",
            input: { ...validForm },
            result: {},
        },
        {
            name: "RemoveAssetContactHandler: Fails to remove asset contact",
            input: { ...validForm },
            data: {
                removeAssetContact: jest.fn().mockRejectedValue(new Error("Remove failed")),
            },
            error: new Error("Remove failed"),
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const contactRepository = new (<new () => ContactRepository><unknown>ContactRepository)() as jest.Mocked<ContactRepository>;

        contactRepository.removeAssetContact = jest.fn().mockResolvedValue(undefined);

        if (test.data?.removeAssetContact) {
            contactRepository.removeAssetContact = test.data.removeAssetContact;
        }

        const handler = new RemoveAssetContactHandler(logger, contactRepository);


        const result = await handler.process(test.input);
        expect(result).toEqual(test.result);

        expect(contactRepository.removeAssetContact).toHaveBeenCalledWith(test.input);

    });
});
