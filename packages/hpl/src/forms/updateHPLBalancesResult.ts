import { HplAccount } from "@hpl/types/accounts/hplAccount";
import { HplAsset } from "@hpl/types/assets/hplAsset";
import { HplVirtualAccount } from "@hpl/types/virtualAccounts/hplVirtualAccount";

export interface UpdateHPLBalancesResult {
  virtualSubAccount: HplVirtualAccount[];
  subAccounts: HplAccount[];
  ftAssets: HplAsset[];
}
