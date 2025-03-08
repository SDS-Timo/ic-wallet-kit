# ICRC

ICRC is a library for Internet Computer Network. This library allows users to manage their digital assets and perform transactions with major ICRC cryptocurrencies.

---

### Installation

To install this library to an external project, follow the procedure:

```
npm install @ic-wallet-middleware/common
npm install @ic-wallet-middleware/icrc
```

---

### Configuration

Use **IcrcInitializer** to register initial containers and init middleware process

- **IcrcInitializer.build** - Register all initial containers.
- **IcrcInitializer.init** - Init background middleware process. Like RxDb and replication of it.
- **IcrcInitializer.logout** - Destroy all containers.

The `IcrcInitializer.build` function takes the parameters:

| Param                                                                           | Description                                                                                                             |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [IdentifierService](/packages/common/docs/identifierService.md)                             | Middleware identity services                                                                                            |
| [RxStorage](https://rxdb.info/rx-storage.html )                                             | RxDb storage. Dependent from app environment. Find more info at [https://rxdb.info/rx-storage.html](https://rxdb.info/rx-storage.html)                       |
| [IStorage](/packages/common/docs/iStorage.md)                                               | Storage for cache and other temporal data of middleware, could be either memory storage or local storage in the browser |
| [ILogger](/packages/common/docs/iLogger.md)                                                 | Interface of middleware logs.                                                                                           |
| [AssetManagerConfiguration](/packages/icrc/docs/assetManagerConfiguration.md)             | Asset data configuration                                                                                                |
| [TransactionManagerConfiguration](/packages/icrc/docs/transactionManagerConfiguration.md) | Transaction configuration                                                                                               |
| [RefreshServiceConfiguration](/packages/common/docs/refreshServiceConfiguration.md)               | Refresh Service configuration                                                                                               |
| [ReplicationConfiguration](/packages/common/docs/replicationConfiguration.md)               | Replication configuration                                                                                               |
| [createIcrcCanisterFunc](/packages/icrc/docs/createIcrcCanisterFunc.md)                   | Function to connect with replication canister                                                                           |


#### Example

```typescript
import { IdentifierService, RefreshServiceConfiguration, ReplicationConfiguration } from "@ic-wallet-middleware/common";
import { AssetManagerConfiguration, IcrcInitializer, TransactionManagerConfiguration } from "@ic-wallet-middleware/icrc";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { createActor } from "./database/candid";
import "reflect-metadata";
import { HttpAgent } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { Logger } from "@app/main";

(async () => {
    const logger = new Logger();

    const seedBuf = new Uint8Array(new ArrayBuffer(32));
    seedBuf.set(new TextEncoder().encode("seed"));
    const secpIdentity = Ed25519KeyIdentity.generate(seedBuf);

    const agent = await HttpAgent.create({
        identity: secpIdentity,
        verifyQuerySignatures: false,
        host: "https://identity.ic0.app",
        retryTimes: 10
    });

    const identifierService = new IdentifierService(agent, secpIdentity);

    const assetManagerConfiguration: AssetManagerConfiguration = {
        defaultDateTimeFormat: "MM/DD/YYYY HH:mm"
    };

    const transactionManagerConfiguration: TransactionManagerConfiguration = {
        icpUrl: "https://rosetta-api.internetcomputer.org",
        ogyUrl: "https://rosetta-ogy.origyn.ch",
        icpNetwork: "00000000000000020101",
        ogyNetwork: "00000000012000b90101",
        icpBlockchain: "Internet Computer",
        ogyBlockchain: "ORIGYN Foundation"
    };

    const refreshServiceConfiguration: RefreshServiceConfiguration =
    {
        refreshIntervalMinutes: 2,
        enable: false
    };

    const icrcReplicationConfiguration: ReplicationConfiguration = {
        enable: false,
        host: "http://127.0.0.1:8000/",
        replicaCanister: "bd3sg-teaaa-aaaaa-qaaba-cai"
    }

    IcrcInitializer.build(
        identifierService,
        getRxStorageMemory(),
        localStorage,
        logger,
        assetManagerConfiguration,
        transactionManagerConfiguration,
        refreshServiceConfiguration,
        icrcReplicationConfiguration,
        createActor
   	);

    await IcrcInitializer.init();
})()
```

---

### ICRC Modules

[ICRC Assets](/packages/icrc/docs/handlers/asset.md)

[ICRC Allowance](/packages/icrc/docs/handlers/allowance.md)

[ICRC Contact](/packages/icrc/docs/handlers/contact.md)

[ICRC Service](/packages/icrc/docs/handlers/service.md)

[ICRC Tokens](/packages/icrc/docs/handlers/token.md)

[ICRC Transaction](/packages/icrc/docs/handlers/transaction.md)

---

### Function

Public functions for work with handlers. [List of functions](/packages/icrc/docs/functions.md).