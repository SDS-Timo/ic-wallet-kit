import { IFormBase } from "@ic-wallet-middleware/common";
import { SubAccountId } from "@icrc/types";


export interface AddSubAccountForm extends IFormBase {
    ledgerAddress: string;
    subAccountName: string;
    subAccountId: SubAccountId;
}
