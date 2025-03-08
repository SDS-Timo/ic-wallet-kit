import { HttpAgent, Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

export class IdentifierService {

    constructor(agent: HttpAgent, identity: Identity) {
        this._agent = agent;
        this._identity = identity;
    }

    private _agent: HttpAgent;
    private _identity: Identity;

    public getAgent(): HttpAgent {
        return this._agent;
    }

    public getPrincipal(): Principal {
        return this._identity.getPrincipal();
    }
    public getPrincipalStr(): string {
        return this.getPrincipal().toString();
    }

    public getIdentity(): Identity {
        return this._identity;
    }

    public async getAnonymousAgent(): Promise<HttpAgent> {
        const agent = await HttpAgent.create({
            identity: this._identity,
            host: this._agent.host.href,
        });
        return agent;
    }
}
