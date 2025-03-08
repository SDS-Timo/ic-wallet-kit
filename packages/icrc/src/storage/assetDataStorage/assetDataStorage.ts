import { IBaseDataStorage } from "@ic-wallet-middleware/common";
import { RxBaseDataStorage } from "@icrc/storage/base/rxBaseDataStorage";
import { WalletAsset } from "@icrc/types";

export interface IAssetDataStorage extends IBaseDataStorage<WalletAsset> {
}

export class AssetDataStorage extends RxBaseDataStorage<WalletAsset> implements IAssetDataStorage {
    get collectionName(): string {
        return "assets";
    }
    public getDocumentId(doc: WalletAsset): string {
        return doc.ledgerAddress;
    }
}