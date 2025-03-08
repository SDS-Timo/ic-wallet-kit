import { HttpAgentRequest, Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
export declare class WatchOnlyIdentity implements Identity {
    private principal;
    constructor(principal: string);
    getPrincipal(): Principal;
    transformRequest(request: HttpAgentRequest): Promise<unknown>;
}
