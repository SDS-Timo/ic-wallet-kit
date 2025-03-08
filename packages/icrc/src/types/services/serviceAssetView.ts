
export interface ServiceAssetView {
    tokenSymbol: string,
    tokenName: string,
    decimal: number | undefined,
    shortDecimal: number | undefined,
    logo: string,
    balance: bigint | undefined,
    credit: bigint | undefined,
    depositFee: bigint,
    withdrawFee: bigint,
    ledgerAddress: string,
    isSync: boolean,
};