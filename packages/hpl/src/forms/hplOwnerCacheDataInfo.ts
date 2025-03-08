import { Principal } from "@dfinity/principal";
import { ILoadForce } from "@ic-wallet-kit/common";

export interface HplOwnerCacheDataInfo extends ILoadForce {
    principal: Principal
}
