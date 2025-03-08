import { IFormBase } from "@ic-wallet-kit/common";
import { SubAccountId } from "@icrc/types";


export interface RemoveSubAccountForm extends IFormBase {
    ledgerAddress: string;
    subAccountId: SubAccountId;
}
