# Contact Handlers

Handlers for work with Contacts.

---

- [AddAssetContactHandler](#addassetcontacthandler)
- [AddContactHandler](#addcontacthandler)
- [AddSubAccountContactHandler](#addsubaccountcontacthandler)
- [EditContactHandler](#editContactHandler)
- [EditOrAddContactHandler](#editoraddcontacthandler)
- [EditOrAddSubAccountContactHandler](#editoraddsubaccountcontacthandler)
- [EditSubAccountContactHandler](#editsubaccountcontacthandler)
- [GetListContactHandler](#getlistcontacthandler)
- [RemoveAssetContactHandler](#removeassetcontacthandler)
- [RemoveContactHandler](#removecontacthandler)
- [RemoveAssetContactHandler](#removeassetcontacthandler)

## AddAssetContactHandler

Add asset to contact list

---

**input:**

```typescript
{
    principal: string;
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
import { AddAssetContactHandler} from "@ic-wallet-middleware/icrc";
import Container from "typedi";

(async () => {
    const addAssetContactHandler= Container.get(AddAssetContactHandler);
    const result = await addAssetContactHandler.handle({
        ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
	principal: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"
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

## AddContactHandler

Add contact name and principal to user list

---

**input:**

```typescript
{
    name: string;
    principal: string;
    assets: AssetContactForm[];
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
import { AddContactHandler, SubAccountId } from "@ic-wallet-middleware/icrc";
import Container from "typedi";

(async () => {
    const addContactHandler= Container.get(AddContactHandler);
     const result = await addContactHandler.handle({
        name: "Test Contact",
	      principal: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe",
	      assets: [{
	        ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
	        subAccounts: [{
		        name: "Default",
	            subAccountId: SubAccountId.parseFromString("0x0")
	        },
	        {
		        name: "SubAccount 1",
	            subAccountId: SubAccountId.parseFromString("0x1")
	        }]
	      }],
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

## AddSubAccountContactHandler

Add sub account to asset contact.

---

**input:**

```typescript
{
    principal: string;
    ledgerAddress: string;
    subAccountName: string;
    subAccountId: SubAccountId;
}
```

**output:**

```typescript
{
  data:{
    subAccount: SubAccountContactView;
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
import { AddSubAccountContactHandler, SubAccountId } from "@ic-wallet-middleware/icrc";
import Container from "typedi";

(async () => {
    const addSubAccountContactHandler= Container.get(AddSubAccountContactHandler);
    const result = await addSubAccountContactHandler.handle({
        ledgerAddress: "tyyy3-4aaaa-aaaaq-aab7a-cai",
        principal: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe",
        subAccountName: "Subaccount 1",
        subAccountId: SubAccountId.parseFromString("0x1")
    });
    console.log(result);
})()
```

**result:**

```typescript
{
  data:  {
    name: "Subaccount 1",
    subAccountId: {
	_subAccount: "0x1"
    },
    allowance: {
	ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
	subAccount: {
	    _subAccount: "0x1"
	},
        sender: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe";
        amount: 10000n;
        expiration: undefined;
    }
  },
  isSuccess: true,
  errors: []
}
```

## EditContactHandler

Edit contact name.

---

**input:**

```typescript
{
    name: string;
    principal: string;
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
import { EditContactHandler } from "@ic-wallet-middleware/icrc";
import Container from "typedi";

(async () => {
    const editContactHandler = Container.get(EditContactHandler);
    const result = await editContactHandler.handle({
        name: "Contact A",
	principal: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"
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

## EditOrAddContactHandler

Edit contact name or add contact to user list by name and principal.

---

**input:**

```typescript
{
    name: string;
    principal: string;
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
import { EditOrAddContactHandler } from "@ic-wallet-middleware/icrc";
import Container from "typedi";

(async () => {
    const editOrAddContactHandler = Container.get(EditOrAddContactHandler);
    const result = await editOrAddContactHandler.handle({
        name: "Contact A",
	      principal: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"
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

## EditOrAddSubAccountContactHandler

Edit sub account info or add new sub account.

---

**input:**

```typescript
{
    principal: string;
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
import { EditOrAddSubAccountContactHandler, SubAccountId } from "@ic-wallet-middleware/icrc";
import Container from "typedi";

(async () => {
    const editOrAddSubAccountContactHandler = Container.get(EditOrAddSubAccountContactHandler);
    const result = await editOrAddSubAccountContactHandler.handle({
	    principal: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe",
	    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
	    subAccountId: SubAccountId.parseFromString("0x1"),
	    subAccountName: "Subaccount 1"
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

## EditSubAccountContactHandler

Edit sub account info.

---

**input:**

```typescript
{
    principal: string;
    ledgerAddress: string;
    newSubAccountName: string;
    newSubAccountId: SubAccountId;
    oldSubAccountId: SubAccountId;
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
import { EditOrAddSubAccountContactHandler, SubAccountId } from "@ic-wallet-middleware/icrc";
import Container from "typedi";

(async () => {
    const editOrAddSubAccountContactHandler = Container.get(EditOrAddSubAccountContactHandler);
    const result = await editOrAddSubAccountContactHandler.handle({
	    principal: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe",
	    ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
	    oldSubAccountId: SubAccountId.parseFromString("0x1"),
	    newSubAccountName: "Subaccount",
	    newSubAccountId: SubAccountId.parseFromString("0x1"),
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

## GetListContactHandler

Get all currrent user contacts.

| LoadType       | Load Data                                         |
| -------------- | ------------------------------------------------- |
| LoadType.Cache | Loads allowances for subAccounts from local cache |
| LoadType.Quick | Loads allowances for subAccounts from canister    |
| LoadType.Full  | Loads allowances for subAccounts from canister   |

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
	contacts: ContactView[]
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
import { GetListContactHandler} from "@ic-wallet-middleware/icrc";
import Container from "typedi";

(async () => {
    const getListContactHandler = Container.get(GetListContactHandler);
    const result = await getListContactHandler.handle({
        loadType: LoadType.Cache
    });
    console.log(result);
})()
```

**result:**

```typescript
{
    data: {
	contacts: [{
	    name: "Contact A",
    	    principal: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe",
	    assets: [{
		symbol: "ICP",
		ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
		subAccounts: [{
		    name: "Default",
		    subAccountId: {
			_subAccount: "0x0"
		    },
		    allowance: {
			ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
			subAccount: {
	    		    _subAccount: "0x1"
			},
        		sender: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe";
        		amount: 10000n;
        		expiration: undefined;
		    }
		},
		{
		    name: "Subaccount 1",
		    subAccountId: {
			_subAccount: "0x1"
		    },
		    allowance: undefined
		}];
	    }];
    	    hasAllowance: boolean;
	}]
    },
    isSuccess: true,
    errors: []
}
```

## RemoveAssetContactHandler

Remove asset from contact list.

---

**input:**

```typescript
{
    principal: string;
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
import { RemoveAssetContactHandler } from "@ic-wallet-middleware/icrc";
import Container from "typedi";

(async () => {
    const removeAssetContactHandler = Container.get(RemoveAssetContactHandler);
    const result = await removeAssetContactHandler.handle({
	      principal: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe",
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

## RemoveContactHandler

Remove current user contact.

---

**input:**

```typescript
{
    principal: string;
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
import { RemoveContactHandler } from "@ic-wallet-middleware/icrc";
import Container from "typedi";

(async () => {
    const removeContactHandler = Container.get(RemoveContactHandler);
    const result = await removeContactHandler.handle({
	principal: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe"
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

## RemoveSubAccountContactHandler

Remove sub account from contact list.

---

**input:**

```typescript
{
    principal: string;
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
import { RemoveSubAccountContactHandler, SubAccountId } from "@ic-wallet-middleware/icrc";
import Container from "typedi";

(async () => {
    const removeSubAccountContactHandler = Container.get(RemoveSubAccountContactHandler);
    const result = await removeSubAccountContactHandler.handle({
        principal: "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe",
        ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
        subAccountId: SubAccountId.parseFromString("0x1")
    });
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
