# Canister Service

Configuration for ledger, dictionary and owner canisters.

---

### Init

```typescript
import { CanisterService } from "@ic-wallet-kit/hpl";

const canisterService = new CanisterService("ledger-canister-id",
            "dictionary-canister-id",
            "owner-canister-id");
```
---

### Canisters

- [ledger canister](https://dashboard.internetcomputer.org/canister/dodxy-giaaa-aaaaj-azula-cai) - canister for work with assets, accounts, virtual accounts.

- [dictionary canister](https://dashboard.internetcomputer.org/canister/lpwlq-2iaaa-aaaap-ab2vq-cai) - canister for work with dictionary assets.

- [owner canister](https://dashboard.internetcomputer.org/canister/n65ik-oqaaa-aaaag-acb4q-cai) - canister for work with link owners.