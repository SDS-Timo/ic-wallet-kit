import { SubAccountId } from "@icrc/types/assets";

export interface CheckAllowanceForm {
    ledgerAddress: string;
    subAccountId: SubAccountId;
    spenderPrincipal: string;
    spenderSubId: SubAccountId;
}
