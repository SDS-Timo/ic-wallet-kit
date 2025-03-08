import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockLedgerAddress, mockSpenderPrincipalString } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { AddAssetContactHandler } from "@icrc/handlers/contactHandlers/addAssetContactHandler/addAssetContactHandler";
import { AssetRepository } from "@icrc/repositories";
import { ContactRepository } from "@icrc/repositories/persists/contactRepository/contactRepository";
import { AddAssetContactForm } from "@icrc/types/contacts/addAssetContactForm";


describe("AddAssetContactHandler Process Tests", () => {


    const validForm: AddAssetContactForm = {
        ledgerAddress: mockLedgerAddress,
        principal: mockSpenderPrincipalString(),
    };

    const tests: testDefinition[] = [
        {
            name: "AddAssetContactHandler: Successfully adds asset contact",
            input: { ...validForm },
            result: {},
        },
        {
            name: "AddAssetContactHandler: Fails to add asset contact",
            input: { ...validForm },
            data: {
                addAssetContact: jest.fn().mockRejectedValue(new Error("Add contact failed")),
            },
            error: new Error("Add contact failed"),
        },
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const assetRepository = new (<new () => AssetRepository><unknown>AssetRepository)() as jest.Mocked<AssetRepository>;
        const contactRepository = new (<new () => ContactRepository><unknown>ContactRepository)() as jest.Mocked<ContactRepository>;

        contactRepository.addAssetContact = jest.fn().mockResolvedValue(undefined);

        if (test.data?.addAssetContact) {
            contactRepository.addAssetContact = test.data.addAssetContact;
        }

        const addAssetContactHandler = new AddAssetContactHandler(logger, contactRepository, assetRepository);

        const result = await addAssetContactHandler.process(test.input);
        expect(result).toEqual(test.result);

        expect(contactRepository.addAssetContact).toHaveBeenCalledWith(test.input);

    });
});
