import { ValidationError } from "@ic-wallet-kit/common";
import { AllowanceRepository } from "@icrc/repositories/persists/allowanceRepository/allowanceRepository";
import { IAllowanceDataStorage } from "@icrc/storage/allowanceDataStorage/allowanceDataStorage";
import { SubAccountId } from "@icrc/types";
import { CheckAllowanceForm, RemoveAllowanceForm } from "@icrc/types/forms";

describe("AllowanceRepository", () => {
    let allowanceDataStorageMock: jest.Mocked<IAllowanceDataStorage>;
    let allowanceRepository: AllowanceRepository;

    const mockAllowance = {
        spenderPrincipal: "mock-spender",
        ledgerAddress: "mock-ledger",
        subAccountId: "0x2",
        spenderSubId: "0x3",
    };

    beforeEach(() => {
        allowanceDataStorageMock = {
            getItems: jest.fn(),
            getItem: jest.fn(),
            addItem: jest.fn(),
            deleteItem: jest.fn(),
        } as unknown as jest.Mocked<IAllowanceDataStorage>;

        allowanceRepository = new AllowanceRepository(allowanceDataStorageMock);
    });

    it("AllowanceRepository: should return allowances filtered by ledgerAddress (getAssetAllowances)", async () => {
        const mockAllowances = [
            { ...mockAllowance },
            { ...mockAllowance, ledgerAddress: "different-ledger" },
        ];
        allowanceDataStorageMock.getItems.mockResolvedValue(mockAllowances);

        const result = await allowanceRepository.getAssetAllowances("mock-ledger");

        expect(result).toEqual([{ ...mockAllowance }]);
        expect(allowanceDataStorageMock.getItems).toHaveBeenCalledTimes(1);
    });

    it("AllowanceRepository: should return an allowance when found (getAssetAllowance)", async () => {
        const documentId = "mock-spender_mock-ledger_0x2_0x3";
        allowanceDataStorageMock.getItem.mockResolvedValue(mockAllowance);

        const result = await allowanceRepository.getAssetAllowance(
            "mock-spender",
            "mock-ledger",
            "0x2",
            "0x3"
        );

        expect(result).toEqual(mockAllowance);
        expect(allowanceDataStorageMock.getItem).toHaveBeenCalledWith(documentId);
    });

    it("AllowanceRepository: should throw ValidationError when allowance is not found (getAssetAllowance)", async () => {
        allowanceDataStorageMock.getItem.mockResolvedValue(undefined);

        await expect(
            allowanceRepository.getAssetAllowance(
                "mock-spender",
                "mock-ledger",
                "0x2",
                "0x3"
            )
        ).rejects.toThrow(ValidationError);

        expect(allowanceDataStorageMock.getItem).toHaveBeenCalled();
    });

    it("AllowanceRepository: should add a new allowance and return it (addAllowance)", async () => {
        const checkAllowanceForm: CheckAllowanceForm = {
            spenderPrincipal: "mock-spender",
            spenderSubId: SubAccountId.parseFromString("0x3"),
            ledgerAddress: "mock-ledger",
            subAccountId: SubAccountId.parseFromString("0x2"),
        };

        allowanceDataStorageMock.addItem.mockResolvedValue(undefined);

        const result = await allowanceRepository.addAllowance(checkAllowanceForm);

        expect(result).toEqual({
            spenderPrincipal: checkAllowanceForm.spenderPrincipal,
            spenderSubId: checkAllowanceForm.spenderSubId.toString(),
            ledgerAddress: checkAllowanceForm.ledgerAddress,
            subAccountId: checkAllowanceForm.subAccountId.toString(),
        });
        expect(allowanceDataStorageMock.addItem).toHaveBeenCalledWith({
            spenderPrincipal: checkAllowanceForm.spenderPrincipal,
            spenderSubId: checkAllowanceForm.spenderSubId.toString(),
            ledgerAddress: checkAllowanceForm.ledgerAddress,
            subAccountId: checkAllowanceForm.subAccountId.toString(),
        });
    });

    it("AllowanceRepository: should delete an allowance by document ID (removeAllowance)", async () => {
        const removeAllowanceForm: RemoveAllowanceForm = {
            spenderPrincipal: "mock-spender",
            spenderSubId: SubAccountId.parseFromString("0x3"),
            ledgerAddress: "mock-ledger",
            subAccountId: SubAccountId.parseFromString("0x2"),
        };

        allowanceDataStorageMock.deleteItem.mockResolvedValue(undefined);

        await allowanceRepository.removeAllowance(removeAllowanceForm);

        expect(allowanceDataStorageMock.deleteItem).toHaveBeenCalledWith(
            "mock-spender_mock-ledger_0x2_0x3"
        );
    });

    it("AllowanceRepository: should return true if allowance exists (isExistStorageAllowance)", async () => {
        allowanceDataStorageMock.getItem.mockResolvedValue(mockAllowance);

        const result = await allowanceRepository.isExistStorageAllowance(
            "mock-spender",
            "mock-ledger",
            "0x2",
            "0x3"
        );

        expect(result).toBe(true);
        expect(allowanceDataStorageMock.getItem).toHaveBeenCalled();
    });

    it("AllowanceRepository: should return false if allowance does not exist (isExistStorageAllowance)", async () => {
        allowanceDataStorageMock.getItem.mockResolvedValue(undefined);

        const result = await allowanceRepository.isExistStorageAllowance(
            "mock-spender",
            "mock-ledger",
            "0x2",
            "0x3"
        );

        expect(result).toBe(false);
        expect(allowanceDataStorageMock.getItem).toHaveBeenCalled();
    });

    it("AllowanceRepository: should generate the correct allowance document ID (getAllowanceDocumentId)", () => {
        const result = allowanceRepository["getAllowanceDocumentId"](
            "mock-spender",
            "mock-ledger",
            "0x2",
            "0x3"
        );

        expect(result).toBe("mock-spender_mock-ledger_0x2_0x3");
    });
});
