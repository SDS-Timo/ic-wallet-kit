import { Principal } from "@dfinity/principal";

export interface RemoteAccountSelectorId {
    id: [Principal, bigint]
}