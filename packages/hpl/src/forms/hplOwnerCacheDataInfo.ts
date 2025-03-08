import { Principal } from "@dfinity/principal";
import { ILoadForce } from "@ic-wallet-middleware/common";

export interface HplOwnerCacheDataInfo extends ILoadForce {
    principal: Principal
}
