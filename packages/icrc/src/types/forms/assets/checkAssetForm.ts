import { IFormBase } from "@ic-wallet-kit/common";


export interface CheckAssetForm extends IFormBase {
    indexAddress: string;
    ledgerAddress: string;
}
