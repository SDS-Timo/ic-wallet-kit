
export interface HplVirtualAccount {
  virtualAccountId: bigint;
  code: string;
  name: string;
  amount: bigint;
  currencyAmount: string;
  expiration?: bigint;
  accessBy: string;
  isMint: boolean;
  accountId: bigint;
  assetId: bigint;
  assetSymbol: string;
};
