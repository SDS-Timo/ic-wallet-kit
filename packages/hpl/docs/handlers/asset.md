# Asset Handlers

Handlers for work with assets.

---

- [EditHplAssetHandler](#edithplassethandler)
- [GetHplAssetListHandler](#gethplassetlisthandler)

## EditHplAssetHandler

Edit asset to current user asset list.

---

**input:**

```typescript
{
    assetId: bigint;
    name: string;
    symbol: string;
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
import { EditHplAssetHandler } from "@ic-wallet-middleware/hpl";
import Container from "typedi";

(async () => {
    const editHplAssetHandler = Container.get(EditHplAssetHandler);
    const result = await editHplAssetHandler.handle({
        assetId: 1n,
        name: "Test",
        symbol: "Test"
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

## GetHplAssetListHandler

Get asset list for current user.

| LoadType       | Load Data                                                                         |
| -------------- | --------------------------------------------------------------------------------- |
| LoadType.Cache | Loads all data from local cache                                                   |
| LoadType.Quick | Loads FtAssets, FtAssetInfo, Accounts, AccountInfo, VirtualAccounts, VirtualAccountInfo, AdminState, AllTokens from local cache. Loads FtSuppliesState from canister |
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
import { LoadType } from "@ic-wallet-middleware/common";
import { GetHplAssetListHandler } from "@ic-wallet-middleware/hpl";
import Container from "typedi";

(async () => {
    const getHplAssetListHandler = Container.get(GetHplAssetListHandler);
    const result = await getHplAssetListHandler.handle({
        loadType: LoadType.Cache
    });
    console.log(result);
})()
```

**result:**

```typescript
{
  data: {
    ftAssets: [{
        assetName: "Native toy token",
        assetSymbol: "ABC",
        controller: "2vxsx-fae",
        decimal: 0,
        description: "Default",
        id: 0n,
        logo: "",
        name: "",
        symbol: "",
        supply: 21015n,
        ledgerBalance: 0n
    },
   ]
  },
  isSuccess: true,
  errors: []
}
```
