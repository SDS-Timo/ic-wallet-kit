import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockLedgerAddress, mockPrincipal } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { RemoveSubAccountContactHandler } from "@icrc/handlers/contactHandlers/removeSubAccountContactHandler/removeSubAccountContactHandler";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { SubAccountId } from "@icrc/types";
import { RemoveSubAccountContactForm } from "@icrc/types/contacts/removeSubAccountContactForm";

describe("RemoveSubAccountContactHandler Process Tests", () => {

    const validForm: RemoveSubAccountContactForm = {
        principal: mockPrincipal,
        ledgerAddress: mockLedgerAddress,
        subAccountId: SubAccountId.parseFromString("0x1")
    };

    const tests: testDefinition[] = [
        {
            name: "RemoveSubAccountContactHandler: Successfully removes sub-account contact",
            input: { ...validForm },
            result: {},
        },
        {
            name: "RemoveSubAccountContactHandler: Fails to remove sub-account contact",
            input: { ...validForm },
            data: {
                removeSubAccountContact: jest.fn().mockRejectedValue(new Error("Remove failed")),
            },
            error: new Error("Remove failed"),
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const contactRepository = new (<new () => ContactRepository><unknown>ContactRepository)() as jest.Mocked<ContactRepository>;

        contactRepository.removeSubAccountContact = jest.fn().mockResolvedValue(undefined);

        if (test.data?.removeSubAccountContact) {
            contactRepository.removeSubAccountContact = test.data.removeSubAccountContact;
        }

        const handler = new RemoveSubAccountContactHandler(logger, contactRepository);

        const result = await handler.process(test.input);
        expect(result).toEqual(test.result);

        expect(contactRepository.removeSubAccountContact).toHaveBeenCalledWith(test.input);
    });
});
