# Service Handlers

Handlers for work with Services.

---

- [AddServiceAssetsHandler](#addserviceassetshandler)
- [AddServiceHandler](#addservicehandler)
- [CheckServicePrincipalHandler](#checkserviceprincipalhandler)
- [EditServiceNameHandler](#editservicenamehandler)
- [GetListServiceHandler](#getlistservicehandler)
- [NotifyServiceHandler](#notifyservicehandler)
- [RemoveServiceAssetsHandler](#removeserviceassetshandler)
- [RemoveServiceHandler](#removeservicehandler)
- [TransferFromServiceHandler](#transferfromservicehandler)
- [TransferToServiceHandler](#transfertoservicehandler)

## AddServiceAssetsHandler

Add service to current user service list.

---

**input:**

```typescript
{
  servicePrincipal: string;
  ledgerAddresses: string[];
}
```

**output:**

```typescript
{
  data:{
    assets: ServiceAssetView[];
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
import { AddServiceAssetsHandler } from "@ic-wallet-middleware/icrc";
import Container from "typedi";

(async () => {
    const addServiceAssetsHandler = Container.get(AddServiceAssetsHandler);
    const result = await addServiceAssetsHandler.handle({
      servicePrincipal: "z4s7u-byaaa-aaaao-a3paa-cai",
      ledgerAddresses: [
        "ryjl3-tyaaa-aaaaa-aaaba-cai",
        "um5iw-rqaaa-aaaaq-qaaba-cai",
      ]
    });
    console.log(result);
})()
```

**result:**

```typescript
{
  data: {
    assets: [
      {
        ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
        balance: 10000n,
        credit: 10000n,
        depositFee: 10000n,
        withdrawFee: 10000n,
        decimal: 8,
        shortDecimal: 8,
        logo: "",
        tokenName: "Internet Computer",
        tokenSymbol: "ICP",
        isSync: true
      },
      {
        ledgerAddress: "um5iw-rqaaa-aaaaq-qaaba-cai",
        balance: 0n,
        credit: 0n,
        depositFee: 10000n,
        withdrawFee: 10000n,
        decimal: 12,
        shortDecimal: 12,
        logo: "",
        tokenName: "Trillion Cycles",
        tokenSymbol: "TCYCLES",
        isSync: false
      }
    ]
  },
  isSuccess: true,
  errors: []
}
```

## AddServiceHandler

Add service to current user service list.

---

**input:**

```typescript
{
  servicePrincipal: string;
  newName: string;
}
```

**output:**

```typescript
{
  data:{
    serviceName: string;
    servicePrincipal: string;
    serviceAssets: ServiceAssetView[];
    availableAssets: AvailableAssetView[];
    isSync: boolean;
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
import { AddServiceHandler } from "@ic-wallet-middleware/icrc";
import Container from "typedi";

(async () => {
    const addServiceHandler = Container.get(AddServiceHandler);
    const result = await addServiceHandler.handle({
      servicePrincipal: "z4s7u-byaaa-aaaao-a3paa-cai",
      newName: "Test"
    });
    console.log(result);
})()
```

**result:**

```typescript
{
  data: {
    serviceAssets: [],
    availableAssets: [
        {
            ledgerAddress: "cngnf-vqaaa-aaaar-qag4q-cai",
            name: "ckUSDT",
            symbol: "ckUSDT",
            decimal: 6,
            shortDecimal: 6,
            logo: ""
        },
        {
            ledgerAddress: "xevnm-gaaaa-aaaar-qafnq-cai",
            name: "ckUSDC",
            symbol: "ckUSDC",
            decimal: 8,
            shortDecimal: 8,
            logo: ""
        },
        {
            ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
            name: "Internet Computer",
            symbol: "ICP",
            decimal: 8,
            shortDecimal: 8,
            logo: ""
        },
        {
            ledgerAddress: "mxzaz-hqaaa-aaaar-qaada-cai",
            name: "ckBTC",
            symbol: "ckBTC",
            decimal: 8,
            shortDecimal: 8,
            logo: ""
        },
        {
            ledgerAddress: "ss2fx-dyaaa-aaaar-qacoq-cai",
            name: "ckETH",
            symbol: "ckETH",
            decimal: 8,
            shortDecimal: 8,
            logo: ""
        },
        {
            ledgerAddress: "um5iw-rqaaa-aaaaq-qaaba-cai",
            name: "Trillion Cycles",
            symbol: "TCYCLES",
            decimal: 12,
            shortDecimal: 12,
            logo: ""
        }
    ],
    serviceName: "Test",
    servicePrincipal: "z4s7u-byaaa-aaaao-a3paa-cai",
    isSync: true
  },
  isSuccess: true,
  errors: []
}
```

## CheckServicePrincipalHandler

Check if service canister exist.

---

**input:**

```typescript
{
  servicePrincipal: string;
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
import { CheckServicePrincipalHandler } from "@ic-wallet-middleware/icrc";
import Container from "typedi";

(async () => {
    const checkServicePrincipalHandler = Container.get(CheckServicePrincipalHandler);
    const result = await checkServicePrincipalHandler.handle({
        servicePrincipal: "z4s7u-byaaa-aaaao-a3paa-cai"
    });
    console.log(result);
})()
```

**result:**

```typescript
{
  data:  {
    isPrincipalExist: true
  },
  isSuccess: true,
  errors: []
}
```

## EditServiceNameHandler
Edit service name.

---

**input:**

```typescript
{
  servicePrincipal: string;
  newName: string;
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
import { EditServiceNameHandler } from "@ic-wallet-middleware/icrc";
import Container from "typedi";

(async () => {
    const editServiceNameHandler = Container.get(EditServiceNameHandler);
    const result = await editServiceNameHandler.handle({
      servicePrincipal: "z4s7u-byaaa-aaaao-a3paa-cai",
      newName: "Test"
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

## GetListServiceHandler

Get asset list for current user.

| LoadType       | Load Data                                                                         |
| -------------- | --------------------------------------------------------------------------------- |
| LoadType.Cache | Loads all data from local cache                                                   |
| LoadType.Quick | Loads SNS Token and Supported Assets from local cache. Loads Assets Details, Assets Deposit, Credits from canister |
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
    services: ServiceView[];
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
import { GetListServiceHandler } from "@ic-wallet-middleware/icrc";
import Container from "typedi";

(async () => {
    const getListServiceHandler = Container.get(GetListServiceHandler);
    const result = await getListServiceHandler.handle({
        loadType: LoadType.Cache
    });
    console.log(result);
})()
```

**result:**

```typescript
{
  data: {
    services: [{
      serviceAssets: [],
      serviceName: "test",
      servicePrincipal: "z4s7u-byaaa-aaaao-a3paa-cai",
      availableAssets: [
      {
        ledgerAddress: "cngnf-vqaaa-aaaar-qag4q-cai",
        name: "ckUSDT",
        symbol: "ckUSDT",
        decimal: 6,
        shortDecimal: 6,
        logo: ""
      },
      {
        ledgerAddress: "xevnm-gaaaa-aaaar-qafnq-cai",
        name: "ckUSDC",
        symbol: "ckUSDC",
        decimal: 8,
        shortDecimal: 8,
        logo: ""
      },
      {
        ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
        name: "Internet Computer",
        symbol: "ICP",
        decimal: 8,
        shortDecimal: 8,
        logo: ""
      },
      {
        ledgerAddress: "mxzaz-hqaaa-aaaar-qaada-cai",
        name: "ckBTC",
        symbol: "ckBTC",
        decimal: 8,
        shortDecimal: 8,
        logo: ""
      },
      {
        ledgerAddress: "ss2fx-dyaaa-aaaar-qacoq-cai",
        name: "ckETH",
        symbol: "ckETH",
        decimal: 8,
        shortDecimal: 8,
        logo: ""
      },
      {
        ledgerAddress: "um5iw-rqaaa-aaaaq-qaaba-cai",
        name: "Trillion Cycles",
        symbol: "TCYCLES",
        decimal: 12,
        shortDecimal: 12,
        logo: ""
      }
    ],
      isSync: true
  }]
}
```

## NotifyServiceHandler

Transfer to service confirmation.

---

**input:**

```typescript
{
    servicePrincipal: string;
    ledgerAddress: string;
}
```

**output:**

```typescript
{
  data:{
    servicePrincipal: string;
    ledgerAddress: string;
    credit: bigint;
    deposit: bigint;
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
import { NotifyServiceHandler } from "@ic-wallet-middleware/icrc";
import Container from "typedi";

(async () => {
    const notifyServiceHandler = Container.get(NotifyServiceHandler);
    const result = await notifyServiceHandler.handle({
      servicePrincipal: "z4s7u-byaaa-aaaao-a3paa-cai",
      ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai"
    });
    console.log(result);
})()
```

**result:**

```typescript
{
  data: {
    servicePrincipal: "z4s7u-byaaa-aaaao-a3paa-cai",
    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai"
    credit: 20000n;
    deposit: 0n;
  },
  isSuccess: true,
  errors: []
}
```

## RemoveServiceAssetsHandler

Remove asset from service list.

---

**input:**

```typescript
{
    servicePrincipal: string;
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
import { RemoveServiceAssetsHandler } from "@ic-wallet-middleware/icrc";
import Container from "typedi";

(async () => {
    const removeServiceAssetsHandler = Container.get(RemoveServiceAssetsHandler);
    const result = await removeServiceAssetsHandler.handle({
        servicePrincipal: "z4s7u-byaaa-aaaao-a3paa-cai",
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

## RemoveServiceHandler

Remove service from service list.

---

**input:**

```typescript
{
  servicePrincipal: string;
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
import { RemoveServiceHandler } from "@ic-wallet-middleware/icrc";
import Container from "typedi";

(async () => {
    const removeServiceHandler = Container.get(RemoveServiceHandler);
    const result = await removeServiceHandler.handle({
        servicePrincipal: "z4s7u-byaaa-aaaao-a3paa-cai"
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

## TransferFromServiceHandler

Transfer service to account.

---

**input:**

```typescript
{
  amount: Amount;
  fromPrincipal: string;
  toPrincipal: string;
  ledgerAddress: string;
  toSubId: SubAccountId;
}
```

**output:**

```typescript
{
  data:{
    servicePrincipal: string;
    ledgerAddress: string;
    credit: bigint;
    deposit: bigint;
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
import { TransferFromServiceHandler, SubAccountId } from "@ic-wallet-middleware/icrc";
import Container from "typedi";

(async () => {
    const transferFromServiceHandler = Container.get(TransferFromServiceHandler);
    const result = await transferFromServiceHandler.handle({
      amount: "0.0002",
      fromPrincipal: "z4s7u-byaaa-aaaao-a3paa-cai",
      ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
      toPrincipal: "3etep-celzb-5t4iw-swa7s-3yek6-g45iq-cuopt-6t3lp-phfdf-xh7va-gqe",
      toSubId: SubAccountId.parseFromString("0x1")
    });
    console.log(result);
})()
```

**result:**

```typescript
{
  data: {
    servicePrincipal: "z4s7u-byaaa-aaaao-a3paa-cai",
    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
    credit: 20000n,
    deposit: 0n
  },
  isSuccess: true,
  errors: []
}
```

## TransferToServiceHandler

Transfer from account to service.

---

**input:**

```typescript
{
  amount: Amount;
  fromPrincipal: string;
  fromSubId: SubAccountId;
  toPrincipal: string;
  toSubId: SubAccountId;
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
import { TransferFromServiceHandler, SubAccountId } from "@ic-wallet-middleware/icrc";
import Container from "typedi";

(async () => {
    const transferFromServiceHandler = Container.get(TransferFromServiceHandler);
    const result = await transferFromServiceHandler.handle({
      amount: "0.0002",
      fromPrincipal: "principal",
      ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
      toPrincipal: "z4s7u-byaaa-aaaao-a3paa-cai",
      toSubId: SubAccountId.parseFromString("0x1d975cfc3cd470db2317d4c9ef429710242188de07e3f9da0ebc1da43b02")
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
