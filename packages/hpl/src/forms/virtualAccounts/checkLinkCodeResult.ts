import { Principal } from "@dfinity/principal";
import { HplRemote } from "@hpl/types";

export interface CheckLinkCodeResult {
    remoteInfo: HplRemote | undefined;
    owner: Principal | undefined;
    error: string;
}