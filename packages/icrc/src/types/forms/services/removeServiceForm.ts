import { IFormBase } from "@ic-wallet-middleware/common";

export interface RemoveServiceForm extends IFormBase {
    servicePrincipal: string;
}
