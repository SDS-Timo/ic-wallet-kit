import { IFormBase } from "@ic-wallet-kit/common";

export interface AddServiceForm extends IFormBase {
    servicePrincipal: string;
    newName: string;
}
