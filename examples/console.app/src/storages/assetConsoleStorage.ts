import { BaseConsoleLocalStorage } from "@app/storages/baseConsoleLocalStorage";
import { IAssetDataStorage, WalletAsset } from "@ic-wallet-kit/icrc";


export class AssetConsoleStorage extends BaseConsoleLocalStorage<WalletAsset> implements IAssetDataStorage {

    public get collectionName(): string {
        return "persists-assets";
    }

    public getDocumentId(doc: WalletAsset): string {
        return doc.ledgerAddress;
    }
}
