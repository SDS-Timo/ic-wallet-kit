import { HplFtAssetInfoCacheModel } from "@hpl/types/cache/hplFtAssetInfoCacheModel";

export interface HplFtAssetCacheModel {
  assetId: bigint;
  ftAssetInfo: HplFtAssetInfoCacheModel;
}
