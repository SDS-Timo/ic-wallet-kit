# Asset Handlers

Handlers for work with Assets and SubAccounts.

---

- [AddAssetHandler](#addassethandler)
- [AddSubAccountHandler](#addsubaccounthandler)
- [CheckAssetHandler](#checkassethandler)
- [GetListAssetHandler](#getlistassethandler)
- [RemoveAssetHandler](#removeassethandler)
- [RemoveSubAccountHandler](#removesubaccounthandler)
- [UpdateAssetHandler](#updateassethandler)
- [UpdateSubAccountHandler](#updatesubaccounthandler)

## AddAssetHandler

Add asset to current user asset list.

---

**input:**

```typescript
{
    indexAddress: string;
    ledgerAddress: string;
    name: string;
    symbol: string;
    shortDecimal: number;
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
import { AddAssetHandler } from "@ic-wallet-kit/icrc";
import Container from "typedi";

(async () => {
    const addAssetHandler = Container.get(AddAssetHandler);
    const result = await addAssetHandler.handle({
        ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
        indexAddress:  "0",
        name: "Internet Computer",
        symbol:  "ICP",
        shortDecimal: 8
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

## AddSubAccountHandler

Add sub account to current user asset.

---

**input:**

```typescript
{
    ledgerAddress: string;
    subAccountName: string;
    subAccountId: SubAccountId;
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
import { AddSubAccountHandler, SubAccountId } from "@ic-wallet-kit/icrc";
import Container from "typedi";

(async () => {
    const addSubAccountHandler = Container.get(AddSubAccountHandler);
    const result = await addSubAccountHandler.handle({
        ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
        subAccountId:  SubAccountId.parseFromString("0x1"),
        subAccountName: "SubAccount 1"
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

## CheckAssetHandler

Check if asset canister exist.

---

**input:**

```typescript
{
    indexAddress: string;
    ledgerAddress: string;
}
```

**output:**

```typescript
{
  data:{
    indexAddress: string;
    ledgerAddress: string;
    decimal?: number;
    name?: string;
    symbol?: string;
    transactionFee?: bigint;
    indexResult: ManualAssetValidationResult;
    contractResult: ManualAssetValidationResult;
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
import { CheckAssetHandler } from "@ic-wallet-kit/icrc";
import Container from "typedi";

(async () => {
    const checkAssetHandler = Container.get(CheckAssetHandler);
    const result = await checkAssetHandler.handle({
        ledgerAddress: "tyyy3-4aaaa-aaaaq-aab7a-cai",
        indexAddress:  "efv5g-kqaaa-aaaaq-aacaa-cai"
    });
    console.log(result);
})()
```

**result:**

```typescript
{
  data:  {
    indexAddress: "efv5g-kqaaa-aaaaq-aacaa-cai",
    ledgerAddress: "tyyy3-4aaaa-aaaaq-aab7a-cai",
    decimal: 8,
    name: "Gold Governance Token",
    symbol: "GLDGov",
    transactionFee: 100000n,
    contractResult: {
      isSuccess: true,
      message: "Ledger interface recognized. It is recommended not to change the token's symbol, name and decimals",
      localizationCode": "contractAddress.success"
    },
    indexResult: {
      isSuccess: true,
      message: "Index interface recognized",
      localizationCode: "indexAddress.success"
    },
  },
  isSuccess: true,
  errors: []
}
```

## GetListAssetHandler

Get asset list for current user.

| LoadType       | Load Data                                                                         |
| -------------- | --------------------------------------------------------------------------------- |
| LoadType.Cache | Loads all data from local cache                                                   |
| LoadType.Quick | Loads Metadata and TransactionFee from local cache. Loads Balance from canister |
| LoadType.Full  | Loads all data from canister                                                      |

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
    assets: AssetView[];
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
import { GetListAssetHandler } from "@ic-wallet-kit/icrc";
import Container from "typedi";

(async () => {
    const getListAssetHandler = Container.get(GetListAssetHandler);
    const result = await getListAssetHandler.handle({
        loadType: LoadType.Cache
    });
    console.log(result);
})()
```

**result:**

```typescript
{
  data: {
    assets: [{
        "ledgerAddress": "ryjl3-tyaaa-aaaaa-aaaba-cai",
        "indexAddress": "0",
        "name": "Internet Computer",
        "tokenName": "Internet Computer",
        "sortOrder": 0,
        "decimal": 8,
        "logo": "",
        "subAccounts": [
            {
                "ledgerAddress": "ryjl3-tyaaa-aaaaa-aaaba-cai",
                "name": "Default",
                "balance": "28241973",
                "currencyAmount": "3.15",
                "decimal": 8,
                "subAccountId": "0x0",
                "isSync": true
            }
        ],
        "symbol": "ICP",
        "tokenSymbol": "ICP",
        "shortDecimal": 8,
        "transactionFee": "10000",
        "supportedStandards": [
            "ICRC-1",
            "ICRC-2"
        ],
        "isSync": true
    },
    {
        "ledgerAddress": "mxzaz-hqaaa-aaaar-qaada-cai",
        "indexAddress": "n5wcd-faaaa-aaaar-qaaea-cai",
        "name": "ckBTC",
        "tokenName": "ckBTC",
        "sortOrder": 2,
        "decimal": 8,
        "logo": "",
        "subAccounts": [
            {
                "ledgerAddress": "mxzaz-hqaaa-aaaar-qaada-cai",
                "name": "Default",
                "balance": "0",
                "currencyAmount": "0.00",
                "decimal": 8,
                "subAccountId": "0x0",
                "isSync": true
            }
        ],
        "symbol": "ckBTC",
        "tokenSymbol": "ckBTC",
        "shortDecimal": 8,
        "transactionFee": "10",
        "supportedStandards": [
            "ICRC-1",
            "ICRC-2"
        ],
        "isSync": true
    }]
  },
  isSuccess: true,
  errors: []
}
```

## RemoveAssetHandler

Remove asset from current user asset list.

---

**input:**

```typescript
{
    ledgerAddress: string;
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
import { RemoveAssetHandler } from "@ic-wallet-kit/icrc";
import Container from "typedi";

(async () => {
    const removeAssetHandler = Container.get(RemoveAssetHandler);
    const result = await removeAssetHandler.handle({
        ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai"
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

## RemoveSubAccountHandler

Remove sub account from current user asset .

---

**input:**

```typescript
{
    ledgerAddress: string;
    subAccountId: SubAccountId;
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
import { RemoveSubAccountHandler, SubAccountId } from "@ic-wallet-kit/icrc";
import Container from "typedi";

(async () => {
    const removeSubAccountHandler = Container.get(RemoveSubAccountHandler);
    const result = await removeSubAccountHandler.handle({
        ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
        subAccountId: SubAccountId.parseFromString("0x1")
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

## UpdateAssetHandler

Update current user asset info.

---

**input:**

```typescript
{
    ledgerAddress: string;
    assetName: string;
    symbol: string;
    shortDecimal: number;
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
import { UpdateAssetHandler } from "@ic-wallet-kit/icrc";
import Container from "typedi";

(async () => {
    const updateAssetHandler = Container.get(UpdateAssetHandler);
    const result = await updateAssetHandler.handle({
        ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
        assetName: "Internet Computer",
        symbol:  "ICP",
        shortDecimal: 8
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

## UpdateSubAccountHandler

Update current user sub account info.

---

**input:**

```typescript
{
    ledgerAddress: string;
    subAccountNewName: string;
    subAccountId: SubAccountId;
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
import { UpdateSubAccountHandler, SubAccountId } from "@ic-wallet-kit/icrc";
import Container from "typedi";

(async () => {
    const updateSubAccountHandler = Container.get(UpdateSubAccountHandler);
    const result = await updateSubAccountHandler.handle({
        ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
        subAccountNewName: "Default SubAccount",
        subAccountId: SubAccountId.parseFromString("0x0")
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
