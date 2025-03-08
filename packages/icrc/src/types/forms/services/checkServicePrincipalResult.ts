import { IFormBase } from "@ic-wallet-middleware/common";


export interface CheckServicePrincipalResult extends IFormBase {
    isPrincipalExist: boolean;
}
