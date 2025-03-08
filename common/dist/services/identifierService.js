"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifierService = void 0;
const agent_1 = require("@dfinity/agent");
class IdentifierService {
    constructor(agent, identity) {
        this._agent = agent;
        this._identity = identity;
    }
    _agent;
    _identity;
    getAgent() {
        return this._agent;
    }
    getPrincipal() {
        return this._identity.getPrincipal();
    }
    getPrincipalStr() {
        return this.getPrincipal().toString();
    }
    getIdentity() {
        return this._identity;
    }
    async getAnonymousAgent() {
        const agent = await agent_1.HttpAgent.create({
            identity: this._identity,
            host: this._agent.host.href,
        });
        return agent;
    }
}
exports.IdentifierService = IdentifierService;
