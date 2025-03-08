import { IFormBase } from "@ic-wallet-middleware/common";

export interface RemoveServiceAssetForm extends IFormBase {
    servicePrincipal: string;
    ledgerAddress: string;
}
