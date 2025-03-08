import { SubAccountContactView } from "@icrc/types/contacts/allowanceContactModel";

export interface AssetContactView {
    symbol: string;
    ledgerAddress: string;
    subAccounts: SubAccountContactView[];
}
