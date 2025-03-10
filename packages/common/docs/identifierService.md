# IdentifierService

Middleware identity services.

```typescript
const identifierService = new IdentifierService(agent, identity)
```

- **agent** - HttpAgent from *@dfinity/agent*
- **identity** - Identity from *@dfinity/agent*

### Example

```typescript
import { HttpAgent } from "@dfinity/agent";
import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
import { IdentifierService } from "@ic-wallet-kit/common";

(async () => {
    const identity = Secp256k1KeyIdentity.fromSeedPhrase("phrase");
    const agent = await HttpAgent.create({
        identity: identity,
        host: "https://identity.ic0.app"
    });
    const identifierService = new IdentifierService(agent, identity)
})()
```