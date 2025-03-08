# Virtual Account Handlers

Handlers for work with virtual accounts.

---

- [AddHplVirtualAccountHandler](#addhplvirtualaccounthandler)
- [CheckLinkCodeHandler](#checklinkcodehandler)
- [DeleteHplVirtualAccountHandler](#deletehplvirtualaccounthandler)
- [EditHplVirtualAccountHandler](#edithplvirtualaccounthandler)
- [GetHplVirtualAccountListHandler](#gethplvirtualaccountlisthandler)
- [ResetHplVirtualAccountHandler](#resethplvirtualaccounthandler)

## AddHplVirtualAccountHandler

Add virtual account to current user virtual account list.

---

**input:**

```typescript
{
    virtualAccountName: string;
    assetId: bigint;
    accountId: bigint,
    accessByPrincipal: Principal,
    amount: bigint,
    expiration?: bigint
}
```

**output:**

```typescript
{
    data:{
        virtualAccountId: bigint;
        code: string;
        name: string;
        amount: bigint;
        currencyAmount: string;
        accessBy: string;
        isMint: boolean;
        accountId: bigint;
        assetId: bigint;
        assetSymbol: string;
        expiration?: bigint;
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
import { Principal } from "@dfinity/principal";
import { AddHplVirtualAccountHandler } from "@ic-wallet-middleware/hpl";
import Container from "typedi";

(async () => {
    const addHplVirtualAccountHandler = Container.get(AddHplVirtualAccountHandler);
    const result = await addHplVirtualAccountHandler.handle({
        assetId: 1n,
        accountId: 1n,
        virtualAccountName: "Test",
        accessByPrincipal: Principal.fromText("principal"),
        amount: 1n
    });
    console.log(result);
})()
```

**result:**

```typescript
{
    data: {
        accessBy: "principal",
        accountId: 1n,
        amount: 1n,
        assetId: 1n,
        assetSymbol: "T",
        name: "Test",
        virtualAccountId: 1n,
        currencyAmount: "",
        code: "043",
        isMint: false
    },
    isSuccess: true,
    errors: []
}
```

## CheckLinkCodeHandler

Check and verification link code.

---

**input:**

```typescript
{
    linkCode: string;
}
```

**output:**

```typescript
{
    data: {
        remoteInfo: HplRemote | undefined;
        owner: Principal | undefined;
        error: string;
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
import { LoadType } from "@ic-wallet-middleware/common";
import { CheckLinkCodeHandler } from "@ic-wallet-middleware/hpl";
import Container from "typedi";

(async () => {
    const checkLinkCodeHandler = Container.get(CheckLinkCodeHandler);
    const result = await checkLinkCodeHandler.handle({
        linkCode: "043"
    });
    console.log(result);
})()
```

**result:**

```typescript
{
    data: {
        owner: Principal,
        remoteInfo: {
            amount: "2",
            assetId: "6",
            assetLogo: "",
            assetName: "Test",
            assetSymbol: "Test",
            code: "043",
            expired: 0,
            name: "",
            remoteAccountId: "3",
        },
        error: ""
    },
    isSuccess: true,
    errors: []
}
```

## DeleteHplVirtualAccountHandler

Delete virtual account from HPL service and from Storage user list.

---

**input:**

```typescript
{
    virtualAccountId: bigint;
}
```

**output:**

```typescript
{
    data: {},
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
import { DeleteHplVirtualAccountHandler } from "@ic-wallet-middleware/hpl";
import Container from "typedi";

(async () => {
    const deleteHplVirtualAccountHandler = Container.get(DeleteHplVirtualAccountHandler);
    const result = await deleteHplVirtualAccountHandler.handle({
        virtualAccountId: 1n
    });
    console.log(result);
})()
```

**result:**

```typescript
{
    data: {},
    isSuccess: true,
    errors: []
}
```


## EditHplVirtualAccountHandler

Edit virtual account to current user virtual account list.

---

**input:**

```typescript
{
    virtualAccountId: bigint;
    virtualAccountName: string;
    accountId: bigint,
    amount: bigint,
    expiration?: bigint
}
```

**output:**

```typescript
{
    data: {
        virtualAccountId: bigint;
        code: string;
        name: string;
        amount: bigint;
        currencyAmount: string;
        accessBy: string;
        isMint: boolean;
        accountId: bigint;
        assetId: bigint;
        assetSymbol: string;
        expiration?: bigint;
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
import { EditHplVirtualAccountHandler } from "@ic-wallet-middleware/hpl";
import Container from "typedi";

(async () => {
    const editHplVirtualAccountHandler = Container.get(EditHplVirtualAccountHandler);
    const result = await editHplVirtualAccountHandler.handle({
        accountId: 1n,
        virtualAccountId: 1n,
        virtualAccountName: "Test VA",
        amount: 2n
    });
    console.log(result);
})()
```

**result:**

```typescript
{
    data: {
        virtualAccountId: 1n,
        code: "043",
        name: "Test VA",
        amount: 2n,
        currencyAmount: "",
        accessBy: "",
        isMint: false,
        accountId: 1n,
        assetId: 1n,
        assetSymbol: ""
    },
    isSuccess: true,
    errors: []
}
```

## GetHplVirtualAccountListHandler

Get virtual account list for current user.

| LoadType       | Load Data                                                                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| LoadType.Cache | Loads all data from local cache                                                                                                              |
| LoadType.Quick | Loads VirtualAccounts, VirtualAccountInfo, OwnerLookup, IsHplMinter from local cache. Loads VirtualAccountsState from canister |
| LoadType.Full  | Loads all data from canister                                                                                                                 |

---

**input:**

```typescript
{
    loadType: LoadType;
}
```

**output:**

```typescript
{
  data:{
    virtualAccount: HplVirtualAccount[];
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
import { LoadType } from "@ic-wallet-middleware/common";
import { GetHplAccountListHandler } from "@ic-wallet-middleware/hpl";
import Container from "typedi";

(async () => {
    const getHplAccountListHandler = Container.get(GetHplAccountListHandler);
    const result = await getHplAccountListHandler.handle({
        loadType: LoadType.Cache
    });
    console.log(result);
})()
```

**result:**

```typescript
{
  data: {
    virtualAccount: [{
        virtualAccountId: BigInt(1),
        accountId: BigInt(0),
        accessBy: "",
        amount: BigInt(0),
        code: "",
        currencyAmount: "",
        isMint: false,
        name: "",
        expiration: undefined
    },
    {
        virtualAccountId: BigInt(2),
        accountId: BigInt(0),
        accessBy: "",
        amount: BigInt(0),
        code: "",
        currencyAmount: "",
        isMint: false,
        name: "",
        expiration: undefined
    }]
  },
  isSuccess: true,
  errors: []
}
```

## ResetHplVirtualAccountHandler

Reset of virtual account amount.

---

**input:**

```typescript
{
    virtualAccountId: bigint;
}
```

**output:**

```typescript
{
    data:{},
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
import { ResetHplVirtualAccountHandler } from "@ic-wallet-middleware/hpl";
import Container from "typedi";

(async () => {
    const resetHplVirtualAccountHandler = Container.get(ResetHplVirtualAccountHandler);
    const result = await resetHplVirtualAccountHandler.handle({
        virtualAccountId: 1n
    });
    console.log(result);
})()
```

**result:**

```typescript
{
    data: {},
    isSuccess: true,
    errors: []
}
```
