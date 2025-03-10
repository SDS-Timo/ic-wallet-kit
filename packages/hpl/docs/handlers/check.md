# Check Handlers

Handlers for check principal of the canisters.

---

- [CheckDictionaryPrincipalHandler](#checkdictionaryprincipalhandler)
- [CheckLedgerPrincipalHandler](#checkledgerprincipalhandler)

## CheckDictionaryPrincipalHandler

Check the dictionary principal of the canister.

---

**input:**

```typescript
{
    dictionaryPrincipal: string;
}
```

**output:**

```typescript
{
    data:{
        isPrincipalExist: boolean;
    },
    isSuccess: boolean,
    errors: [{
      fieldName: string;
      message: string;
      localizationKey: string;
    }]
}
```

---

### Examples

```typescript
import { CheckDictionaryPrincipalHandler } from "@ic-wallet-kit/hpl";
import Container from "typedi";

(async () => {
    const checkDictionaryPrincipalHandler = Container.get(CheckDictionaryPrincipalHandler);
    const result = await checkDictionaryPrincipalHandler.handle({
        dictionaryPrincipal: "principal"
    });
    console.log(result);
})()
```

**result:**

```typescript
{
    data: {
        isPrincipalExist: true
    },
    isSuccess: true,
    errors: []
}
```

## CheckLedgerPrincipalHandler

Check the ledger principal of the canister.

---

**input:**

```typescript
{
    ledgerPrincipal: string;
}
```

**output:**

```typescript
{
  data:{
    isPrincipalExist: boolean
  },
  isSuccess: boolean,
  errors: [{
    fieldName: string;
    message: string;
    localizationKey: string;
  }]
}
```

---

### Examples

```typescript
import { CheckLedgerPrincipalHandler } from "@ic-wallet-kit/hpl";
import Container from "typedi";

(async () => {
    const checkLedgerPrincipalHandler = Container.get(CheckLedgerPrincipalHandler);
    const result = await checkLedgerPrincipalHandler.handle({
        ledgerPrincipal: "principal"
    });
    console.log(result);
})()
```

**result:**

```typescript
{
  data: {
    isPrincipalExist: true
  },
  isSuccess: true,
  errors: []
}
```
