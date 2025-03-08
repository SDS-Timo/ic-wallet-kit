import { IFormBase } from "@ic-wallet-middleware/common";

export interface EditServiceNameForm extends IFormBase {
    servicePrincipal: string;
    newName: string;
}
