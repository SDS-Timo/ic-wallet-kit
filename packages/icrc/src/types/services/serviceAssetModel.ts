export interface ServiceAssetModel {
  tokenSymbol: string;
  tokenName: string;
  decimal: number | undefined;
  shortDecimal: number | undefined;
  ledgerAddress: string;
  logo: string | undefined;
}