import { HplVirtualAccountInfoCacheModel } from "@hpl/types/cache/hplVirtualAccountInfoCacheModel";

export interface HplVirtualAccountCacheModel {
  virtualAccountId: bigint;
  virtualAccountInfo: HplVirtualAccountInfoCacheModel;
}
