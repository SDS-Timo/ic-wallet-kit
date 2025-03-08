import { IFormBase } from "@ic-wallet-middleware/common";

export interface CheckLedgerPrincipalForm extends IFormBase {
    ledgerPrincipal: string;
}
