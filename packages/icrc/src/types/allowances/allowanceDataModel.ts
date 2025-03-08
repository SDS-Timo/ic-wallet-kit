import { SubAccountId } from "@icrc/types/assets";


export interface AllowanceDataModel {
    ledgerAddress: string;
    subAccountId: SubAccountId;
    spenderPrincipal: string;
    spenderSubId: SubAccountId;
    expiration?: bigint;
    amount: bigint;
}
