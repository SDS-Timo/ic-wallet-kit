import { IFormBase } from "@ic-wallet-kit/common";
import { SubAccountId } from "@icrc/types";


export interface AddSubAccountForm extends IFormBase {
    ledgerAddress: string;
    subAccountName: string;
    subAccountId: SubAccountId;
}
