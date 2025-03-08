## HPL Wallet

HPL Wallet is a library for the high-performance ledger. This library allows users to manage their digital assets and perform transactions with major HPL system.

---

### Installation

To install this library to an external project, follow the procedure:

```
npm install @ic-wallet-middleware/common
npm install @ic-wallet-middleware/hpl
```

---

### Configuration

Use **HplInitializer** to register initial containers and init middleware process

- **HplInitializer.build** - Register all initial containers.
- **HplInitializer.init** - Init background middleware process. Like RxDb and replication of it.
- **HplInitializer.logout** - Destroy all containers.

The `HplInitializer.build` function takes the parameters:

| Param                                                                | Description                                                                                                              |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [IdentifierService](/packages/common/docs/identifierService.md)               | Middleware identity services.                                                                                            |
| [RxStorage](https://rxdb.info/rx-storage.html)                               | RxDb storage. Dependent from app environment. Find more info at [https://rxdb.info/rx-storage.html](https://rxdb.info/rx-storage.html)                        |
| [IStorage](/packages/common/docs/iStorage.md)                                 | Storage for cache and other temporal data of middleware, could be either memory storage or local storage in the browser. |
| [ILogger](/packages/common/docs/iLogger.md)           | Interface of middleware logs.                                                                                            |
| [RefreshServiceConfiguration](/packages/common/docs/refreshServiceConfiguration.md)               | Refresh Service configuration                                                                                               |
| [ReplicationConfiguration](/packages/common/docs/replicationConfiguration.md) | Replication configuration.                                                                                               |
| [CanisterService](/packages/hpl/docs/canisterService.md)                   | Canister Service configuration.                                                                                          |
| [createHplCanisterFunc](/packages/hpl/docs/createHplCanisterFunc.md)       | Function to connect with replication canister.                                                                           |

#### Example

```typescript
import { Logger } from "@app/main";
import { HttpAgent } from "@dfinity/agent";
import { IdentifierService, RefreshServiceConfiguration, ReplicationConfiguration } from "@ic-wallet-middleware/common";
import { CanisterService, HplInitializer } from "@ic-wallet-middleware/hpl";
import "reflect-metadata";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { createActor as hplCreator } from "./database/candid/hpl";

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

    const refreshServiceConfiguration: RefreshServiceConfiguration =
    {
        refreshIntervalMinutes: 2,
        enable: false // enable if need auto-refresh data
    };

    const canisterService = new CanisterService("dodxy-giaaa-aaaaj-azula-cai",
        "lpwlq-2iaaa-aaaap-ab2vq-cai",
        "n65ik-oqaaa-aaaag-acb4q-cai");

    const hplReplicationConfiguration: ReplicationConfiguration = {
        enable: false, // enable if need sync with remote RxDB
        host: "http://127.0.0.1:8000/",
        replicaCanister: "bkyz2-fmaaa-aaaaa-qaaaq-cai"
    }


    HplInitializer.build(
        identifierService,
        getRxStorageMemory(),
        localStorage,
        logger,
        refreshServiceConfiguration,
        hplReplicationConfiguration,
        canisterService,
        hplCreator);

    await HplInitializer.init();
})()
```

---

### HPL Modules

[HPL Assets](/packages/hpl/docs/handlers/asset.md) - asset handlers facilitate operations related to Assets. Each handler is responsible for a specific action such as adding, updating, checking, or removing assets.

[HPL Account](/packages/hpl/docs/handlers/account.md) - account handlers facilitate operations related to Accounts. Each handler is responsible for a specific action such as adding, updating, checking, or removing account.

[HPL Virtual Account](/packages/hpl/docs/handlers/virtualAccount.md) - virtual account handlers facilitate operations related to Virtual Accounts. Each handler is responsible for a specific action such as adding, updating, checking, or removing virtual account.

[HPL Contact](/packages/hpl/docs/handlers/contact.md) - contact handlers manage and process contacts. These handlers provide functionality for adding, updating, and removing contacts.

[HPL Check Principal](/packages/hpl/docs/handlers/check.md) - principal handlers responsible for checking principal of canister.

[HPL Transfer](/packages/hpl/docs/handlers/transfer.md) - transfer handlers responsible for transfer from account or link to account or link.

---

### Function

Public functions for work with handlers. [List of functions](/packages/hpl/docs/functions.md).