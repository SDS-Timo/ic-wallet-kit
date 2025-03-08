import { IFormBase } from "@ic-wallet-middleware/common";


export interface CheckServicePrincipalForm extends IFormBase {
    servicePrincipal: string;
}
