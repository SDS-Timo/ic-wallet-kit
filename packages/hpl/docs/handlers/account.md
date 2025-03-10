# Account Handlers

Handlers for work with accounts.

---

- [AddHplAccountHandler](#addhplaccounthandler)
- [EditHplAccountHandler](#edithplaccounthandler)
- [GetHplAccountListHandler](#gethplaccountlisthandlerr)

## AddHplAccountHandler

Add account to current user account list.

---

**input:**

```typescript
{
    assetId: bigint;
    accountName: string;
}
```

**output:**

```typescript
{
    data:{
        account: HplAccount;
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
import { AddHplAccountHandler } from "@ic-wallet-kit/hpl";
import Container from "typedi";

(async () => {
    const addHplAccountHandler = Container.get(AddHplAccountHandler);
    const result = await addHplAccountHandler.handle({
        assetId: 1n,
        accountName: "Test"
    });
    console.log(result);
})()
```

**result:**

```typescript
{
    data: {
        account:
            {
                accountId: 2n,
                name: "Test",
                amount: 0n,
                currencyAmount: "0",
                transactionFee: "50000",
                ft: 1n,
                virtuals: []
            }
    },
    isSuccess: true,
    errors: []
}
```

## EditHplAccountHandler

Edit account to current user account list.

---

**input:**

```typescript
{
    accountId: string;
    name: string;
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
import { EditHplAccountHandler } from "@ic-wallet-kit/hpl";
import Container from "typedi";

(async () => {
    const editHplAccountHandler = Container.get(EditHplAccountHandler);
    const result = await editHplAccountHandler.handle({
        accountId: "3",
        name: "Test"
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

## GetHplAccountListHandler

Get account list for current user.

| LoadType       | Load Data                                                                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| LoadType.Cache | Loads all data from local cache                                                                                                              |
| LoadType.Quick | Loads Accounts, AccountInfo, VirtualAccounts, VirtualAccountInfo, OwnerLookup, IsHplMinter from local cache. Loads AccountState and VirtualAccountsState from canister |
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
    ftAssets: HplAsset[];
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
import { LoadType } from "@ic-wallet-kit/common";
import { GetHplAccountListHandler } from "@ic-wallet-kit/hpl";
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
    account:
      {
          accountId: 2n,
          name: "Test",
          amount: 0n,
          currencyAmount: "0",
          transactionFee: "50000",
          ft: 1n,
          virtuals: []
      }
  },
  isSuccess: true,
  errors: []
}
```
