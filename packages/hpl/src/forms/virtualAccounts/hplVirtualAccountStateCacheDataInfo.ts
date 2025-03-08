import { ILoadForce } from "@ic-wallet-middleware/common";

export interface HplVirtualAccountStateCacheDataInfo extends ILoadForce {
  virtualAccountId: bigint;
}
