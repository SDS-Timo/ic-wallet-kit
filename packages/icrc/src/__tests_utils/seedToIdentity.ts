import { AnonymousIdentity, HttpAgent, Identity } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/identity";

import { IdentifierService } from "@ic-wallet-kit/common";

export function seedToIdentity(seed: string): Identity {
    const seedBuf = new Uint8Array(new ArrayBuffer(32));
    seedBuf.set(new TextEncoder().encode(seed));
    return Ed25519KeyIdentity.generate(seedBuf);
}

export function seedToIdentifierService(seed: string): IdentifierService {
    const secpIdentity = seedToIdentity(seed);
    const agent = HttpAgent.createSync({
        identity: secpIdentity,
        verifyQuerySignatures: false,
        host: "https://identity.ic0.app",
        retryTimes: 8
    });

    const identifierService = new IdentifierService(agent, secpIdentity);

    return identifierService;
}

export function mockAnonymousIdentifierService(): IdentifierService {
    const identity = new AnonymousIdentity();
    const agent = HttpAgent.createSync({
        identity: identity,
        verifyQuerySignatures: false,
        host: "https://identity.ic0.app",
        retryTimes: 8
    });

    const identifierService = new IdentifierService(agent, identity);

    return identifierService;
}
