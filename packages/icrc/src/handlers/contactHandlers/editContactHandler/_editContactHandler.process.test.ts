import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockSpenderPrincipalString } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { EditContactHandler } from "@icrc/handlers/contactHandlers/editContactHandler/editContactHandler";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { EditContactForm } from "@icrc/types/contacts/editContactForm";


describe("EditContactHandler Process Tests", () => {

    const validForm: EditContactForm = {
        name: "Updated Contact Name",
        principal: mockSpenderPrincipalString(),
    };

    const tests: testDefinition[] = [
        {
            name: "EditContactHandler: Successfully updates contact name",
            input: { ...validForm },
            result: {},
        },
        {
            name: "EditContactHandler: Fails to update contact name",
            input: { ...validForm },
            data: {
                updateContactName: jest.fn().mockRejectedValue(new Error("Update failed")),
            },
            error: new Error("Update failed"),
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const contactRepository = new (<new () => ContactRepository><unknown>ContactRepository)() as jest.Mocked<ContactRepository>;

        contactRepository.updateContactName = jest.fn().mockResolvedValue(undefined);

        if (test.data?.updateContactName) {
            contactRepository.updateContactName = test.data.updateContactName;
        }

        const editContactHandler = new EditContactHandler(logger, contactRepository);

        const result = await editContactHandler.process(test.input);
        expect(result).toEqual(test.result);

        expect(contactRepository.updateContactName).toHaveBeenCalledWith(test.input.principal, test.input.name);

    });
});
