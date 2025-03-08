import { HplAssetCache } from "@hpl/types/assets/hplAssetCache";

export interface HplAsset extends HplAssetCache {
  name: string;
  symbol: string;
};
