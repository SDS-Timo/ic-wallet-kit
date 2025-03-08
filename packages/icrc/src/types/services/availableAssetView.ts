export interface AvailableAssetView {
    symbol: string;
    name: string;
    decimal: number | undefined;
    shortDecimal: number | undefined;
    logo: string | undefined;
    ledgerAddress: string;
};