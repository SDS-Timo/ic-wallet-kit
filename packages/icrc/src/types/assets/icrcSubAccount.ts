
export interface IcrcSubAccount {
    subAccountId: string;
    ledgerAddress: string;
    //address: string;
    balance: bigint;
    currencyAmount: string;
    //decimal: number;
    isSync: boolean;
}
