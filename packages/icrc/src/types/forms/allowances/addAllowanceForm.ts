import { Amount } from "@ic-wallet-middleware/common";
import { SubAccountId } from "@icrc/types/assets";

export interface AddAllowanceForm {
    ledgerAddress: string;
    subAccountId: SubAccountId;
    spenderPrincipal: string;
    spenderSubId: SubAccountId;
    amount: Amount;
    expiration?: string | undefined;
}
