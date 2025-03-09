import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { contactName } from "@app/action/icrcActions/commands/parentName";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { consoleOutput } from "@app/utils/consoleOutput";
import { ContactResult, RemoveAssetContactForm, RemoveAssetContactHandler } from "@ic-wallet-kit/icrc";

export class ContactRemoveAssetConsoleForm {

    public principal: string = "";
    public ledgerAddress: string = "";

    constructor() {
    }
}

export class ContactRemoveAsset extends BaseActionModel<RemoveAssetContactHandler, RemoveAssetContactForm, ContactResult, ContactRemoveAssetConsoleForm> {

    public parentCommandName: string = contactName;
    public commandName: string = "remove-asset";
    public description: string = "removes asset from specific contact";
    protected optionalParamNames: OptionalParamModel[] = [];

    protected get consoleFormDefaultObject(): ContactRemoveAssetConsoleForm {
        return new ContactRemoveAssetConsoleForm();
    }

    protected getForm(params: string): Promise<RemoveAssetContactForm> {
        let form = this.getConsoleForm(params);

        return Promise.resolve({
            principal: form.principal,
            ledgerAddress: form.ledgerAddress
        });
    }

    protected get handlerName(): Constructable<RemoveAssetContactHandler> {
        return RemoveAssetContactHandler;
    }

    protected formatOutputResult(data: any) {
        consoleOutput("Contact Asset was removed success");
        return Promise.resolve();
    }
}