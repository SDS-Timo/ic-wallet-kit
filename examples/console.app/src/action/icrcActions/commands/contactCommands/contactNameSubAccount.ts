import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { contactName } from "@app/action/icrcActions/commands/parentName";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { consoleOutput } from "@app/utils/consoleOutput";
import { AddSubAccountContactForm, ContactResult, EditOrAddSubAccountContactHandler, SubAccountId } from "@ic-wallet-middleware/icrc";


export class ContactAddSubAccountConsoleForm {

    public principal: string = "";
    public ledgerAddress: string = "";
    public subAccountId: SubAccountId = SubAccountId.Default();
    public subAccountName: string = "";

    constructor() {
    }
}

export class ContactNameSubAccount extends BaseActionModel<EditOrAddSubAccountContactHandler, AddSubAccountContactForm, ContactResult, ContactAddSubAccountConsoleForm> {

    public parentCommandName: string = contactName;
    public commandName: string = "name-sub-account";
    public description: string = "adds sub account to contact or changes name";
    protected optionalParamNames: OptionalParamModel[] = [];

    protected get consoleFormDefaultObject(): ContactAddSubAccountConsoleForm {
        return new ContactAddSubAccountConsoleForm();
    }

    protected getForm(params: string): Promise<AddSubAccountContactForm> {
        const form = this.getConsoleForm(params);
        const result = {
            principal: form.principal,
            ledgerAddress: form.ledgerAddress,
            subAccountId: form.subAccountId,
            subAccountName: form.subAccountName
        }
        return Promise.resolve(result);
    }

    protected get handlerName(): Constructable<EditOrAddSubAccountContactHandler> {
        return EditOrAddSubAccountContactHandler;
    }

    protected formatOutputResult(data: any) {
        consoleOutput("Contact SubAccount was processed success");
        return Promise.resolve();
    }
}