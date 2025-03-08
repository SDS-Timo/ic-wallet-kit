import { ValidationError } from "@ic-wallet-middleware/common";
import { mockIndexAddress, mockLedgerAddress } from "@icrc/__tests_utils/mockConstrains";
import { AssetRepository } from "@icrc/repositories";
import { AssetDataStorage, IAssetDataStorage } from "@icrc/storage/assetDataStorage/assetDataStorage";
import { SubAccountId, WalletAsset, WalletSubAccount } from "@icrc/types";
import { RemoveSubAccountForm } from "@icrc/types/forms/assets/removeSubAccountForm";
import { UpdateAssetForm } from "@icrc/types/forms/assets/updateAssetForm";
import { UpdateSubAccountForm } from "@icrc/types/forms/assets/updateSubAccountForm";
import { SupportedStandardEnum } from "@icrc/types/wallets/supportedStandardEnum";

describe("AssetRepository Tests", () => {
    let assetDataStorage: jest.Mocked<IAssetDataStorage>;
    let assetRepository: AssetRepository;

    const mockAsset: WalletAsset = {
        ledgerAddress: mockLedgerAddress,
        name: "Mock Asset",
        symbol: "MCK",
        sortOrder: 1,
        subAccounts: [],
        shortDecimal: 2,
        supportedStandards: [SupportedStandardEnum.ICRC1],
        indexAddress: mockIndexAddress,
        logo: "",
        tokenName: "tokenName",
        tokenSymbol: "tokenSymbol"
    };

    beforeEach(() => {
        assetDataStorage = new (<new () => AssetDataStorage><unknown>AssetDataStorage)() as jest.Mocked<AssetDataStorage>;
        assetRepository = new AssetRepository(assetDataStorage);
        jest.clearAllMocks();
    });

    it("AssetRepository: should return default tokens if no tokens exist", async () => {
        assetDataStorage.getItems = jest.fn().mockResolvedValue([]);
        assetDataStorage.addItems = jest.fn().mockResolvedValue(undefined);

        const result = await assetRepository.getTokensOrDefault();

        expect(assetDataStorage.getItems).toHaveBeenCalled();
        expect(assetDataStorage.addItems).toHaveBeenCalled();
        expect(result.length).toBeGreaterThan(0); // Default tokens added
    });

    it("AssetRepository: should remove an asset by ledger address", async () => {
        const ledgerAddress = "mock-ledger-address";
        assetDataStorage.deleteItem = jest.fn();

        await assetRepository.remove(ledgerAddress);

        expect(assetDataStorage.deleteItem).toHaveBeenCalledWith(ledgerAddress);
    });

    it("AssetRepository: should add a subaccount to an asset", async () => {
        const subAccount: WalletSubAccount = { ledgerAddress: mockAsset.ledgerAddress, subAccountId: "1", name: "Sub 1" };
        assetDataStorage.getItem = jest.fn().mockResolvedValue(mockAsset);

        assetDataStorage.updateItem = jest.fn();

        await assetRepository.addSubAccount(subAccount);

        expect(assetDataStorage.getItem).toHaveBeenCalledWith(subAccount.ledgerAddress);
        expect(assetDataStorage.updateItem).toHaveBeenCalledWith({
            ...mockAsset,
            subAccounts: [subAccount],
        });
    });

    it("AssetRepository: should throw error when adding subaccount to a non-existing asset", async () => {
        const subAccount: WalletSubAccount = { ledgerAddress: "non-existing-address", subAccountId: "1", name: "Sub 1" };
        assetDataStorage.getItem = jest.fn().mockResolvedValue(undefined);

        await expect(assetRepository.addSubAccount(subAccount)).rejects.toThrow(ValidationError);
    });

    it("AssetRepository: should remove a subaccount from an asset", async () => {
        const form: RemoveSubAccountForm = { ledgerAddress: mockAsset.ledgerAddress, subAccountId: SubAccountId.parseFromString("0x1") };
        const assetWithSubAccount = { ...mockAsset, subAccounts: [{ subAccountId: "0x1", ledgerAddress: mockAsset.ledgerAddress, name: "Sub 1" }] };
        assetDataStorage.getItem = jest.fn().mockResolvedValue(assetWithSubAccount);
        assetDataStorage.updateItem = jest.fn();

        await assetRepository.removeSubAccount(form);

        expect(assetDataStorage.updateItem).toHaveBeenCalledWith({
            ...mockAsset,
            subAccounts: [],
        });
    });

    it("AssetRepository: should update a subaccount's name", async () => {
        const form: UpdateSubAccountForm = {
            ledgerAddress: mockAsset.ledgerAddress,
            subAccountId: SubAccountId.parseFromString("0x1"),
            subAccountNewName: "Updated SubAccount",
        };

        const assetWithSubAccount = {
            ...mockAsset,
            subAccounts: [{ subAccountId: "0x1", ledgerAddress: mockAsset.ledgerAddress, name: "Old Name" }],
        };

        assetDataStorage.getItem = jest.fn().mockResolvedValue(assetWithSubAccount);
        assetDataStorage.updateItem = jest.fn();

        await assetRepository.updateSubAccount(form);

        expect(assetDataStorage.updateItem).toHaveBeenCalledWith({
            ...mockAsset,
            subAccounts: [{ subAccountId: "0x1", ledgerAddress: mockAsset.ledgerAddress, name: "Updated SubAccount" }],
        });
    });

    it("AssetRepository: should throw error when updating a non-existing subaccount", async () => {
        const form: UpdateSubAccountForm = {
            ledgerAddress: mockAsset.ledgerAddress,
            subAccountId: SubAccountId.parseFromString("0x2"),
            subAccountNewName: "Updated SubAccount",
        };

        const assetWithoutSubAccount = { ...mockAsset, subAccounts: [] };
        assetDataStorage.getItem = jest.fn().mockResolvedValue(assetWithoutSubAccount);

        await expect(assetRepository.updateSubAccount(form)).rejects.toThrow(ValidationError);
    });

    it("AssetRepository: should update asset details", async () => {
        const form: UpdateAssetForm = {
            ledgerAddress: mockAsset.ledgerAddress,
            assetName: "Updated Asset",
            shortDecimal: 4,
            symbol: "UPD",
        };

        assetDataStorage.getItem = jest.fn().mockResolvedValue(mockAsset);
        assetDataStorage.updateItem = jest.fn();

        await assetRepository.updateAsset(form);

        expect(assetDataStorage.updateItem).toHaveBeenCalledWith({
            ...mockAsset,
            name: "Updated Asset",
            shortDecimal: 4,
            symbol: "UPD",
        });
    });

    it("AssetRepository: should throw error when updating a non-existing asset", async () => {
        const form: UpdateAssetForm = {
            ledgerAddress: "non-existing-address",
            assetName: "Updated Asset",
            shortDecimal: 4,
            symbol: "UPD",
        };

        assetDataStorage.getItem = jest.fn().mockResolvedValue(undefined);

        await expect(assetRepository.updateAsset(form)).rejects.toThrow(ValidationError);
    });

    it("AssetRepository: isAssetExist - should check if an asset exists by ledger address", async () => {
        assetDataStorage.getItems = jest.fn().mockResolvedValue([mockAsset]);

        const exists = await assetRepository.isAssetExist(mockAsset.ledgerAddress);

        expect(assetDataStorage.getItems).toHaveBeenCalled();
        expect(exists).toBe(true);
    });

    it("AssetRepository: isAssetExist - should check if an asset NOT exists by ledger address", async () => {
        assetDataStorage.getItems = jest.fn().mockResolvedValue([]);

        const exists = await assetRepository.isAssetExist(mockAsset.ledgerAddress);

        expect(assetDataStorage.getItems).toHaveBeenCalled();
        expect(exists).toBe(false);
    });

    it("AssetRepository: should check supported standards for an asset", async () => {
        assetDataStorage.getItem = jest.fn().mockResolvedValue(mockAsset);

        const isSupported = await assetRepository.checkSupportedStandard(mockAsset.ledgerAddress, SupportedStandardEnum.ICRC1);

        expect(isSupported).toBe(true);
    });


    it("AssetRepository: getAssetNextIndex - should check if asset next index in case asset is present", async () => {
        assetDataStorage.getItems = jest.fn().mockResolvedValue([mockAsset]);

        const exists = await assetRepository.getAssetNextIndex();

        expect(assetDataStorage.getItems).toHaveBeenCalled();
        expect(exists).toBe(2);
    });

    it("AssetRepository: getAssetNextIndex - should check if asset next index in case asset is NOT present", async () => {
        assetDataStorage.getItems = jest.fn().mockResolvedValue([]);

        const exists = await assetRepository.getAssetNextIndex();

        expect(assetDataStorage.getItems).toHaveBeenCalled();
        expect(exists).toBe(0);
    });

    it("AssetRepository: updateTokens - should check if asset next index in case asset is NOT present", async () => {
        assetDataStorage.addItem = jest.fn();

        await assetRepository.addAsset(mockAsset);

        expect(assetDataStorage.addItem).toHaveBeenCalledWith(mockAsset);

    });
});
