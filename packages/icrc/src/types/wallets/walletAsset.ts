import { SupportedStandardEnum } from "@icrc/types/wallets/supportedStandardEnum";
import { WalletSubAccount } from "@icrc/types/wallets/walletSubAccount";


export interface WalletAsset {
    sortOrder: number; //id_number
    indexAddress: string; // index
    ledgerAddress: string; // Asset ID, address, canisterId
    name: string;
    symbol: string;
    logo: string | undefined;
    tokenSymbol: string;
    tokenName: string;
    shortDecimal: number;
    subAccounts: WalletSubAccount[];
    supportedStandards: SupportedStandardEnum[];
}
