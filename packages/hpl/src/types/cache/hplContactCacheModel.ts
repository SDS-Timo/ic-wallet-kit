import { Principal } from "@dfinity/principal";
import { HplRemoteInfoCacheModel } from "@hpl/types/cache/hplRemoteInfoCacheModel";

export interface HplRemoteCacheModel {
  remoteId: Principal;
  accountId: bigint;
  remoteInfo: HplRemoteInfoCacheModel;
}
