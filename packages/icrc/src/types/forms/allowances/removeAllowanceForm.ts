import { SubAccountId } from "@icrc/types/assets";

export interface RemoveAllowanceForm {
    ledgerAddress: string;
    subAccountId: SubAccountId;
    spenderPrincipal: string;
    spenderSubId: SubAccountId;
}
