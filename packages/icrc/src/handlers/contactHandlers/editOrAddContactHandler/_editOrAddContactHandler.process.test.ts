import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockOwnerPrincipalString } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { EditOrAddContactHandler } from "@icrc/handlers/contactHandlers/editOrAddContactHandler/editOrAddContactHandler";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { ContactModel } from "@icrc/types";
import { EditContactForm } from "@icrc/types/contacts/editContactForm";

describe("EditOrAddContactHandler Process Tests", () => {

    const validForm: EditContactForm = {
        name: "Test Contact",
        principal: mockOwnerPrincipalString(),
    };

    const tests: testDefinition[] = [
        {
            name: "EditOrAddContactHandler: Adds a new contact if it does not exist",
            input: { ...validForm },
            data: {
                isContactExist: false,
            },
            result: {},
        },
        {
            name: "EditOrAddContactHandler: Updates contact name if it exists",
            input: { ...validForm },
            data: {
                isContactExist: true,
            },
            result: {},
        },
        {
            name: "EditOrAddContactHandler: Fails to add or update contact",
            input: { ...validForm },
            data: {
                isContactExist: false,
                addContact: jest.fn().mockRejectedValue(new Error("Failed to add contact")),
            },
            error: new Error("Failed to add contact"),
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const contactRepository = new (<new () => ContactRepository><unknown>ContactRepository)() as jest.Mocked<ContactRepository>;

        contactRepository.isContactExist = jest.fn().mockResolvedValue(test.data?.isContactExist ?? true);
        contactRepository.addContact = jest.fn().mockResolvedValue(undefined);
        contactRepository.updateContactName = jest.fn().mockResolvedValue(undefined);

        if (test.data?.addContact) {
            contactRepository.addContact = test.data.addContact;
        }
        if (test.data?.updateContactName) {
            contactRepository.updateContactName = test.data.updateContactName;
        }

        const handler = new EditOrAddContactHandler(logger, contactRepository);


        const result = await handler.process(test.input);
        expect(result).toEqual(test.result);

        if (test.data?.isContactExist) {
            expect(contactRepository.updateContactName).toHaveBeenCalledWith(test.input.principal, test.input.name);
        } else {
            expect(contactRepository.addContact).toHaveBeenCalledWith({
                name: test.input.name,
                principal: test.input.principal,
                assets: [],
            } as ContactModel);
        }

    });
});
