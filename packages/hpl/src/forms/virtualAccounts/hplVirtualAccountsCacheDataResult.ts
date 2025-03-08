import { HplVirtualAccountCacheModel } from "@hpl/types/cache/hplVirtualAccountCacheModel";

export interface HplVirtualAccountsCacheDataResult {
  virtualAccountLastId: bigint;
  virtualAccounts: HplVirtualAccountCacheModel[];
}
