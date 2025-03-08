import { SubAccountId } from "@icrc/types/assets";

export interface EditSubAccountContactForm {
    principal: string;
    ledgerAddress: string;
    newSubAccountName: string;
    newSubAccountId: SubAccountId;
    oldSubAccountId: SubAccountId;
}
