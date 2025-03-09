import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { contactName } from "@app/action/icrcActions/commands/parentName";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { consoleOutput } from "@app/utils/consoleOutput";
import { AddAssetContactForm, AddAssetContactHandler, ContactResult } from "@ic-wallet-kit/icrc";

export class ContactAddAssetConsoleForm {

    public principal: string = "";
    public ledgerAddress: string = "";

    constructor() {
    }
}

export class ContactAddAsset extends BaseActionModel<AddAssetContactHandler, AddAssetContactForm, ContactResult, ContactAddAssetConsoleForm> {

    public parentCommandName: string = contactName;
    public commandName: string = "add-asset";
    public description: string = "adds new asset to contact";
    protected optionalParamNames: OptionalParamModel[] = [];

    protected get consoleFormDefaultObject(): ContactAddAssetConsoleForm {
        return new ContactAddAssetConsoleForm();
    }

    protected getForm(params: string): Promise<AddAssetContactForm> {
        const form = this.getConsoleForm(params);
        const result = {
            principal: form.principal,
            ledgerAddress: form.ledgerAddress
        }
        return Promise.resolve(result);
    }

    protected get handlerName(): Constructable<AddAssetContactHandler> {
        return AddAssetContactHandler;
    }

    protected formatOutputResult(data: any) {
        consoleOutput("Contact Asset was added success");
        return Promise.resolve();
    }
}