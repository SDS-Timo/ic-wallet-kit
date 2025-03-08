import { SubAccountContactModel } from "./subAccountContactModel";

export interface AssetContactModel {
    ledgerAddress: string;
    subAccounts: SubAccountContactModel[];
}
