import { IFormBase } from "@ic-wallet-kit/common";

export interface AddServiceAssetListForm extends IFormBase {
    servicePrincipal: string;
    ledgerAddresses: string[]
}
