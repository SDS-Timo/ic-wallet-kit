import { IFormBase } from "@ic-wallet-kit/common";

export interface EditServiceNameForm extends IFormBase {
    servicePrincipal: string;
    newName: string;
}
