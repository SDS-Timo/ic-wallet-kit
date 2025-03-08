import { Amount } from "@ic-wallet-kit/common";
import { SubAccountId } from "@icrc/types";

export interface TransferForm {
    amount: Amount;
    fromPrincipal: string;
    fromSubId: SubAccountId;
    toPrincipal: string;
    toSubId: SubAccountId;
}
