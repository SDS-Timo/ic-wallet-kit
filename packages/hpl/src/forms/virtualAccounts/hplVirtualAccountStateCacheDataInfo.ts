import { ILoadForce } from "@ic-wallet-kit/common";

export interface HplVirtualAccountStateCacheDataInfo extends ILoadForce {
  virtualAccountId: bigint;
}
