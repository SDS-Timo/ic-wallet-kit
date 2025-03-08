# ReplicationConfiguration

Configuration for RxDB replication between the clients and the server. More info [here](https://rxdb.info/replication.html)

### Properties

- *enable*: boolean. Enables the replication.
- *host*: string. The host to use for the HttpAgent.
- *plicaCanister*: string. Canister Id.

### Example

```typescript
import { ReplicationConfiguration } from "@ic-wallet-middleware/common";

const replicationConfiguration: ReplicationConfiguration = {
        enable: true,
        host: "http://127.0.0.1:8000/",
        replicaCanister: "bkyz2-fmaaa-aaaaa-qaaaq-cai"
    }
```
