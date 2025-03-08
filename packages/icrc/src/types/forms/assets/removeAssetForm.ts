import { IFormBase } from "@ic-wallet-middleware/common";


export interface RemoveAssetForm extends IFormBase {
    ledgerAddress: string;
}
