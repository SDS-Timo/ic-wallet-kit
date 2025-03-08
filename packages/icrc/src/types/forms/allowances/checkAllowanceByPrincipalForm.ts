import { SubAccountId } from "@icrc/types/assets";

export interface CheckAllowanceByPrincipalForm {
    ownerPrincipal: string;
    ledgerAddress: string;
    subAccountId: SubAccountId;
    spenderPrincipal: string;
    spenderSubId: SubAccountId;
}
