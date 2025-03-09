import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { contactName } from "@app/action/icrcActions/commands/parentName";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { consoleOutput } from "@app/utils/consoleOutput";
import { LoadType } from "@ic-wallet-kit/common";
import { GetListContactForm, GetListContactHandler, GetListContactResult } from "@ic-wallet-kit/icrc";

export class ContactAssetListConsoleForm {
    constructor() {
    }
}

export class ContactAssetList extends BaseActionModel<GetListContactHandler, GetListContactForm, GetListContactResult, ContactAssetListConsoleForm> {

    public parentCommandName: string = contactName;
    public commandName: string = "list-asset";
    public description: string = "returns list of stored contacts";
    public optionalParamNames: OptionalParamModel[] = [];

    protected get consoleFormDefaultObject(): ContactAssetListConsoleForm {
        return new ContactAssetListConsoleForm();
    }

    protected getForm(params: string): Promise<GetListContactForm> {
        return Promise.resolve({
            loadType: LoadType.Quick
        });
    }

    protected get handlerName(): Constructable<GetListContactHandler> {
        return GetListContactHandler;
    }

    protected formatOutputResult(data: GetListContactResult) {
        const model: object[] = []
        data.contacts.forEach((c) => {
            c.assets.forEach((a) => {
                let asset = {
                    name: c.name,
                    ledgerAddress: a.ledgerAddress,
                    subAccountName: "",
                    subAccountId: ""
                }
                if (a.subAccounts.length > 0) {
                    a.subAccounts.forEach(sa => {
                        asset = {
                            name: c.name,
                            ledgerAddress: a.ledgerAddress,
                            subAccountName: sa.name,
                            subAccountId: sa.subAccountId.toString()
                        }
                        model.push(asset);
                    });
                }
                else {
                    model.push(asset);
                }
            });
        });

        if (model.length == 0) {
            consoleOutput("Contact list is empty");
        }
        else {
            console.table(model, ["name", "ledgerAddress", "subAccountName", "subAccountId"]);
        }

        return Promise.resolve();
    }
}