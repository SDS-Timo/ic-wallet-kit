import { SubAccountId } from "@icrc/types/assets";

export interface AllowanceModel {
    ledgerAddress: string;
    subAccountId: SubAccountId;
    spenderPrincipal: string;
    expiration: string | undefined;
    spenderSubId: SubAccountId;
    decimal: number;
    amount: bigint;
}
