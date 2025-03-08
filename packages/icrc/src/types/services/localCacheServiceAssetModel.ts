import { AssetDetailModel } from "@icrc/types/services/assetDetailModel";

export interface LocalCacheServiceAssetModel {
    ledgerAddress: string;
    assetDetail: AssetDetailModel | undefined
    deposit: bigint;
}
