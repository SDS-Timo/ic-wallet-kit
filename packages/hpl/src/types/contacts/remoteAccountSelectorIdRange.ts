import { Principal } from "@dfinity/principal";

export interface RemoteAccountSelectorIdRange {
    idRange: [Principal, bigint, [] | [bigint]]
}