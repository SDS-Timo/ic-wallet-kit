import { RemoteAccountSelectorCat, RemoteAccountSelectorId, RemoteAccountSelectorIdRange } from "@hpl/types";
import { ILoadForce } from "@ic-wallet-kit/common";

export interface HplStateCacheDataInfo extends ILoadForce {
  ftAssetCount: bigint;
  accountCount: bigint;
  virtualAccountCount: bigint;
  remoteAccounts: [] | [RemoteAccountSelectorId | RemoteAccountSelectorCat | RemoteAccountSelectorIdRange];
}
