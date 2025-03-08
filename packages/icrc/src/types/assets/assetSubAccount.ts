import { SubAccountId } from "@icrc/types/assets/subAccountId";

export interface AssetSubAccount {
    //RxDB
    subAccountId: SubAccountId;
    ledgerAddress: string;
    name: string;

    //ICRC Service
    balance: bigint;
    currencyAmount: string;
    decimal: number;
}
