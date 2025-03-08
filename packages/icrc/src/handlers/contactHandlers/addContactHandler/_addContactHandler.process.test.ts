import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockLedgerAddress, mockOwnerPrincipalString } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { AddContactHandler } from "@icrc/handlers/contactHandlers/addContactHandler/addContactHandler";
import { AssetRepository } from "@icrc/repositories";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { SubAccountId } from "@icrc/types";
import { AddContactForm } from "@icrc/types/contacts/addContactForm";
import { AssetContactForm } from "@icrc/types/contacts/assetContactForm";
import { SubAccountContactForm } from "@icrc/types/contacts/subAccountContactForm";

jest.mock("@icrc/repositories");


describe("AddContactHandler Process Tests", () => {

    const validSubAccount: SubAccountContactForm = {
        name: "SubAccount Name",
        subAccountId: SubAccountId.Default(),
    };

    const validAsset: AssetContactForm = {
        ledgerAddress: mockLedgerAddress,
        subAccounts: [validSubAccount],
    };

    const validForm: AddContactForm = {
        name: "Test Contact",
        principal: mockOwnerPrincipalString(),
        assets: [validAsset],
    };

    const tests: testDefinition[] = [
        {
            name: "AddContactHandler: Successfully adds contact",
            input: { ...validForm },
            result: {},
        },
        {
            name: "AddContactHandler: Fails to add contact",
            input: { ...validForm },
            data: {
                addContact: jest.fn().mockRejectedValue(new Error("Add contact failed")),
            },
            error: new Error("Add contact failed"),
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const contactRepository = new (<new () => ContactRepository><unknown>ContactRepository)() as jest.Mocked<ContactRepository>;
        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;

        contactRepository.addContact = jest.fn().mockResolvedValue(undefined);

        if (test.data?.addContact) {
            contactRepository.addContact = test.data.addContact;
        }

        const addContactHandler = new AddContactHandler(logger, contactRepository, assetRepository);

        const result = await addContactHandler.process(test.input);
        expect(result).toEqual(test.result);

        expect(contactRepository.addContact).toHaveBeenCalledWith({
            name: test.input.name,
            principal: test.input.principal,
            assets: test.input.assets.map((a: any) => ({
                ledgerAddress: a.ledgerAddress,
                subAccounts: a.subAccounts.map((sa: any) => ({
                    name: sa.name,
                    subAccountId: sa.subAccountId.toString(),
                }))
            }))
        });

    });
});
