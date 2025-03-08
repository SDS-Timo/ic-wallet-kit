import { Amount } from "@ic-wallet-middleware/common";
import { SubAccountId } from "@icrc/types";

export interface TransferForm {
    amount: Amount;
    fromPrincipal: string;
    fromSubId: SubAccountId;
    toPrincipal: string;
    toSubId: SubAccountId;
}
