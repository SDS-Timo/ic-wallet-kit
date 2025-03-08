import { consoleOutput } from "@app/utils/consoleOutput";
// eslint-disable-next-line require-await
export const help = async () => {
    consoleOutput("---Asset---");

    consoleOutput("get-avaliable-assets - returns available list of assets");
    consoleOutput("get-assets - returns list of stored assets");

    consoleOutput("add-asset param1 - adds to list of stored assets, param1 ledgerAddress");
    consoleOutput("remove-asset param1 - removes asset from list of stored assets, param1: ledgerAddress");

    consoleOutput("add-sub-account param1 param2 param3  - adds Sub Account to specific asset, param1: ledgerAddress, param2: subAccountId, param3: subAccountName");
    consoleOutput("remove-sub-account param1 param2 - removes Sub Account from specific asset, param1: ledgerAddress, param2: subAccountId");

    consoleOutput("update-asset param1 param2 param3 param4  - updates exist Asset, param1: ledgerAddress, param2: assetName, param3: shortDecimal, param4: symbol");

    consoleOutput("transfer-tokens param1 param2 param3 param4 param5 - transfer token, param1: ledgerAddress, param2: subAccountId, param3: receiverAccountPrincipal, param4: receiverSubAccountId, param5: amount string");

    consoleOutput("---Contact---");

    consoleOutput("get-contacts");
    consoleOutput("add-contact param1 param2 param3 param4 param5 - add new contact, "
        + "param1: new principal, param2: contactName, param3: ledgerAddress, param4: subAccountIndex, param5: subAccountName");
    consoleOutput("edit-contact-name param1 param2 - edit contact name, " +
        "param1: contact principal, param2: asset address");
    consoleOutput("remove-contact param1 - remove contact, " +
        "param1: contact principal");

    consoleOutput("add-asset-contact param1 param2 - add new asset to contact, "
        + "param1: new principal, param2: ledgerAddress");
    consoleOutput("remove-asset-contact param1 param2 - remove asset from contact, " +
        "param1: contact principal, param2: asset address");

    consoleOutput("add-sub-account-contact param1 param2 param3 param4 - add sub account to exist contact, " +
        "param1: contact principal, param2: asset address, param3: sub account index, param4: sub account name");
    consoleOutput("edit-sub-account-contact param1 param2 param3 param4 param5 - edit sub account name, " +
        "param1: contact principal, param2: asset address, param3: new sub account index, param4: sub account name, param5: old sub account index");
    consoleOutput("remove-sub-account-contact param1 param2 param3 - remove sub account from contact, " +
        "param1: contact principal, param2: asset address, param3: sub account index");

    consoleOutput("---Allowance---");

    consoleOutput("get-allowances param1 - get allowances for asset, param1: ledgerAddress");
    consoleOutput("add-allowance param1 param2 param3 param4 - add new allowance, " +
        "param1: ledgerAddress, param2: subAccountId, param3: spender Principal, param4: amount")
    consoleOutput("update-allowance param1 param2 param3 param4 - update allowance, " +
        "param1: ledgerAddress, param2: subAccountId, param3: spender Principal, param4: amount")
    consoleOutput("check-allowance param1 param2 param3  - check allowance, " +
        "param1: ledgerAddress, param2: subAccountId, param3: spender Principal")
    consoleOutput("remove-allowance param1 param2 param3 - remove allowance, " +
        "param1: ledgerAddress, param2: subAccountId, param3: spender Principal")
    consoleOutput("transfer-from-allowance param1 param2 param3 param4 param5 param6 param7  - remove allowance, " +
        "param1: ledgerAddress, param2: subAccountId, param3: sender Principal, param4: receiver Principal, " +
        "param5: receiver SubAccountId, param6: transfer amount, param7: transaction fee")

    consoleOutput("---Service---");

    consoleOutput("get-services");
    consoleOutput("add-service param1 param2 - add new service, "
        + "param1: new service principal, param2: new service name");
    consoleOutput("edit-service-name param1 param2 - edit service name, " +
        + "param1: service principal, param2: new service name");
    consoleOutput("rremove-service param1 - remove service, " +
        "param1: service principal");

    consoleOutput("add-service-assets param1 param2 param3 param4 param5- add new asset to service, "
        + "param1: service principal, param2: ledgerAddress, param3: asset Name, param4: asset Symbol, param5: asset decimal");
    consoleOutput("remove-service-asset param1 param2 - remove asset from service, " +
        "param1: service principal, param2: asset address");

    consoleOutput("transfer-to-service param1 param2 param3 param4 param5 - transfer to service, " +
        "param1: from principal, param2: from SubId, param3: to principal, param4: to SubId, param5: amount");
    consoleOutput("transfer-to-service param1 param2 param3 param4 - transfer from service, " +
        "param1: from principal, param2: to principal, param3: to SubId, param4: amount");
    consoleOutput("notify-service param1 param2 - notify, " +
        "param1: service Principal, param2: asset address");


    consoleOutput("---HPL Asset---");

    consoleOutput("get-hpl-assets - returns list of assets");
    consoleOutput("get-hpl-accounts - returns list of accounts");
    consoleOutput("get-hpl-virtual-accounts - returns list of virtual accounts");

    consoleOutput("add-hpl-account param1 param2 - add hpl account, param1: assetId, param2: account name");
    consoleOutput("add-hpl-virtual-account param1 param2 param3 param4 param5 - add hpl virtual account, "
        + "param1: assetId, param2: accountId, param3: virtual account name, param4: spender principal, param5: amount");

    consoleOutput("edit-hpl-asset param1 param2 param3 - edit asset, param1: assetId, param2: name, param3: symbol");
    consoleOutput("edit-hpl-virtual-account param1 param2 param3 param4 - edit hpl virtual account, "
        + "param1: virtual account id, param2: account id, param3: virtual account name, param4: amount");

    consoleOutput("reset-hpl-virtual-account param1 - reset hpl virtual account, param1: virtual account id");
    consoleOutput("delete-hpl-virtual-account param1 - delete hpl virtual account, param1: virtual account id");
}