import { ValidationError } from "@ic-wallet-kit/common";
import { ContactRepository } from "@icrc/repositories";
import { IContactDataStorage } from "@icrc/storage/contactDataStorage/contactDataStorage";
import { AddAssetContactForm, EditSubAccountContactForm, RemoveAssetContactForm, RemoveSubAccountContactForm, SubAccountId } from "@icrc/types";
import { AddSubAccountContactForm } from "@icrc/types/contacts/addSubAccountContactForm";
import { ContactModel } from "@icrc/types/contacts/contactModel";

describe("ContactRepository Tests", () => {
    let contactDataStorage: jest.Mocked<IContactDataStorage>;
    let contactRepository: ContactRepository;

    let mockContact: ContactModel = {
        principal: "mock-principal",
        name: "Mock Contact",
        assets: [
            {
                ledgerAddress: "mock-ledger-address",
                subAccounts: [],
            },
        ],
    };

    beforeEach(() => {
        contactDataStorage = {
            getItems: jest.fn(),
            getItem: jest.fn(),
            addItem: jest.fn(),
            updateItem: jest.fn(),
            deleteItem: jest.fn(),
            updateItems: jest.fn(),
            addItems: jest.fn(),
            collectionName: "IContactDataStorage"
        } as jest.Mocked<IContactDataStorage>;

        contactRepository = new ContactRepository(contactDataStorage);

        mockContact = {
            principal: "mock-principal",
            name: "Mock Contact",
            assets: [
                {
                    ledgerAddress: "mock-ledger-address",
                    subAccounts: [],
                },
            ],
        }

        jest.clearAllMocks();
    });

    it("ContactRepository: should return all contacts", async () => {
        contactDataStorage.getItems.mockResolvedValue([mockContact]);

        const result = await contactRepository.getContacts();

        expect(contactDataStorage.getItems).toHaveBeenCalled();
        expect(result).toEqual([mockContact]);
    });

    it("ContactRepository: should add a contact", async () => {
        await contactRepository.addContact(mockContact);

        expect(contactDataStorage.addItem).toHaveBeenCalledWith(mockContact);
    });

    it("ContactRepository: should update a contact name", async () => {
        contactDataStorage.getItem.mockResolvedValue(mockContact);

        const result = await contactRepository.updateContactName(mockContact.principal, "Updated Name");

        expect(contactDataStorage.getItem).toHaveBeenCalledWith(mockContact.principal);
        expect(contactDataStorage.updateItem).toHaveBeenCalledWith({ ...mockContact, name: "Updated Name" });
        expect(result.name).toEqual("Updated Name");
    });

    it("ContactRepository: should remove a contact by principal", async () => {
        await contactRepository.removeContact(mockContact.principal);

        expect(contactDataStorage.deleteItem).toHaveBeenCalledWith(mockContact.principal);
    });

    it("ContactRepository: should add an asset to a contact", async () => {
        contactDataStorage.getItem.mockResolvedValue(mockContact);

        const form: AddAssetContactForm = { principal: mockContact.principal, ledgerAddress: "new-ledger-address" };
        const updatedContact = { ...mockContact, assets: [...mockContact.assets, { ledgerAddress: "new-ledger-address", subAccounts: [] }] };

        const result = await contactRepository.addAssetContact(form);

        expect(contactDataStorage.getItem).toHaveBeenCalledWith(mockContact.principal);
        expect(contactDataStorage.updateItem).toHaveBeenCalledWith(updatedContact);
        expect(result.assets).toContainEqual({ ledgerAddress: "new-ledger-address", subAccounts: [] });
    });

    it("ContactRepository: should throw error when adding an existing asset", async () => {
        contactDataStorage.getItem.mockResolvedValue(mockContact);

        const form: AddAssetContactForm = { principal: mockContact.principal, ledgerAddress: "mock-ledger-address" };

        await expect(contactRepository.addAssetContact(form)).rejects.toThrow(ValidationError);
    });

    it("ContactRepository: should remove an asset from a contact", async () => {

        jest.clearAllMocks();

        contactDataStorage.getItem.mockResolvedValue(mockContact);

        const form: RemoveAssetContactForm = { principal: mockContact.principal, ledgerAddress: "mock-ledger-address" };
        const updatedContact = { ...mockContact, assets: [] };

        const result = await contactRepository.removeAssetContact(form);

        expect(contactDataStorage.updateItem).toHaveBeenCalledWith(updatedContact);
        expect(result.assets).toHaveLength(0);
    });

    it("ContactRepository: should add a subaccount to an asset", async () => {

        contactDataStorage.getItem.mockResolvedValue(mockContact);

        const form: AddSubAccountContactForm = {
            principal: mockContact.principal,
            ledgerAddress: "mock-ledger-address",
            subAccountId: SubAccountId.parseFromNumber(1),
            subAccountName: "SubAccount 1",
        };
        const updatedContact = {
            ...mockContact,
            assets: [
                {
                    ledgerAddress: "mock-ledger-address",
                    subAccounts: [{ subAccountId: "0x1", name: "SubAccount 1" }],
                },
            ],
        };

        const result = await contactRepository.addSubAccountContact(form);

        expect(contactDataStorage.updateItem).toHaveBeenCalledWith(updatedContact);
        expect(result.assets[0].subAccounts).toContainEqual({ subAccountId: "0x1", name: "SubAccount 1" });
    });

    it("ContactRepository: should throw error when adding an existing subaccount", async () => {
        const mockContactWithSubAccount = {
            ...mockContact,
            assets: [
                {
                    ledgerAddress: "mock-ledger-address",
                    subAccounts: [{ subAccountId: "0x1", name: "SubAccount 1" }],
                },
            ],
        };

        contactDataStorage.getItem.mockResolvedValue(mockContactWithSubAccount);

        const form: AddSubAccountContactForm = {
            principal: mockContact.principal,
            ledgerAddress: "mock-ledger-address",
            subAccountId: SubAccountId.parseFromNumber(1),
            subAccountName: "Duplicate SubAccount",
        };

        await expect(contactRepository.addSubAccountContact(form)).rejects.toThrow(ValidationError);
    });

    it("ContactRepository: should update a subaccount to an asset", async () => {

        const newContact = {
            ...mockContact,
            assets: [
                {
                    ledgerAddress: "mock-ledger-address",
                    subAccounts: [{ subAccountId: "0x1", name: "SubAccount 1" }],
                },
            ],
        };

        contactDataStorage.getItem.mockResolvedValue(newContact);

        const form: EditSubAccountContactForm = {
            principal: mockContact.principal,
            ledgerAddress: "mock-ledger-address",
            oldSubAccountId: SubAccountId.parseFromNumber(1),
            newSubAccountId: SubAccountId.parseFromNumber(2),
            newSubAccountName: "SubAccount New",
        };
        const updatedContact = {
            ...mockContact,
            assets: [
                {
                    ledgerAddress: "mock-ledger-address",
                    subAccounts: [{ subAccountId: "0x2", name: "SubAccount New" }],
                },
            ],
        };

        const result = await contactRepository.updateSubAccountContact(form);

        expect(contactDataStorage.updateItem).toHaveBeenCalledWith(updatedContact);
        expect(result.assets[0].subAccounts).toContainEqual({ subAccountId: "0x2", name: "SubAccount New" });
    });

    it("ContactRepository: should throw error when new subAccount ID already exists", async () => {
        const newContact = {
            ...mockContact,
            assets: [
                {
                    ledgerAddress: "mock-ledger-address",
                    subAccounts: [{ subAccountId: "0x1", name: "SubAccount 1" }, { subAccountId: "0x2", name: "SubAccount 2" }],
                }
            ],
        };

        const form: EditSubAccountContactForm = {
            principal: mockContact.principal,
            ledgerAddress: "mock-ledger-address",
            oldSubAccountId: SubAccountId.parseFromNumber(1),
            newSubAccountId: SubAccountId.parseFromNumber(2),
            newSubAccountName: "SubAccount New",
        };

        contactDataStorage.getItem.mockResolvedValue(newContact);

        const error = new ValidationError("updating.contact.subaccount.index.already.exists",
            "newSubAccountIndex",
            `newSubAccountIndex already exists. SubAccountId: 0x2`);

        await expect(contactRepository.updateSubAccountContact(form)).rejects.toThrow(error);
    });

    it("ContactRepository: should throw error when update an not existing subaccount", async () => {
        const newContact = {
            ...mockContact,
            assets: [
                {
                    ledgerAddress: "mock-ledger-address",
                    subAccounts: [],
                }
            ],
        };

        const form: EditSubAccountContactForm = {
            principal: mockContact.principal,
            ledgerAddress: "mock-ledger-address",
            oldSubAccountId: SubAccountId.parseFromNumber(1),
            newSubAccountId: SubAccountId.parseFromNumber(2),
            newSubAccountName: "SubAccount New",
        };

        contactDataStorage.getItem.mockResolvedValue(newContact);

        const error = new ValidationError("updating.contact.subaccount.not.exists",
            "oldSubAccountId",
            `SubAccount not exists. SubAccountId: 0x1`);;

        await expect(contactRepository.updateSubAccountContact(form)).rejects.toThrow(error);
    });

    it("ContactRepository: should remove a subaccount from an asset", async () => {
        const mockContactWithSubAccount = {
            ...mockContact,
            assets: [
                {
                    ledgerAddress: "mock-ledger-address",
                    subAccounts: [{ subAccountId: "0x1", name: "SubAccount 1" }],
                },
            ],
        };

        contactDataStorage.getItem.mockResolvedValue(mockContactWithSubAccount);

        const form: RemoveSubAccountContactForm = {
            principal: mockContact.principal,
            ledgerAddress: "mock-ledger-address",
            subAccountId: SubAccountId.parseFromNumber(1),
        };
        const updatedContact = { ...mockContact, assets: [{ ledgerAddress: "mock-ledger-address", subAccounts: [] }] };

        const result = await contactRepository.removeSubAccountContact(form);

        expect(contactDataStorage.updateItem).toHaveBeenCalledWith(updatedContact);
        expect(result.assets[0].subAccounts).toHaveLength(0);
    });

    it("ContactRepository: should check if a contact exists", async () => {
        contactDataStorage.getItem.mockResolvedValue(mockContact);

        const exists = await contactRepository.isContactExist(mockContact.principal);

        expect(contactDataStorage.getItem).toHaveBeenCalledWith(mockContact.principal);
        expect(exists).toBe(true);
    });

    it("ContactRepository: should check if a contact NOT exists", async () => {
        contactDataStorage.getItem.mockResolvedValue(undefined);

        const newPrincipal = "new principal";

        const exists = await contactRepository.isContactExist(newPrincipal);

        expect(contactDataStorage.getItem).toHaveBeenCalledWith(newPrincipal);
        expect(exists).toBe(false);
    });

    it("ContactRepository: removeAssetFromAllContacts success", async () => {

        const mockContact1 = {
            ...mockContact, assets: [
                {
                    ledgerAddress: "mock-ledger-address",
                    subAccounts: [{ subAccountId: "0x1", name: "SubAccount 1" }],
                },
                {
                    ledgerAddress: "mock-ledger-address-remove",
                    subAccounts: [{ subAccountId: "0x1", name: "SubAccount 1" }],
                },
            ],
        }

        contactDataStorage.getItems.mockResolvedValue([mockContact, mockContact1]);

        const ledgerAddress = "mock-ledger-address-remove";

        const mockContactResult = {
            ...mockContact, assets: [
                {
                    ledgerAddress: "mock-ledger-address",
                    subAccounts: [{ subAccountId: "0x1", name: "SubAccount 1" }],
                }
            ],
        }

        const updatedContacts = [mockContact, mockContactResult];

        await contactRepository.removeAssetFromAllContacts(ledgerAddress);

        expect(contactDataStorage.updateItems).toHaveBeenCalledWith(updatedContacts);

    });

    it("ContactRepository: should throw error when getting a non-existing contact by principal", async () => {
        contactDataStorage.getItem.mockResolvedValue(undefined);

        await expect(contactRepository.getContactByPrincipal("non-existent-principal")).rejects.toThrow(ValidationError);
    });

    it("ContactRepository: getContactAsset should throw error when getting a non-existing contact by asset", async () => {
        try {
            contactRepository.getContactAsset(mockContact, "xxxxxx");
        }
        catch (e) {

            const error = new ValidationError("contact.asset.not.exists",
                "ledgerAddress",
                `Asset not exists. Ledger address: xxxxxx`);

            await expect(e).toEqual(error);
        }
    });
});
