import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { contactName } from "@app/action/icrcActions/commands/parentName";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { consoleOutput } from "@app/utils/consoleOutput";
import { ContactResult, RemoveSubAccountContactForm, RemoveSubAccountContactHandler, SubAccountId } from "@ic-wallet-middleware/icrc";

export class ContactRemoveSubAccountConsoleForm {

    public principal: string = "";
    public ledgerAddress: string = "";
    public subAccountId: SubAccountId = SubAccountId.Default();

    constructor() {
    }
}

export class ContactRemoveSubAccount extends BaseActionModel<RemoveSubAccountContactHandler, RemoveSubAccountContactForm, ContactResult, ContactRemoveSubAccountConsoleForm> {

    public parentCommandName: string = contactName;
    public commandName: string = "remove-sub-account";
    public description: string = "removes sub account from specific contact";
    protected optionalParamNames: OptionalParamModel[] = [];

    protected get consoleFormDefaultObject(): ContactRemoveSubAccountConsoleForm {
        return new ContactRemoveSubAccountConsoleForm();
    }

    protected getForm(params: string): Promise<RemoveSubAccountContactForm> {
        let form = this.getConsoleForm(params);

        return Promise.resolve({
            principal: form.principal,
            ledgerAddress: form.ledgerAddress,
            subAccountId: form.subAccountId
        });
    }

    protected get handlerName(): Constructable<RemoveSubAccountContactHandler> {
        return RemoveSubAccountContactHandler;
    }

    protected formatOutputResult(data: any) {
        consoleOutput("Contact SubAccount was removed success");
        return Promise.resolve();
    }
}