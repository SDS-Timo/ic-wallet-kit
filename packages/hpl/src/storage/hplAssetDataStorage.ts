import { RxBaseDataStorage } from "@hpl/storage/base/rxBaseDataStorage";
import { HplAssetDataModel } from "@hpl/types/assets/hplAssetDataModel";
import { IBaseDataStorage } from "@ic-wallet-kit/common";
import "reflect-metadata";
import { Service } from "typedi";


export interface IHplAssetDataStorage extends IBaseDataStorage<HplAssetDataModel> {
}

@Service("IHplAssetDataStorage")
export class HplAssetDataStorage extends RxBaseDataStorage<HplAssetDataModel> implements IHplAssetDataStorage {

    get collectionName(): string {
        return "hplAssets";
    }

    public getDocumentId(doc: HplAssetDataModel): string {
        return doc.id;
    }
}