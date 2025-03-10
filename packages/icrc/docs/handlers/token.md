# Token Handlers

Handlers for work with Tokens.

---

- [GetAvailableAssetsHandler](#getavailableassetshandler)
- [GetTokenMarketHandler](#gettokenmarkethandler)

## GetAvailableAssetsHandler

Get all assets from external resources exclude exist assets for current user.

| LoadType       | Load Data                            |
| -------------- | ------------------------------------ |
| LoadType.Cache | Loads SNS Tokens from local cache  |
| LoadType.Quick | Loads SNS Tokens from local cache. |
| LoadType.Full  | Loads SNS Tokens from canister     |

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
    tokenList: TokenModel[];
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
import { GetAvailableAssetsHandler } from "@ic-wallet-kit/icrc";
import Container from "typedi";

(async () => {
    const getAvailableAssetsHandler = Container.get(GetAvailableAssetsHandler);
    const result = await getAvailableAssetsHandler.handle({
        loadType: LoadType.Cache
    });
    console.log(result);
})()
```

**result:**

```typescript
{
  data: {
    tokenList: [{
      ledgerAddress: "bptq2-faaaa-aaaar-qagxq-cai",
      decimal: 8,
      indexAddress: "dso6s-wiaaa-aaaar-qagya-cai",
      logo: "",
      name: "ckWBTC",
      symbol: "ckWBTC",
      supportedStandard: [
        "ICRC-1",
        "ICRC-2",
        "ICRC-3",
        "ICRC-21"
      ]},
      {
      ledgerAddress: "g4tto-rqaaa-aaaar-qageq-cai",
      decimal: 18,
      indexAddress: "gvqys-hyaaa-aaaar-qagfa-cai",
      logo: "",
      name: "ckLINK",
      symbol: "ckLINK",
      supportedStandard: [
        "ICRC-1",
        "ICRC-2",
        "ICRC-3",
        "ICRC-21"
      ]}
    ]
  }
  isSuccess: true,
  errors: []
}
```

## GetTokenMarketHandler

Get info for all tokens in market.

| LoadType       | Load Data                            |
| -------------- | ------------------------------------ |
| LoadType.Cache | Loads Token Markets from local cache  |
| LoadType.Quick | Loads Token Markets from local cache. |
| LoadType.Full  | Loads Token Markets from canister     |
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
    markets: TokenMarketInfo[];
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
import { GetTokenMarketHandler } from "@ic-wallet-kit/icrc";
import Container from "typedi";

(async () => {
    const getTokenMarketHandler = Container.get(GetTokenMarketHandler);
    const result = await getTokenMarketHandler.handle({
        loadType: LoadType.Cache
    });
    console.log(result);
})()
```

**result:**

```typescript
{
  data: {
    markets:[{
        name: "Bitcoin",
        symbol: "BTC",
        price: 107201.059577756
      },
      {
        name: "Ethereum",
        symbol: "ETH",
        price: 4008.642403376
      },
      {
        name: "Internet Computer",
        symbol: "ICP",
        price: 12.549235217
      }
    ]
  },
  isSuccess: true,
  errors: []
}
```
