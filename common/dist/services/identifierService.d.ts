import { HttpAgent, Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
export declare class IdentifierService {
    constructor(agent: HttpAgent, identity: Identity);
    private _agent;
    private _identity;
    getAgent(): HttpAgent;
    getPrincipal(): Principal;
    getPrincipalStr(): string;
    getIdentity(): Identity;
    getAnonymousAgent(): Promise<HttpAgent>;
}
