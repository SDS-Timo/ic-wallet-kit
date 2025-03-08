import { EditHplAssetForm } from "@hpl/forms/editHplAssetForm";
import { HplAssetRepository } from "@hpl/repositories/persists/hplAssetRepository/hplAssetRepository";
import { IHplAssetDataStorage } from "@hpl/storage/hplAssetDataStorage";
import { HplAssetDataModel } from "@hpl/types/assets/hplAssetDataModel";
import { ValidationError } from "@ic-wallet-kit/common";

describe("HplAssetRepository Process Tests", () => {
    let repository: HplAssetRepository;
    let mockStorage: jest.Mocked<IHplAssetDataStorage>;

    const mockAsset: HplAssetDataModel = {
        assetName: "AssetName1",
        assetSymbol: "AN1",
        id: "11",
        logo: "mock-log",
        name: "Asset1",
        symbol: "A1"
    }

    beforeEach(() => {
        mockStorage = {
            getItems: jest.fn(),
            addItem: jest.fn(),
            updateItem: jest.fn(),
            deleteItem: jest.fn(),
            getItem: jest.fn(),
        } as any;

        repository = new HplAssetRepository(mockStorage);
    });

    it("HplAssetRepository, should return assets", async () => {
        const assets: HplAssetDataModel[] = [mockAsset];
        mockStorage.getItems.mockResolvedValue(assets);

        const result = await repository.getAssets();
        expect(result).toEqual(assets);
    });

    it("HplAssetRepository, should add an asset", async () => {
        const asset: HplAssetDataModel = mockAsset;
        await repository.addAsset(asset);

        expect(mockStorage.addItem).toHaveBeenCalledWith(asset);
    });

    it("HplAssetRepository, should update an asset", async () => {
        const existingAsset: HplAssetDataModel = mockAsset;
        const updatedForm: EditHplAssetForm = { assetId: 11n, name: "Updated Name", symbol: "UPD" };

        mockStorage.getItem.mockResolvedValue(existingAsset);
        mockStorage.updateItem.mockResolvedValue(undefined);

        const result = await repository.updateAsset(updatedForm);
        expect(mockStorage.updateItem).toHaveBeenCalledWith(mockAsset);
        expect(result.name).toBe("Updated Name");
        expect(result.symbol).toBe("UPD");
    });

    it("HplAssetRepository, should throw ValidationError if asset does not exist", async () => {
        mockStorage.getItem.mockResolvedValue(undefined);
        const form: EditHplAssetForm = { assetId: 11n, name: "Updated Name", symbol: "UPD" };

        await expect(repository.updateAsset(form)).rejects.toThrow(
            new ValidationError("asset.not.exists", "assetId", "FtAsset not exists. AssetId: 11")
        );
    });

    it("HplAssetRepository, should remove an asset", async () => {
        await repository.removeAsset("11");

        expect(mockStorage.deleteItem).toHaveBeenCalledWith("11");
    });

    it("HplAssetRepository, should return true if asset exists", async () => {
        mockStorage.getItem.mockResolvedValue(mockAsset);

        const result = await repository.isAssetExist("11");
        expect(result).toBe(true);
    });

    it("HplAssetRepository, should return false if asset does not exist", async () => {
        mockStorage.getItem.mockResolvedValue(undefined);

        const result = await repository.isAssetExist("11");
        expect(result).toBe(false);
    });
});
