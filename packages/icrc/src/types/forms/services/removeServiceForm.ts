import { IFormBase } from "@ic-wallet-kit/common";

export interface RemoveServiceForm extends IFormBase {
    servicePrincipal: string;
}
