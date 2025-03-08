import { AccountState } from "../accounts/accountState";

export interface HplStateVirtualAccountsCacheModel {
  virtualAccountId: bigint;
  accountState: AccountState;
  accountId: bigint;
  time: bigint;
}
