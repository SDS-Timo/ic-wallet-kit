import { IFormBase } from "@ic-wallet-middleware/common";


export interface CheckAssetForm extends IFormBase {
    indexAddress: string;
    ledgerAddress: string;
}
