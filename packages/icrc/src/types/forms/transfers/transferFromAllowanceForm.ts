import { Principal } from "@dfinity/principal";
import { Amount } from "@ic-wallet-kit/common";
import { SubAccountId } from "@icrc/types/assets";

export interface TransferFromAllowanceForm {
    receiverPrincipal: Principal;
    ledgerAddress: string;
    fromSubAccountId: SubAccountId;
    toSubAccountId: SubAccountId;
    amount: Amount;
    senderPrincipal: Principal;
}
