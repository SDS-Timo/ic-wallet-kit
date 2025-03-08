import { Principal } from "@dfinity/principal";
import { ILoadForce } from "@ic-wallet-middleware/common";

export interface GetHplContactAvailableLinkInfo extends ILoadForce {
    principal: Principal;
}
