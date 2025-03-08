import { HplAccountCacheModel } from "@hpl/types/cache/hplAccountCacheModel";

export interface HplAdminStateCacheDataResult {
  accountCount: bigint;
  accounts: HplAccountCacheModel[];
}
