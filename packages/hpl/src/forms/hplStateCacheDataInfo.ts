import { RemoteAccountSelectorCat, RemoteAccountSelectorId, RemoteAccountSelectorIdRange } from "@hpl/types";
import { ILoadForce } from "@ic-wallet-middleware/common";

export interface HplStateCacheDataInfo extends ILoadForce {
  ftAssetCount: bigint;
  accountCount: bigint;
  virtualAccountCount: bigint;
  remoteAccounts: [] | [RemoteAccountSelectorId | RemoteAccountSelectorCat | RemoteAccountSelectorIdRange];
}
