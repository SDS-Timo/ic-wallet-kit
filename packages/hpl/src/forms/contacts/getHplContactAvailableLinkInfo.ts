import { Principal } from "@dfinity/principal";
import { ILoadForce } from "@ic-wallet-kit/common";

export interface GetHplContactAvailableLinkInfo extends ILoadForce {
    principal: Principal;
}
