import { HplContactRepository } from "@hpl/repositories/persists/hplContactRepository/hplContactRepository";
import { IHplContactDataStorage } from "@hpl/storage/hplContactDataStorage";
import { HplContactDataModel } from "@hpl/types";
import { HplContactRemoteDataModel } from "@hpl/types/contacts/hplContactRemoteDataModel";
import { ValidationError } from "@ic-wallet-kit/common";

describe("HplContactRepository Process Tests", () => {
    let repository: HplContactRepository;
    let mockStorage: jest.Mocked<IHplContactDataStorage>;

    const mockContact = {
        principal: "mock-principal",
        name: "John Doe",
        remotes: []
    }

    beforeEach(() => {
        mockStorage = {
            getItems: jest.fn(),
            addItem: jest.fn(),
            updateItem: jest.fn(),
            deleteItem: jest.fn(),
            getItem: jest.fn(),
        } as any;

        repository = new HplContactRepository(mockStorage);
    });

    it("should return all contacts", async () => {
        const contacts: HplContactDataModel[] = [mockContact];
        mockStorage.getItems.mockResolvedValue(contacts);

        const result = await repository.getContacts();
        expect(result).toEqual(contacts);
    });

    it("should add a new contact", async () => {
        const contact: HplContactDataModel = mockContact;
        await repository.addContact(contact);

        expect(mockStorage.addItem).toHaveBeenCalledWith(contact);
    });

    it("should update an existing contact", async () => {
        const updatedContact: HplContactDataModel = { principal: "mock-principal", name: "John Doe Updated", remotes: [] };
        await repository.updateContact(updatedContact);

        expect(mockStorage.updateItem).toHaveBeenCalledWith(updatedContact);
    });

    it("should throw ValidationError if contact does not exist", async () => {
        mockStorage.getItem.mockResolvedValue(undefined);
        await expect(repository.getContactById("mock-principal")).rejects.toThrow(
            new ValidationError("contact.not.exists", "contactId", "FtContact not exists. ContactId: mock-principal")
        );
    });

    it("should remove a contact", async () => {
        await repository.removeContact("mock-principal");

        expect(mockStorage.deleteItem).toHaveBeenCalledWith("mock-principal");
    });

    it("should add contact remotes", async () => {
        const existingContact: HplContactDataModel = mockContact;
        const newRemotes: HplContactRemoteDataModel[] = [{ remoteId: "456", name: "Remote 1" }];

        mockStorage.getItem.mockResolvedValue(mockContact);

        await repository.addContactRemotes("mock-principal", newRemotes);
        expect(mockStorage.updateItem).toHaveBeenCalledWith({
            ...existingContact,
            remotes: newRemotes,
        });
    });

    it("should remove a contact remote", async () => {
        const existingContact: HplContactDataModel = {
            ...mockContact,
            remotes: [{ remoteId: "456", name: "Remote 1" }],
        };

        mockStorage.getItem.mockResolvedValue(existingContact);

        await repository.removeContactLink("mock-principal", "456");

        expect(mockStorage.updateItem).toHaveBeenCalledWith({
            ...existingContact,
            remotes: [],
        });
    });
});
