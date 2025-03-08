import { HplAccountCacheModel } from "@hpl/types/cache/hplAccountCacheModel";

export interface HplStateCacheDataResult {
  accountCount: bigint;
  accounts: HplAccountCacheModel[];
}
