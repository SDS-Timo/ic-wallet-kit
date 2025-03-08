import { SubAccountId } from "@icrc/types/assets";

export interface UpdateAllowanceResult {
    ledgerAddress: string;
    subAccountId: SubAccountId;
    spenderPrincipal: string;
    spenderSubId: SubAccountId;
    amount: bigint;
    expiration?: string | undefined;
}
