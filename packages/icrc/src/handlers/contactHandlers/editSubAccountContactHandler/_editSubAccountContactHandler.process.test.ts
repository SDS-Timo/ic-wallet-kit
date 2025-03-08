import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockLedgerAddress, mockSpenderPrincipalString } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { EditSubAccountContactHandler } from "@icrc/handlers/contactHandlers/editSubAccountContactHandler/editSubAccountContactHandler";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { SubAccountId } from "@icrc/types";
import { EditSubAccountContactForm } from "@icrc/types/contacts/editSubAccountContactForm";

describe("EditSubAccountContactHandler Process Tests", () => {


    const validForm: EditSubAccountContactForm = {
        principal: mockSpenderPrincipalString(),
        ledgerAddress: mockLedgerAddress,
        oldSubAccountId: SubAccountId.parseFromString("0x1"),
        newSubAccountId: SubAccountId.parseFromString("0x2"),
        newSubAccountName: "Updated SubAccount Name",
    };

    const tests: testDefinition[] = [
        {
            name: "EditSubAccountContactHandler: Successfully updates sub-account contact",
            input: { ...validForm },
            result: {},
        },
        {
            name: "EditSubAccountContactHandler: Fails to update sub-account contact",
            input: { ...validForm },
            data: {
                updateSubAccountContact: jest.fn().mockRejectedValue(new Error("Update failed")),
            },
            error: new Error("Update failed"),
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const contactRepository = new (<new () => ContactRepository><unknown>ContactRepository)() as jest.Mocked<ContactRepository>;

        contactRepository.updateSubAccountContact = jest.fn().mockResolvedValue(undefined);

        if (test.data?.updateSubAccountContact) {
            contactRepository.updateSubAccountContact = test.data.updateSubAccountContact;
        }

        const handler = new EditSubAccountContactHandler(logger, contactRepository);

        const result = await handler.process(test.input);
        expect(result).toEqual(test.result);

        expect(contactRepository.updateSubAccountContact).toHaveBeenCalledWith(test.input);
    });
});
