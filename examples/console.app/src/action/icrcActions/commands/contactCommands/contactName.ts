import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { contactName } from "@app/action/icrcActions/commands/parentName";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { consoleOutput } from "@app/utils/consoleOutput";
import { ContactResult, EditContactForm, EditOrAddContactHandler } from "@ic-wallet-kit/icrc";


export class ContactAddConsoleForm {
    public principal: string = "";
    public contactName: string = "";

    constructor() {
    }
}

export class ContactName extends BaseActionModel<EditOrAddContactHandler, EditContactForm, ContactResult, ContactAddConsoleForm> {

    public parentCommandName: string = contactName;
    public commandName: string = "name";
    public description: string = "adds an new contact if it does not exist yet or overwrites the name";
    protected optionalParamNames: OptionalParamModel[] = [];

    protected get consoleFormDefaultObject(): ContactAddConsoleForm {
        return new ContactAddConsoleForm();
    }

    protected getForm(params: string): Promise<EditContactForm> {

        const form = this.getConsoleForm(params);
        const result = {
            principal: form.principal,
            name: form.contactName,
        }
        return Promise.resolve(result);
    }

    protected get handlerName(): Constructable<EditOrAddContactHandler> {
        return EditOrAddContactHandler;
    }

    protected formatOutputResult(data: any) {
        consoleOutput("Contact was processed success");
        return Promise.resolve();
    }
}