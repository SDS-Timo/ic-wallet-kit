import { HplAccountCacheModel } from "@hpl/types/cache/hplAccountCacheModel";
import { HplRemoteCacheModel } from "@hpl/types/cache/hplContactCacheModel";
import { HplFtAssetCacheModel } from "@hpl/types/cache/hplFtAssetCacheModel";
import { HplVirtualAccountCacheModel } from "@hpl/types/cache/hplVirtualAccountCacheModel";

export interface HplDataCacheModel {
  accounts: {
    accountLastId: bigint;
    accounts: HplAccountCacheModel[];

  };
  virtualAccounts: {
    virtualAccountLastId: bigint;
    virtualAccounts: HplVirtualAccountCacheModel[];
  };
  ftAssets: {
    ftAssetLastId: bigint;
    ftAssets: HplFtAssetCacheModel[];
  };
  remotes: HplRemoteCacheModel[];
}
