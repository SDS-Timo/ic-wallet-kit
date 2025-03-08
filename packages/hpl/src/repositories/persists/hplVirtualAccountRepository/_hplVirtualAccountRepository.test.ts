import { HplVirtualAccountRepository } from "@hpl/repositories/persists/hplVirtualAccountRepository/hplVirtualAccountRepository";
import { IHplVirtualAccountDataStorage } from "@hpl/storage/hplVirtualAccountDataStorage";
import { HplVirtualAccountDataModel } from "@hpl/types/virtualAccounts/hplVirtualAccountDataModel";
import { ValidationError } from "@ic-wallet-kit/common";

describe("HplVirtualAccountRepository Process Tests", () => {
    let repository: HplVirtualAccountRepository;
    let mockStorage: jest.Mocked<IHplVirtualAccountDataStorage>;

    const mockVirtualAccount: HplVirtualAccountDataModel = {
        accountId: "11",
        id: "22",
        name: "Virtual Account"
    };

    beforeEach(() => {
        mockStorage = {
            getItems: jest.fn(),
            addItem: jest.fn(),
            updateItem: jest.fn(),
            deleteItem: jest.fn(),
            getItem: jest.fn(),
        } as any;

        repository = new HplVirtualAccountRepository(mockStorage);
    });

    it("should return virtual accounts", async () => {
        const virtualAccounts: HplVirtualAccountDataModel[] = [mockVirtualAccount];
        mockStorage.getItems.mockResolvedValue(virtualAccounts);

        const result = await repository.getVirtualAccounts();
        expect(result).toEqual(virtualAccounts);
    });

    it("should add a virtual account", async () => {
        const virtualAccount: HplVirtualAccountDataModel = mockVirtualAccount;
        await repository.addVirtualAccount(virtualAccount);

        expect(mockStorage.addItem).toHaveBeenCalledWith(virtualAccount);
    });

    it("should update a virtual account", async () => {
        const existingVirtualAccount: HplVirtualAccountDataModel = mockVirtualAccount;
        const updatedVirtualAccount: HplVirtualAccountDataModel = { accountId: "11", id: "22", name: "Updated Name" };

        mockStorage.getItem.mockResolvedValue(existingVirtualAccount);
        mockStorage.updateItem.mockResolvedValue(undefined);

        const result = await repository.updateVirtualAccount(updatedVirtualAccount);
        expect(mockStorage.updateItem).toHaveBeenCalledWith({ accountId: "11", id: "22", name: "Updated Name" });
        expect(result.name).toBe("Updated Name");
    });

    it("should throw ValidationError if virtual account does not exist", async () => {
        mockStorage.getItem.mockResolvedValue(undefined);

        await expect(repository.updateVirtualAccount(mockVirtualAccount)).rejects.toThrow(
            new ValidationError("virtualAccount.not.exists", "virtualAccountId", "VirtualAccount not exists. VirtualAccountId: 22")
        );
    });

    it("should remove a virtual account", async () => {
        await repository.removeVirtualAccount("22");

        expect(mockStorage.deleteItem).toHaveBeenCalledWith("22");
    });

    it("should return true if virtual account exists", async () => {
        mockStorage.getItem.mockResolvedValue(mockVirtualAccount);

        const result = await repository.isVirtualAccountExist("22");
        expect(result).toBe(true);
    });

    it("should return false if virtual account does not exist", async () => {
        mockStorage.getItem.mockResolvedValue(undefined);

        const result = await repository.isVirtualAccountExist("22");
        expect(result).toBe(false);
    });
});
