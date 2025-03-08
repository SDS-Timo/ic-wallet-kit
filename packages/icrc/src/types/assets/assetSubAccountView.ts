import { SubAccountId } from "@icrc/types/assets/subAccountId";

export interface AssetSubAccountView {
    //RxDB
    subAccountId: SubAccountId;
    ledgerAddress: string;
    name: string;

    //ICRC Service
    balance: bigint;
    currencyAmount: string;
    decimal: number;
    isSync: boolean;
}
