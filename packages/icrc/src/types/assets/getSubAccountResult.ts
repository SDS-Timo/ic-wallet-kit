
export interface GetSubAccountResult {
    subAccountId: string;
    ledgerAddress: string;
    name: string;
    balance: bigint;
    currencyAmount: string;
    decimal: number;
}
