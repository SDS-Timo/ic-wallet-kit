import { SubAccountId } from "@icrc/types/assets";

export interface RemoveSubAccountContactForm {
    principal: string;
    ledgerAddress: string;
    subAccountId: SubAccountId;
}
