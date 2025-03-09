import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { contactName } from "@app/action/icrcActions/commands/parentName";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { consoleOutput } from "@app/utils/consoleOutput";
import { LoadType } from "@ic-wallet-kit/common";
import { GetListContactForm, GetListContactHandler, GetListContactResult } from "@ic-wallet-kit/icrc";

export class ContactListConsoleForm {
    constructor() {
    }
}

export class ContactList extends BaseActionModel<GetListContactHandler, GetListContactForm, GetListContactResult, ContactListConsoleForm> {

    public parentCommandName: string = contactName;
    public commandName: string = "list";
    public description: string = "returns list of stored contacts";
    public optionalParamNames: OptionalParamModel[] = [];

    protected get consoleFormDefaultObject(): ContactListConsoleForm {
        return new ContactListConsoleForm();
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

        if (data.contacts.length == 0) {
            consoleOutput("Contact list is empty");
        }
        else {
            console.table(data.contacts.map((a) => {
                return {
                    name: a.name,
                    principal: a.principal,
                    hasAllowance: a.hasAllowance
                }

            }), ["name", "principal", "hasAllowance"]);
        }

        return Promise.resolve();
    }
}