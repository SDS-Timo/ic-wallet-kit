import { IFormBase } from "@ic-wallet-middleware/common";

export interface AddServiceAssetListForm extends IFormBase {
    servicePrincipal: string;
    ledgerAddresses: string[]
}
