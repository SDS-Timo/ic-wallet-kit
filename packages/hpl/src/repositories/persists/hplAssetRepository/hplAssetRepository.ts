import { EditHplAssetForm } from "@hpl/forms/editHplAssetForm";
import { IHplAssetDataStorage } from "@hpl/storage/hplAssetDataStorage";
import { HplAssetDataModel } from "@hpl/types/assets/hplAssetDataModel";
import { ValidationError } from "@ic-wallet-kit/common";
import "reflect-metadata";
import { Inject, Service } from "typedi";

@Service("HplAssetRepository")
export class HplAssetRepository {
    private hplAssetDataStorage: IHplAssetDataStorage

    constructor(
        @Inject("IHplAssetDataStorage")
        hplAssetDataStorage: IHplAssetDataStorage) {
        this.hplAssetDataStorage = hplAssetDataStorage;
    }

    public async getAssets(): Promise<HplAssetDataModel[]> {
        return await this.hplAssetDataStorage.getItems();
    }

    public async addAsset(asset: HplAssetDataModel) {
        await this.hplAssetDataStorage.addItem(asset);
    }

    public async updateAsset(form: EditHplAssetForm): Promise<HplAssetDataModel> {
        const item = await this.getAssetById(form.assetId.toString());
        item.name = form.name;
        item.symbol = form.symbol;
        await this.hplAssetDataStorage.updateItem(item);
        return item;
    }

    public async removeAsset(assetId: string) {
        await this.hplAssetDataStorage.deleteItem(assetId);
    }

    async isAssetExist(assetId: string): Promise<boolean> {
        const asset = await this.hplAssetDataStorage.getItem(assetId);
        const result = asset ? true : false;
        return result;
    }

    public async getAssetById(assetId: string): Promise<HplAssetDataModel> {
        const asset = await this.hplAssetDataStorage.getItem(assetId);
        if (!asset) {
            throw new ValidationError("asset.not.exists",
                "assetId",
                `FtAsset not exists. AssetId: ${assetId}`);
        }
        return asset
    }
}