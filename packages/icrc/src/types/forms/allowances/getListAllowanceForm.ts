import { ILoadForce } from "@ic-wallet-middleware/common";

export interface GetListAllowanceForm extends ILoadForce {
    ledgerAddress: string;
}
