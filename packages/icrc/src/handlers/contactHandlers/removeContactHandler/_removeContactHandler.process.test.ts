import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockPrincipal } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { RemoveContactHandler } from "@icrc/handlers/contactHandlers/removeContactHandler/removeContactHandler";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { RemoveContactForm } from "@icrc/types/contacts/removeContactForm";

describe("RemoveContactHandler Process Tests", () => {

    const validForm: RemoveContactForm = {
        principal: mockPrincipal,
    };

    const tests: testDefinition[] = [
        {
            name: "RemoveContactHandler: Successfully removes contact",
            input: { ...validForm },
            result: {},
        },
        {
            name: "RemoveContactHandler: Fails to remove contact",
            input: { ...validForm },
            data: {
                removeContact: jest.fn().mockRejectedValue(new Error("Remove failed")),
            },
            error: new Error("Remove failed"),
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const contactRepository = new (<new () => ContactRepository><unknown>ContactRepository)() as jest.Mocked<ContactRepository>;

        contactRepository.removeContact = jest.fn().mockResolvedValue(undefined);

        if (test.data?.removeContact) {
            contactRepository.removeContact = test.data.removeContact;
        }

        const handler = new RemoveContactHandler(logger, contactRepository);

        const result = await handler.process(test.input);
        expect(result).toEqual(test.result);

        expect(contactRepository.removeContact).toHaveBeenCalledWith(test.input.principal);

    });
});
