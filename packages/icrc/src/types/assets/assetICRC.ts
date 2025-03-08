import { AssetSubAccountView } from "@icrc/types/assets/assetSubAccountView";

export interface AssetICRC {
    indexAddress: string;
    ledgerAddress: string;
    decimal: number;
    logo: string | undefined;
    tokenName: string;
    tokenSymbol: string;
    transactionFee: bigint;
    subAccounts: AssetSubAccountView[];
    isSync: boolean;
}
