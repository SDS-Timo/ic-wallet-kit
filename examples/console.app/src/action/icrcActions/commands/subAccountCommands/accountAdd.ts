
import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { subAccountName } from "@app/action/icrcActions/commands/parentName";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { consoleOutput } from "@app/utils/consoleOutput";

import { AddSubAccountForm, AddSubAccountHandler, AddSubAccountResult, SubAccountId } from "@ic-wallet-kit/icrc";

export class AccountAddConsoleForm {

    public ledgerAddress: string = "";
    public subAccount: SubAccountId = SubAccountId.parseFromString("0x0");
    public subAccountName: string = "";

    constructor() {
    }
}

export class AccountAdd extends BaseActionModel<AddSubAccountHandler, AddSubAccountForm, AddSubAccountResult, AccountAddConsoleForm> {

    public parentCommandName: string = subAccountName;
    public commandName: string = "add";
    public description: string = "adds Sub Account to specific asset";
    protected optionalParamNames: OptionalParamModel[] = [];

    protected get consoleFormDefaultObject(): AccountAddConsoleForm {
        return new AccountAddConsoleForm();
    }

    protected async getForm(params: string): Promise<AddSubAccountForm> {

        const form = this.getConsoleForm(params);
        return {
            ledgerAddress: form.ledgerAddress,
            subAccountId: form.subAccount,
            subAccountName: form.subAccountName
        }
    }

    protected get handlerName(): Constructable<AddSubAccountHandler> {
        return AddSubAccountHandler;
    }

    protected formatOutputResult(data: any) {
        consoleOutput("Account was added success");
        return Promise.resolve();
    }
}