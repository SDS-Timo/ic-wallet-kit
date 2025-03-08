import { HttpAgentRequest, Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

export class WatchOnlyIdentity implements Identity {

    private principal: Principal;

    constructor(principal: string) {
        this.principal = Principal.fromText(principal);
    }

    public getPrincipal(): Principal {
        return this.principal;
    }

    public transformRequest(request: HttpAgentRequest): Promise<unknown> {
        const result = {
            ...request,
            body: { content: request.body }
        };

        return Promise.resolve(result);
    }
}