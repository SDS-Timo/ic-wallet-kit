import { ILoadForce } from "@ic-wallet-kit/common";

export interface GetListAllowanceForm extends ILoadForce {
    ledgerAddress: string;
}
