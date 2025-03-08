import { Principal } from "@dfinity/principal";
import { ILoadForce } from "@ic-wallet-kit/common";

export interface LoadHplContactRemotesForm extends ILoadForce {
    principal: Principal
}
