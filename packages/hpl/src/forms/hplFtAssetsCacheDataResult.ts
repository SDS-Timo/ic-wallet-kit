import { HplFtAssetCacheModel } from "@hpl/types/cache/hplFtAssetCacheModel";

export interface HplFtAssetsCacheDataResult {
  ftAssetLastId: bigint;
  ftAssets: HplFtAssetCacheModel[];
}
