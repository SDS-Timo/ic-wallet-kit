import { SubAccountContactForm } from "./subAccountContactForm";

export interface AssetContactForm {
    ledgerAddress: string;
    subAccounts: SubAccountContactForm[];
}
