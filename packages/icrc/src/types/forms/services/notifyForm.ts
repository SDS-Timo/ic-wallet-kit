import { IFormBase } from "@ic-wallet-kit/common";

export interface NotifyForm extends IFormBase {
    servicePrincipal: string;
    ledgerAddress: string;
}
