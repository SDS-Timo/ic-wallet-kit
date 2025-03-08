
export interface HplAssetCache {
  id: bigint;
  assetName: string;
  assetSymbol: string;
  decimal: number;
  description: string;
  logo: string;
  controller: string;
  supply: bigint;
  ledgerBalance: bigint;
  accountCount: number;
  virtualAccountCount: number;
};
