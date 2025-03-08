import { Principal } from "@dfinity/principal";
import { ILoadForce } from "@ic-wallet-kit/common";

export interface HplRemoteCacheDataInfo extends ILoadForce {
    principal: Principal
}
