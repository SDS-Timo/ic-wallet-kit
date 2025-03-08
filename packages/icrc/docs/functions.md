## ICRC public functions

Public functions for work with ICRC handlers.

---


### Asset functions

- **addAsset** - calls [AddAssetHandler](/packages/icrc/docs/handlers/asset.md#addassethandler).

- **addSubAccount** - calls [AddSubAccountHandler](/packages/icrc/docs/handlers/asset.md#addsubaccounthandler).

- **checkAsset** - calls [CheckAssetHandler](/packages/icrc/docs/handlers/asset.md#checkassethandler).

- **getListAsset** - calls [GetListAssetHandler](/packages/icrc/docs/handlers/asset.md#getlistAssethandler).

- **removeAsset** - calls [RemoveAssetHandler](/packages/icrc/docs/handlers/asset.md#removeassethandler).

- **removeSubAccount** - calls [RemoveSubAccountHandler](/packages/icrc/docs/handlers/asset.md#removesubaccounthandler).

- **updateAsset** - calls [UpdateAssetHandler](/packages/icrc/docs/handlers/asset.md#updateassethandler).

- **updateSubAccount** - calls [UpdateSubAccountHandler](/packages/icrc/docs/handlers/asset.md#updatesubaccounthandler).


### Allowance functions

- **addAllowance** - calls [AddAllowanceHandler](/packages/icrc/docs/handlers/allowance.md#addallowancehandler).

- **checkAllowanceByPrincipal** - calls [CheckAllowanceByPrincipalHandler](/packages/icrc/docs/handlers/allowance.md#checkallowancebyprincipalhandler).

- **checkAllowance** - calls [CheckAllowanceHandler](/packages/icrc/docs/handlers/allowance.md#checkallowancehandler).

- **getListAllowance** - calls [GetListAllowanceHandler](/packages/icrc/docs/handlers/allowance.md#getlistallowancehandler).

- **removeAllowance** - calls [RemoveAllowanceHandler](/packages/icrc/docs/handlers/allowance.md#removeallowancehandler).

- **transferFromAllowance** - calls [TransferFromAllowanceHandler](/packages/icrc/docs/handlers/allowance.md#transferfromallowancehandler).

- **updateAllowanceHandler** - calls [UpdateAllowanceHandler](/packages/icrc/docs/handlers/allowance.md#updateallowancehandler).


### Contact functions

- **addAssetContact** - calls [AddAssetContactHandler](/packages/icrc/docs/handlers/contact.md#addassetcontacthandler).

- **addSubAccountContact** - calls [AddSubAccountContactHandler](/packages/icrc/docs/handlers/contact.md#addsubaccountcontacthandler).

- **editContact** - calls [EditContactHandler](/packages/icrc/docs/handlers/contact.md#editcontacthandler).

- **editOrAddContact** - calls [EditOrAddContactHandler](/packages/icrc/docs/handlers/contact.md#editoraddcontacthandler).

- **editOrAddSubAccountContact** - calls [EditOrAddSubAccountContactHandler](/packages/icrc/docs/handlers/contact.md#editoraddsubaccountcontacthandler).

- **editSubAccountContact** - calls [EditSubAccountContactHandler](/packages/icrc/docs/handlers/contact.md#editsubaccountcontacthandler).

- **getListContact** - calls [GetListContactHandler](/packages/icrc/docs/handlers/contact.md#getlistcontacthandler).

- **removeAssetContact** - calls [RemoveAssetContactHandler](/packages/icrc/docs/handlers/contact.md#removeassetcontacthandler).

- **removeContact** - calls [RemoveContactHandler](/packages/icrc/docs/handlers/contact.md#removecontacthandler).

- **removeSubAccountContact** - calls [RemoveSubAccountContactHandler](/packages/icrc/docs/handlers/contact.md#removesubaccountcontacthandler).


### Service functions

- **addServiceAssets** - calls [AddServiceAssetsHandler](/packages/icrc/docs/handlers/contact.md#addserviceassetshandler).

- **addService** - calls [AddServiceHandler](/packages/icrc/docs/handlers/contact.md#addservicehandler).

- **checkServicePrincipal** - calls [CheckServicePrincipalHandler](/packages/icrc/docs/handlers/contact.md#checkserviceprincipalhandler).

- **editServiceName** - calls [EditServiceNameHandler](/packages/icrc/docs/handlers/contact.md#editservicenamehandler).

- **getListService** - calls [GetListServiceHandler](/packages/hpl/docs/handlers/contact.md#getlistservicehandler).

- **notifyService** - calls [NotifyServiceHandler](/packages/hpl/docs/handlers/contact.md#notifyservicehandler).

- **removeServiceAssets** - calls [RemoveServiceAssetsHandler](/packages/hpl/docs/handlers/contact.md#removeserviceassetshandler).

- **removeService** - calls [RemoveServiceHandler](/packages/icrc/docs/handlers/contact.md#removeservicehandler).

- **transferFromService** - calls [TransferFromServiceHandler](/packages/icrc/docs/handlers/contact.md#transferfromservicehandler).

- **transferToService** - calls [TransferToServiceHandler](/packages/icrc/docs/handlers/contact.md#transfertoservicehandler).


### Token functions

- **getAvailableAssets** - calls [GetAvailableAssetsHandler](/packages/hpl/docs/handlers/check.md#getavailableassetshandler).

- **getTokenMarket** - calls [GetTokenMarketHandler](/packages/hpl/docs/handlers/check.md#gettokenmarkethandler).


### Transaction functions

- **getListTransaction** - calls [GetListTransactionHandler](/packages/hpl/docs/handlers/transfer.md#getlisttransactionhandler).

- **sendTransaction** - calls [SendTransactionHandler](/packages/hpl/docs/handlers/transfer.md#sendtransactionhandler).

---

### Example

```typescript
import { GetAssetListForm, getListAsset } from "@ic-wallet-middleware/icrc";
import { LoadType } from "@ic-wallet-middleware/common";

(() => {
    const form: GetAssetListForm = {
        loadType: LoadType.Full
    }
    const result = getListAsset(form);
})()
```