
import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { subAccountName } from "@app/action/icrcActions/commands/parentName";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { consoleOutput } from "@app/utils/consoleOutput";
import { RemoveSubAccountForm, RemoveSubAccountHandler, RemoveSubAccountResult, SubAccountId } from "@ic-wallet-kit/icrc";

export class AccountRemoveConsoleForm {

    public ledgerAddress: string = "";
    public subAccount: SubAccountId = SubAccountId.Default();

    constructor() {
    }
}

export class AccountRemove extends BaseActionModel<RemoveSubAccountHandler, RemoveSubAccountForm, RemoveSubAccountResult, AccountRemoveConsoleForm> {


    public parentCommandName: string = subAccountName;
    public commandName: string = "remove";
    public description: string = "removes Sub Account from specific asset";
    protected optionalParamNames: OptionalParamModel[] = [];

    protected get consoleFormDefaultObject(): AccountRemoveConsoleForm {
        return new AccountRemoveConsoleForm();
    }

    protected async getForm(params: string): Promise<RemoveSubAccountForm> {

        const form = this.getConsoleForm(params);

        return {
            ledgerAddress: form.ledgerAddress,
            subAccountId: form.subAccount
        }
    }

    protected get handlerName(): Constructable<RemoveSubAccountHandler> {
        return RemoveSubAccountHandler;
    }

    protected formatOutputResult(data: any) {
        consoleOutput("Account was removed success");
        return Promise.resolve();
    }
}