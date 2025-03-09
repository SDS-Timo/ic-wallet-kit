import { AnonymousIdentity, HttpAgent } from "@dfinity/agent";
import { IdentifierService, WatchOnlyIdentity } from "@ic-wallet-kit/common";
import Container from "typedi";

export const runWatchOnly = async () => {

    const identity = new AnonymousIdentity();

    const agent = await HttpAgent.create({
        identity: identity,
        host: "https://identity.ic0.app",
    });

    const watchOnly = new WatchOnlyIdentity("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe");

    const identifierService = new IdentifierService(agent, watchOnly);

    Container.set(IdentifierService, identifierService);
}
