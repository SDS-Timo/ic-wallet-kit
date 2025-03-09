import { BaseActionModel } from "@app/action/baseActionModel";
import { contactName } from "@app/action/icrcActions/commands/parentName";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { consoleOutput } from "@app/utils/consoleOutput";
import { ContactResult, RemoveContactForm, RemoveContactHandler } from "@ic-wallet-kit/icrc";
import { Constructable } from "typedi";

export class ContactRemoveConsoleForm {

    public principal: string = "";

    constructor() {
    }
}

export class ContactRemove extends BaseActionModel<RemoveContactHandler, RemoveContactForm, ContactResult, ContactRemoveConsoleForm> {

    public parentCommandName: string = contactName;
    public commandName: string = "remove";
    public description: string = "removes contact";
    protected optionalParamNames: OptionalParamModel[] = [];

    protected get consoleFormDefaultObject(): ContactRemoveConsoleForm {
        return new ContactRemoveConsoleForm();
    }

    protected getForm(params: string): Promise<RemoveContactForm> {
        let form = this.getConsoleForm(params);

        return Promise.resolve({ principal: form.principal });
    }

    protected get handlerName(): Constructable<RemoveContactHandler> {
        return RemoveContactHandler;
    }

    protected formatOutputResult(data: any) {
        consoleOutput("Contact was removed success");
        return Promise.resolve();
    }
}
