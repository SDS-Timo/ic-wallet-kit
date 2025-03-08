import { SupportedStandardEnum } from "@icrc/types/wallets";
import { AssetSubAccountView } from "./assetSubAccountView";


export interface AssetView {
    //RxDB
    sortOrder: number; // id_number
    indexAddress: string; // index
    ledgerAddress: string; // Asset ID address, canisterId
    name: string;
    symbol: string;
    subAccounts: AssetSubAccountView[];
    supportedStandards: SupportedStandardEnum[];
    logo: string | undefined;
    shortDecimal: number;

    //ICRC Service
    decimal: number;
    tokenName: string;
    tokenSymbol: string;
    transactionFee: bigint;
    isSync: boolean;
}
