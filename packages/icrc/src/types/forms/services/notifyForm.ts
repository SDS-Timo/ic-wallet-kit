import { IFormBase } from "@ic-wallet-middleware/common";

export interface NotifyForm extends IFormBase {
    servicePrincipal: string;
    ledgerAddress: string;
}
