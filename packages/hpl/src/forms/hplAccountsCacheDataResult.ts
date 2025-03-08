import { HplAccountCacheModel } from "@hpl/types/cache/hplAccountCacheModel";

export interface HplAccountsCacheDataResult {
  accountLastId: bigint;
  accounts: HplAccountCacheModel[];
}
