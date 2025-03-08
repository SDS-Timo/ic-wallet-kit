import { EditHplAccountForm } from "@hpl/forms/accounts/editHplAccountForm";
import { HplAccountRepository } from "@hpl/repositories";
import { IHplAccountDataStorage } from "@hpl/storage";
import { HplAccountDataModel } from "@hpl/types";
import { ValidationError } from "@ic-wallet-kit/common";


describe("Unit HplAccountRepository tests", () => {

    let mockStorage: jest.Mocked<IHplAccountDataStorage>;
    let repository: HplAccountRepository;

    const mockAccount: HplAccountDataModel = {
        ftId: "11",
        id: "22",
        name: "mock-test"
    };

    beforeEach(() => {
        mockStorage = {
            getItems: jest.fn(),
            getItem: jest.fn(),
            addItem: jest.fn(),
            updateItem: jest.fn(),
            deleteItem: jest.fn(),
        } as unknown as jest.Mocked<IHplAccountDataStorage>;

        repository = new HplAccountRepository(mockStorage);
    });

    it("HplAccountRepository, should return accounts", async () => {
        const accounts: HplAccountDataModel[] = [mockAccount];
        mockStorage.getItems.mockResolvedValue(accounts);

        const result = await repository.getAccounts();
        expect(result).toEqual(accounts);
    });

    it("HplAccountRepository, should add an account", async () => {
        const account: HplAccountDataModel = mockAccount;
        await repository.addAccount(account);

        expect(mockStorage.addItem).toHaveBeenCalledWith(account);
    });

    it("HplAccountRepository, should update an account", async () => {
        const existingAccount: HplAccountDataModel = mockAccount;
        const updatedForm: EditHplAccountForm = { accountId: "22", name: "Updated Name" };

        mockStorage.getItem.mockResolvedValue(existingAccount);
        mockStorage.updateItem.mockResolvedValue(undefined);

        const result = await repository.updateAccount(updatedForm);
        expect(mockStorage.updateItem).toHaveBeenCalledWith(mockAccount);
        expect(result.name).toBe("Updated Name");
    });

    it("HplAccountRepository, should throw ValidationError if account does not exist", async () => {
        mockStorage.getItem.mockResolvedValue(undefined);
        const form: EditHplAccountForm = { accountId: "123", name: "Updated Name" };

        await expect(repository.updateAccount(form)).rejects.toThrow(
            new ValidationError("account.not.exists", "accountId", `Account not exists. AccountId: 123`)
        );
    });

    it("HplAccountRepository, should remove an account", async () => {
        await repository.removeAccount("22");

        expect(mockStorage.deleteItem).toHaveBeenCalledWith("22");
    });

    it("HplAccountRepository, should return true if account exists", async () => {
        mockStorage.getItem.mockResolvedValue(mockAccount);

        const result = await repository.isAccountExist("22");
        expect(result).toBe(true);
    });

    it("HplAccountRepository, should return false if account does not exist", async () => {
        mockStorage.getItem.mockResolvedValue(undefined);

        const result = await repository.isAccountExist("22");
        expect(result).toBe(false);
    });
})