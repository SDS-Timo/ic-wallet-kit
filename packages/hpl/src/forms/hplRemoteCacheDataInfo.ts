import { Principal } from "@dfinity/principal";
import { ILoadForce } from "@ic-wallet-middleware/common";

export interface HplRemoteCacheDataInfo extends ILoadForce {
    principal: Principal
}
