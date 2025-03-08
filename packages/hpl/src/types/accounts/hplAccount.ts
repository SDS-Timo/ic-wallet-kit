import { HplVirtualAccount } from "@hpl/types/virtualAccounts/hplVirtualAccount";

export interface HplAccount {
  accountId: bigint;
  name: string;
  amount: bigint;
  currencyAmount: string;
  transactionFee: string;
  ft: bigint;
  virtualAccounts: HplVirtualAccount[];
};
