import { SubAccountId } from "@icrc/types/assets";

export interface CheckAllowanceModel {
    ledgerAddress: string;
    subAccountId: SubAccountId;
    spender: string;
    spenderSubId: SubAccountId;
    amount: bigint;
    decimal: number;
    expiration: bigint | undefined;
}
