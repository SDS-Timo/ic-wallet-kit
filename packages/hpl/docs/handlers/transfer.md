# Transfer Handlers

Handlers for work with transfer.

---

- [GetHplFeeConstantHandler](#gethplfeeconstanthandler)
- [TransferHandler](#transferhandler)

## GetHplFeeConstantHandler

Get fee constant for current user ledger canister.

| LoadType       | Load Data                        |
| -------------- | -------------------------------- |
| LoadType.Cache | Loads feeRatio from local cache  |
| LoadType.Quick | Loads feeRatio from local cache |
| LoadType.Full  | Loads feeRatio from canister     |

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
        feeConstant: bigint;
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
import { GetHplFeeConstantHandler } from "@ic-wallet-kit/hpl";
import Container from "typedi";

(async () => {
    const getHplFeeConstantHandler = Container.get(GetHplFeeConstantHandler);
    const result = await getHplFeeConstantHandler.handle({
        loadType: LoadType.Cache
    });
    console.log(result);
})()
```

**result:**

```typescript
{
    data: {
        feeConstant: 0n
    },
    isSuccess: true,
    errors: []
}
```

## TransferHandler

Transfer from account or link to account or link.

---

**input:**

```typescript
{
    txFrom: ITransferModel;
    txTo: ITransferModel;
    amount: Amount;
    assetId: bigint;
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
import { TransferHandler } from "@ic-wallet-kit/hpl";
import Container from "typedi";

(async () => {
    const transferHandler = Container.get(TransferHandler);
    const result = await transferHandler.handle({
        txFrom: {
            type: "sub",
            id: 1n
        },
        txTo: {
            type: "vir",
            id: 3n,
            owner: "principal"
        },
        amount: "10",
        assetId: 3n
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
