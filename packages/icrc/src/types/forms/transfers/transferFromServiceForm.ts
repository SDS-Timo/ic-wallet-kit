import { Amount } from "@ic-wallet-kit/common";
import { SubAccountId } from "@icrc/types";

export interface TransferFromServiceForm {
    amount: Amount;
    fromPrincipal: string;
    toPrincipal: string;
    ledgerAddress: string;
    toSubId: SubAccountId;
}
