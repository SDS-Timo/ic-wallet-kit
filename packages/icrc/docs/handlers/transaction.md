# Transaction Handlers

Handlers for work with transactions.

---

- [GetListTransactionHandler](#getlisttransactionhandler)
- [SendTransactionHandler](#sendtransactionhandler)

## GetListTransactionHandler

Get transactions for selected asset and sub account.

---

**input:**

```typescript
{
    ledgerAddress: string;
    subAccountId?: SubAccountId;
    pageInfo: PageInfo;
}
```

**output:**

```typescript
{
  data:{
    transactions: TransactionModel[];
    pageResult: PageResult;
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
import { GetListTransactionHandler } from "@ic-wallet-kit/icrc";
import Container from "typedi";

(async () => {
    const getListTransactionHandler = Container.get(GetListTransactionHandler);
    const result = await getListTransactionHandler.handle({
      ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
      pageInfo: {
        take: 10
      }
    });
    console.log(result);
})()
```

**result:**

```typescript
{
  data: {
    transactions: [{
          status: "COMPLETED",
          hash: "d1cdf7693bab94d7218e7998868359396afab0fb130242ebe5919a41dc6f05f6-b68ad8de9e71e138eb2be6d0ccab447505457bfe50d9bd63c70d217895e2127a",
          timestamp: 1734611372148,
          from: "5148756f3f5c7684ab80d3f85f1361297ce1c62ac01dedd4551ec6d7c8e49092",
          type: "RECEIVE",
          amount: "0",
          canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
          idx: "17574813",
          symbol: "ICP",
          to: "065fcc3f8be2b6b8e20f42e397b17485d875100c59e4f9986334547bb30bc62d",
          fee: "-10000"
      },
      {
          status: "COMPLETED",
          hash: "800bc47ac1f0a8d0097daee3a537e3efcc7fc8a6fe685850ce5cb9de538b2f4b-6adac7e1775215ceb72fe391d5a88eef2d1a6d2b28e974bf8fc0fcf6b6d73115",
          timestamp: 1734027146449,
          from: "065fcc3f8be2b6b8e20f42e397b17485d875100c59e4f9986334547bb30bc62d",
          type: "SEND",
          amount: "0",
          canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
          idx: "17272301",
          symbol: "ICP",
          to: "afabee8b5b2bcf94215cfecee1c986ae59f9f1a4d3d876d8581d211868fa53ac",
          fee: "-10000"
      },
    ],
    pageResult: {
      hasNext: false
    }
  }
  isSuccess: true,
  errors: []
}
```

## SendTransactionHandler

Transfer from asset to asset.

---

**input:**

```typescript
{
  ledgerAddress: string;
  subAccountId: SubAccountId;
  receiverAccountPrincipal: Principal;
  receiverSubAccountId: SubAccountId;
  amount: Amount;
}
```

**output:**

```typescript
{
  data:{
    transactions: TransactionModel[];
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
import { SendTransactionHandler, SubAccountId } from "@ic-wallet-kit/icrc";
import Container from "typedi";

(async () => {
    const sendTransactionHandler = Container.get(SendTransactionHandler);
    const result = await sendTransactionHandler.handle({
      ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
      subAccountId: SubAccountId.parseFromString("0x0"),
      receiverAccountPrincipal: Principal.fromText("svyv3-apmhd-zl4qv-4k422-25fte-eizwx-o66gb-sqw5u-64jzg-w5m56-nae"),
      receiverSubAccountId: SubAccountId.parseFromString("0x0"),
      amount: "0.0001"
    });
    console.log(result);
})()
```

**result:**

```typescript
{
  data: {
    transactions: [
      {
        status: "COMPLETED",
        hash: "d99133ff55b962a319a3d3123344b06b271823910e30f856e81f22f1edcd45c4-7f3ff61f79c5d5ed02d49a4ffbb53e0bf4f5457a1e74b427f0a149188066ed2b",
        timestamp: 1735208462435,
        from: "065fcc3f8be2b6b8e20f42e397b17485d875100c59e4f9986334547bb30bc62d",
        type: "SEND",
        amount: "10000",
        canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
        idx: "17882480",
        symbol: "ICP",
        to: "0c5e7b0583545a6413de35d5a3507825a1a68f02ab0fd4160c97b9483d516dcb",
        fee: "-10000"
      }
    ]
  },
  isSuccess: true,
  errors: []
}
```
