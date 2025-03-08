import { Principal } from "@dfinity/principal";
import { Amount } from "@ic-wallet-middleware/common";
import { SubAccountId } from "@icrc/types/assets";


export interface SendTransactionForm {
    amount: Amount;
    ledgerAddress: string;
    subAccountId: SubAccountId;
    receiverAccountPrincipal: Principal;
    receiverSubAccountId: SubAccountId;
}
