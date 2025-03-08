import { IFormBase } from "@ic-wallet-middleware/common";

export interface AddServiceForm extends IFormBase {
    servicePrincipal: string;
    newName: string;
}
