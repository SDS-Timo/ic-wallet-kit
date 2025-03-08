import { IFormBase } from "@ic-wallet-kit/common";
import { SubAccountId } from "@icrc/types";


export interface UpdateSubAccountForm extends IFormBase {
    ledgerAddress: string;
    subAccountNewName: string;
    subAccountId: SubAccountId;
}
