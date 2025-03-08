# Contact Handlers

Handlers for work with contacts.

---

- [AddHplContactHandler](#addhplcontacthandler)
- [AddHplContactRemotesHandler](#addhplcontactremoteshandler)
- [EditHplContactHandler](#edithplcontacthandler)
- [GetHplContactAvailableLinkHandler](#gethplcontactavailablelinkhandler)
- [GetHplContactListHandler](#gethplcontactlisthandler)
- [RemoveHplContactHandler](#removehplcontacthandler)
- [RemoveHplContactLinkHandler](#removehplcontactlinkhandler)

## AddHplContactHandler

Add contact to current user contact list.

---

**input:**

```typescript
{
    contactName: string;
    principal: Principal;
    linkIds: AddHplLinkForm[];
}
```

**output:**

```typescript
{
    data:{
        contact: HplContact;
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
import { AddHplContactHandler } from "@ic-wallet-middleware/hpl";
import Container from "typedi";

(async () => {
    const addHplContactHandler = Container.get(AddHplContactHandler);
    const result = await addHplContactHandler.handle({
        contactName: "Test",
        principal: Principal.fromText("principal"),
        linkIds: [{
            linkName: "Test 1",
            remoteId: "0"
        }]
    });
    console.log(result);
})()
```

**result:**

```typescript
{
    data: {
        contact: {
            name: "Test",
            principal: Principal,
            remotes: [{
                amount: "1",
                assetId: "1",
                code: "02a0",
                expired: 0,
                name: "Test 1",
                remoteAccountId: "0",
            }],
            availableRemotes: [
                {
                    amount: "1",
                    assetId: "1",
                    assetLogo: undefined,
                    assetName: undefined,
                    assetSymbol: undefined,
                    code: "02a0",
                    expired: 0,
                    remoteAccountId: "0",
                },
            ],
        }
    },
    isSuccess: true,
    errors: []
}
```

## AddHplContactRemotesHandler

Add remote to current user contact.

---

**input:**

```typescript
{
    contactPrincipal: Principal;
    linkIds: AddHplLinkForm[];
}
```

**output:**

```typescript
{
    data: {
        links: HplRemote[];
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
import { AddHplContactRemotesHandler } from "@ic-wallet-middleware/hpl";
import Container from "typedi";

(async () => {
    const addHplContactRemotesHandler = Container.get(AddHplContactRemotesHandler);
    const result = await addHplContactRemotesHandler.handle({
        contactPrincipal: Principal.fromText("principal"),
        linkIds: [{
            linkName: "Test 1",
            remoteId: "1"
        }]
    });
    console.log(result);
})()
```

**result:**

```typescript
{
    data: {
        links: [{
            amount: "2",
            assetId: "2",
            assetLogo: "",
            assetName: "Test Name",
            assetSymbol: "Test Symbol",
            code: "043",
            name: "Test 1",
            remoteAccountId: "1",
        }]
    },
    isSuccess: true,
    errors: []
}
```

## EditHplContactHandler

Edit contact info.

---

**input:**

```typescript
{
    contactName: string;
    principal: Principal;
    linkIds: AddHplLinkForm[];
}
```

**output:**

```typescript
{
    data: {
        remotes: HplRemote[]
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
import { EditHplContactHandler } from "@ic-wallet-middleware/hpl";
import Container from "typedi";

(async () => {
    const editHplContactHandler = Container.get(EditHplContactHandler);
    const result = await editHplContactHandler.handle({
        contactName: "Test",
        principal: Principal.fromText("principal"),
        linkIds: [{
            linkName: "Test 1",
            remoteId: "0"
        }]
    });
    console.log(result);
})()
```

**result:**

```typescript
{
    data: {
        remotes: [
            {
                amount: "1",
                code: "02a0",
                expired: 0,
                assetId: "1",
                name: "Test 1",
                remoteAccountId: "0"
            }
        ]
    },
    isSuccess: true,
    errors: []
}
```


## GetHplContactAvailableLinkHandler

Get available links for current user contact.

| LoadType       | Load Data                                                                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| LoadType.Cache | Loads all data from local cache                                                                                                              |
| LoadType.Quick | Loads RemoteAccountInfo,  OwnerLookup, AllTokens from local cache. Loads RemoteState from canister |
| LoadType.Full  | Loads all data from canister                                                                                                                 |

---

**input:**

```typescript
{
    principal: Principal;
    loadType: LoadType;
}
```

**output:**

```typescript
{
    data: {
        availableRemotes: HplAvailableRemote[];
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
import { GetHplContactAvailableLinkHandler } from "@ic-wallet-middleware/hpl";
import Container from "typedi";

(async () => {
    const getHplContactAvailableLinkHandler = Container.get(GetHplContactAvailableLinkHandler);
    const result = await getHplContactAvailableLinkHandler.handle({
        principal: Principal.fromText("Principal"),
        loadType: LoadType.Full
    });
    console.log(result);
})()
```

**result:**

```typescript
{
    data: {
        availableRemotes: [{
                    assetId: "1",
                    assetLogo: "",
                    assetName: "Native toy token",
                    assetSymbol: "ABC",
                    amount: "1",
                    remoteAccountId: "1",
                    code: "042",
                    expired: 0
                },
                {
                    assetId: "1",
                    assetLogo: "",
                    assetName: "Native toy token",
                    assetSymbol: "ABC",
                    amount: "2",
                    remoteAccountId: "2",
                    code: "043",
                    expired: 0
                }]
    },
    isSuccess: true,
    errors: []
}
```

## GetHplContactListHandler

Get contact list for current user.

| LoadType       | Load Data                                                                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| LoadType.Cache | Loads all data from local cache                                                                                                              |
| LoadType.Quick | Loads RemoteAccountInfo,  OwnerLookup, AllTokens from local cache. Loads RemoteState from canister |
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
    contacts: HplContact[];
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
import { GetHplContactListHandler } from "@ic-wallet-middleware/hpl";
import Container from "typedi";

(async () => {
    const getHplContactListHandler = Container.get(GetHplContactListHandler);
    const result = await getHplContactListHandler.handle({
        loadType: LoadType.Cache
    });
    console.log(result);
})()
```

**result:**

```typescript
{
  data: {
    contacts: [
        {
            principal: Principal,
            name: "Test Contact",
            availableRemotes: [{
                    assetId: "1",
                    assetLogo: "",
                    assetName: "Native toy token",
                    assetSymbol: "ABC",
                    amount: "1",
                    remoteAccountId: "1",
                    code: "041",
                    expired: 0
                },
                {
                    assetId: "1",
                    assetLogo: "",
                    assetName: "Native toy token",
                    assetSymbol: "ABC",
                    amount: "2",
                    remoteAccountId: "2",
                    code: "042",
                    expired: 0
                }
            ],
            remotes: [
                {
                    assetId: "1",
                    assetLogo: "",
                    assetName: "Native toy token",
                    assetSymbol: "ABC",
                    amount: "1",
                    remoteAccountId: "1",
                    code: "041",
                    expired: 0,
                    name: "Test VA"
                }
            ]
        }
    ]
  },
  isSuccess: true,
  errors: []
}
```

## RemoveHplContactHandler

Remove current user contact.

---

**input:**

```typescript
{
    principal: Principal;
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
import { RemoveHplContactHandler } from "@ic-wallet-middleware/hpl";
import Container from "typedi";

(async () => {
    const removeHplContactHandler = Container.get(RemoveHplContactHandler);
    const result = await removeHplContactHandler.handle({
        principal: Principal.fromText("principal")
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

## RemoveHplContactLinkHandler

Remove current user contact.

---

**input:**

```typescript
{
    principal: Principal;
    linkId: string;
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
import { RemoveHplContactLinkHandler } from "@ic-wallet-middleware/hpl";
import Container from "typedi";

(async () => {
    const removeHplContactLinkHandler = Container.get(RemoveHplContactLinkHandler);
    const result = await removeHplContactLinkHandler.handle({
        principal: Principal.fromText("principal"),
        linkId: "0"
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
