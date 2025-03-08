import { AccountState } from "../accounts/accountState";

export interface HplStateRemoteAccountsCacheModel {
  remotePrincipal: string;
  remoteAccountId: bigint;
  accountState: AccountState;
  time: bigint;
}
