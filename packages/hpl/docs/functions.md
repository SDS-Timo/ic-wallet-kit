## HPL public functions

Public functions for work with HPL handlers.

---


### Asset functions

- **getHplAssetList** - calls [GetHplAssetListHandler](/packages/hpl/docs/handlers/asset.md#gethplassetlisthandler).

- **editHplAsset** - calls [EditHplAssetHandler](/packages/hpl/docs/handlers/asset.md#edithplassethandler).


### Account functions

- **getHplAccountList** - calls [GetHplAccountListHandler](/packages/hpl/docs/handlers/account.md#gethplaccountlisthandler).

- **addHplAccount** - calls [AddHplAccountHandler](/packages/hpl/docs/handlers/account.md#addhplaccounthandler).

- **editHplAccount** - calls [EditHplAccountHandler](/packages/hpl/docs/handlers/account.md#edithplaccounthandler).


### Virtual Account functions

- **addHplVirtualAccount** - calls [AddHplVirtualAccountHandler](/packages/hpl/docs/handlers/virtualAccount.md#addhplvirtualaccounthandler).

- **deleteHplVirtualAccount** - calls [DeleteHplVirtualAccountHandler](/packages/hpl/docs/handlers/virtualAccount.md#deletehplvirtualaccounthandler).

- **editHplVirtualAccount** - calls [EditHplVirtualAccountHandler](/packages/hpl/docs/handlers/virtualAccount.md#edithplvirtualaccounthandler).

- **checkLinkCode** - calls [CheckLinkCodeHandler](/packages/hpl/docs/handlers/virtualAccount.md#checklinkcodehandler).

- **getHplVirtualAccountList** - calls [GetHplVirtualAccountListHandler](/packages/hpl/docs/handlers/virtualAccount.md#gethplvirtualaccountlisthandler).

- **resetHplVirtualAccount** - calls [ResetHplVirtualAccountHandler](/packages/hpl/docs/handlers/virtualAccount.md#resetHplVirtualAccountHandler).


### Contact functions

- **getHplContactList** - calls [GetHplContactListHandler](/packages/hpl/docs/handlers/contact.md#gethplcontactlisthandler).

- **getHplContactAvailableLink** - calls [GetHplContactAvailableLinkHandler](/packages/hpl/docs/handlers/contact.md#gethplcontactavailablelinkhandler).

- **addHplContact** - calls [AddHplContactHandler](/packages/hpl/docs/handlers/contact.md#addhplcontacthandler).

- **addHplContactRemotes** - calls [AddHplContactRemotesHandler](/packages/hpl/docs/handlers/contact.md#addhplcontactremoteshandler).

- **editHplContact** - calls [EditHplContactHandler](/packages/hpl/docs/handlers/contact.md#edithplcontacthandler).

- **removeHplContact** - calls [RemoveHplContactHandler](/packages/hpl/docs/handlers/contact.md#removehplcontacthandler).

- **removeHplContactLink** - calls [RemoveHplContactLinkHandler](/packages/hpl/docs/handlers/contact.md#removehplcontactlinkhandler).


### Check functions

- **checkDictionaryPrincipal** - calls [CheckDictionaryPrincipalHandler](/packages/hpl/docs/handlers/check.md#checkdictionaryprincipalhandler).

- **checkLedgerPrincipal** - calls [CheckLedgerPrincipalHandler](/packages/hpl/docs/handlers/check.md#checkledgerprincipalhandler).


### Transfer functions

- **getHplFeeConstant** - calls [GetHplFeeConstantHandler](/packages/hpl/docs/handlers/transfer.md#gethplfeeconstanthandler).

- **transfer** - calls [TransferHandler](/packages/hpl/docs/handlers/transfer.md#transferhandler).

---

### Example
```typescript
import { GetHplAccountListInfo, getHplAssetList } from "@ic-wallet-middleware/hpl";
import { LoadType } from "@ic-wallet-middleware/common";

(() => {
    const form:GetHplAccountListInfo = {
        loadType: LoadType.Full
    }
    const result = getHplAssetList(form);
})()
```