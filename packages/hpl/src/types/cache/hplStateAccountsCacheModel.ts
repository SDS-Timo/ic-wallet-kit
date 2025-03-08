import { AccountState } from "../accounts/accountState";

export interface HplStateAccountsCacheModel {
  accountId: bigint;
  accountState: AccountState;
}
