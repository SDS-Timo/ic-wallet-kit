import { SubAccountId } from "@icrc/types/assets";

export interface AddSubAccountContactForm {
    principal: string;
    ledgerAddress: string;
    subAccountName: string;
    subAccountId: SubAccountId;

}
