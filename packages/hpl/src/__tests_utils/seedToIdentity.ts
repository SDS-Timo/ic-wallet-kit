import { HttpAgent, Identity } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
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

export async function phraseToIdentifierService(phrase: string): Promise<IdentifierService> {

    const secpIdentity = Secp256k1KeyIdentity.fromSeedPhrase(phrase);

    const agent = await HttpAgent.create({
        identity: secpIdentity,
        verifyQuerySignatures: false,
        host: "https://identity.ic0.app",
        retryTimes: 8
    });

    const identifierService = new IdentifierService(agent, secpIdentity);

    return identifierService;
}