# Allowance Handlers

Handlers for work with Allowance.

---

- [AddAllowanceHandler](#addallowancehandler)
- [CheckAllowanceByPrincipalHandler](#checkallowancebyprincipalhandler)
- [CheckAllowanceHandler](#checkallowancehandler)
- [GetListAllowanceHandler](#getlistallowancehandler)
- [TransferFromAllowanceHandler](#transferfromallowancehandler)
- [RemoveAllowanceHandler](#removeallowancehandler)
- [UpdateAllowanceHandler](#updateallowancehandler)

## AddAllowanceHandler

Add allowance to ICRC service and to Storage user list.

---

**input:**

```typescript
{
    ledgerAddress: string;
    subAccountId: SubAccountId;
    spenderPrincipal: string;
    spenderSubId: SubAccountId;
    amount: Amount;
    expiration?: string | undefined;
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
import { AddAllowanceHandler, SubAccountId } from "@ic-wallet-kit/icrc";
import Container from "typedi";

(async () => {
    const addAllowanceHandler = Container.get(AddAllowanceHandler);
    const result = await addAllowanceHandler.handle({
        ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
        spenderPrincipal: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
        spenderSubId: SubAccountId.parseFromString("0x0"),
        subAccountId: SubAccountId.parseFromString("0x0"),
        amount: 200000000n,
        expiration: "12/31/2025 23:59"
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

## CheckAllowanceByPrincipalHandler

Check allowance by principal.

---

**input:**

```typescript
{
    ownerPrincipal: string;
    ledgerAddress: string;
    subAccountId: SubAccountId;
    spenderPrincipal: string;
    spenderSubId: SubAccountId;
}
```

**output:**

```typescript
{
  data:{
	allowance: CheckAllowanceModel | undefined
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
import { CheckAllowanceByPrincipalHandler, SubAccountId } from "@ic-wallet-kit/icrc";
import Container from "typedi";

(async () => {
    const checkAllowanceByPrincipalHandler= Container.get(CheckAllowanceByPrincipalHandler);
    const result = await checkAllowanceByPrincipalHandler.handle({
        ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
        subAccountId: SubAccountId.parseFromString("0x1"),
        ownerPrincipal: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe",
        spenderPrincipal: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
        spenderSubId: SubAccountId.parseFromString("0x0")
    });
    console.log(result);
})()
```

**result:**

```typescript
{
    data: {
	allowance:
	{
	    amount: 200000000n,
            ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
            expiration: 1730365200000000000n,
            spender: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
            spenderSubId: {
		_subAccount: "0x0"
	    },
            subAccountId: {
		_subAccount: "0x0"
	    },
        }
  },
  isSuccess: true,
  errors: []
}
```

## CheckAllowanceHandler

Check allowance by current user principal.

---

**input:**

```typescript
{
    ledgerAddress: string;
    subAccountId: SubAccountId;
    spenderPrincipal: string;
    spenderSubId: SubAccountId;
}
```

**output:**

```typescript
{
  data:{
     allowance: AllowanceModel | undefined;
     existAllowance: boolean;
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
import { CheckAllowanceHandler, SubAccountId } from "@ic-wallet-kit/icrc";
import Container from "typedi";

(async () => {
    const checkAllowanceHandler = Container.get(CheckAllowanceHandler);
    const result = await checkAllowanceHandler.handle({
        ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
	      subAccountId: SubAccountId.parseFromString("0x0"),
	      spenderPrincipal: "f7tho-odgku-oo6eg-gh7tw-l2af3-arle3-vvrda-jqpff-p4kac-ywuje-hqe",
	      spenderSubId: SubAccountId.parseFromString("0x0")
    });
    console.log(result);
})()
```

**result:**

```typescript
{
  data:  {
    allowance: {
	amount: 50000n,
        ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
        expiration: "10/31/2024 12:00",
        spender: "f7tho-odgku-oo6eg-gh7tw-l2af3-arle3-vvrda-jqpff-p4kac-ywuje-hqe",
        spenderSubId: {
	   _subAccount: "0x0"
	},
        subAccount: {
	   _subAccount: "0x0"
	},
     },
     existAllowance: true
  },
  isSuccess: true,
  errors: []
}
```

## GetListAllowanceHandler

Get allowance list by selected asset from Storage.

| LoadType       | Load Data                                                      |
| -------------- | -------------------------------------------------------------- |
| LoadType.Cache | Loads Metadata and Allowance from local cache                 |
| LoadType.Quick | Loads Metadata from local cache. Loads Allowance from canister |
| LoadType.Full  | Loads Metadata and Allowance data from canister              |

---

**input:**

```typescript
{
    ledgerAddress: string;
    loadType: LoadType;
}
```

**output:**

```typescript
{
  data:{
    allowances: AllowanceModel[];
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
import { GetListAllowanceHandler } from "@ic-wallet-kit/icrc";
import Container from "typedi";

(async () => {
    const getListAllowanceHandler = Container.get(GetListAllowanceHandler);
    const result = await getListAllowanceHandler.handle({
	ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
        loadType: LoadType.Cache
    });
    console.log(result);
})()
```

**result:**

```typescript
{
  data: {
    allowances: [{
	ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
	subAccount: {
	   _subAccount: "0x0"
	},
	spender: "f7tho-odgku-oo6eg-gh7tw-l2af3-arle3-vvrda-jqpff-p4kac-ywuje-hqe",
	spenderSubId: {
	   _subAccount: "0x0"
	},
	decimal: 8,
	amount: 50000n,
	expiration: "10/31/2024 12:00"
    }]
  },
  isSuccess: true,
  errors: []
}
```

## RemoveAllowanceHandler

Remove allowance from ICRC service and from Storage user list.

---

**input:**

```typescript
{
    ledgerAddress: string;
    subAccountId: SubAccountId;
    spenderPrincipal: string;
    spenderSubId: SubAccountId;
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

import { RemoveAllowanceHandler, SubAccountId} from "@ic-wallet-kit/icrc";
import Container from "typedi";

(async () => {
    const removeAllowanceHandler = Container.get(RemoveAllowanceHandler);
    const result = await removeAllowanceHandler.handle({
        ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
	      subAccountId: SubAccountId.parseFromString("0x0"),
        spenderPrincipal: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
        spenderSubId: SubAccountId.parseFromString("0x0")
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

## TransferFromAllowanceHandler

Tranfer token from allowance to account .

---

**input:**

```typescript
{
    receiverPrincipal: Principal;
    ledgerAddress: string;
    fromSubAccountId: SubAccountId;
    toSubAccountId: SubAccountId;
    amount: Amount;
    senderPrincipal: Principal;
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
import { Principal } from "@dfinity/principal";
import { SubAccountId, TransferFromAllowanceHandler } from "@ic-wallet-kit/icrc";
import Container from "typedi";

(async () => {
    const transferFromAllowanceHandler = Container.get(TransferFromAllowanceHandler);
    const result = await transferFromAllowanceHandler.handle({
        receiverPrincipal: Principal.fromText("gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"),
	      ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
	      fromSubAccountId: SubAccountId.parseFromString("0x0"),
	      toSubAccountId: SubAccountId.parseFromString("0x0"),
	      amount: 50000n,
	      senderPrincipal: Principal.fromText("xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae")
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

## UpdateAllowanceHandler

Update allowance on ICRC service and on Storage user list.

---

**input:**

```typescript
{
    ledgerAddress: string;
    subAccountId: SubAccountId;
    spenderPrincipal: string;
    spenderSubId: SubAccountId;
    amount: Amount;
    expiration?: string | undefined;
}
```

**output:**

```typescript
{
  data:{
    ledgerAddress: string;
    subAccountId: SubAccountId;
    spenderPrincipal: string;
    spenderSubId: SubAccountId;
    amount: bigint;
    expiration?: string | undefined;
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
import { SubAccountId, UpdateAllowanceHandler } from "@ic-wallet-kit/icrc";
import Container from "typedi";

(async () => {
    const updateAllowanceHandler = Container.get(UpdateAllowanceHandler);
    const result = await updateAllowanceHandler.handle({
        ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
        spenderPrincipal: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
        spenderSubId: SubAccountId.parseFromString("0x0"),
        subAccountId: SubAccountId.parseFromString("0x0"),
        amount: 100000000n,
        expiration: "06/30/2025 23:59"
    });
    console.log(result);
})()
```

**result:**

```typescript
{
  data: {
    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
    spenderPrincipal: "xqknu-lpemp-tx4sq-ovbp4-2cf7s-z3was-f374m-l3mui-6zh7u-qdna6-fae",
    spenderSubId: {
       _subAccount = "0x0"
    },
    subAccountId: {
       _subAccount = "0x0"
    },
    amount: 100000000n,
    expiration: "06/30/2025 23:59"
  },
  isSuccess: true,
  errors: []
}
```
