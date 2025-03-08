import { IFormBase } from "@ic-wallet-kit/common";

export interface RemoveServiceAssetForm extends IFormBase {
    servicePrincipal: string;
    ledgerAddress: string;
}
