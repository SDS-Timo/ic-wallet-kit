import { Principal } from "@dfinity/principal";
import { AccountState } from "@hpl/types/accounts/accountState";

export interface State {
  ftSupplies: Array<[bigint, bigint]>;
  virtualAccounts: Array<[bigint, [AccountState, bigint, bigint]]>;
  accounts: Array<[bigint, AccountState]>;
  remoteAccounts: Array<[[Principal, bigint], [AccountState, bigint]]>;
}
