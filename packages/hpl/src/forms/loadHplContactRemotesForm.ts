import { Principal } from "@dfinity/principal";
import { ILoadForce } from "@ic-wallet-middleware/common";

export interface LoadHplContactRemotesForm extends ILoadForce {
    principal: Principal
}
