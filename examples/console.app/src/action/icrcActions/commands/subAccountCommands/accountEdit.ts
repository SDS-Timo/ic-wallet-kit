import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { subAccountName } from "@app/action/icrcActions/commands/parentName";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { consoleOutput } from "@app/utils/consoleOutput";
import { SubAccountId, UpdateSubAccountForm, UpdateSubAccountHandler, UpdateSubAccountResult } from "@ic-wallet-kit/icrc";

export class AccountEditConsoleForm {

    public ledgerAddress: string = "";
    public subAccount: SubAccountId = SubAccountId.parseFromString("0x0");
    public subAccountNewName: string = "";

    constructor() {
    }
}

export class AccountEdit extends BaseActionModel<UpdateSubAccountHandler, UpdateSubAccountForm, UpdateSubAccountResult, AccountEditConsoleForm> {

    public parentCommandName: string = subAccountName;
    public commandName: string = "edit";
    public description: string = "edit existing subaccount (change its alias name)";
    protected optionalParamNames: OptionalParamModel[] = [];

    protected get consoleFormDefaultObject(): AccountEditConsoleForm {
        return new AccountEditConsoleForm();
    }

    protected async getForm(params: string): Promise<UpdateSubAccountForm> {
        let form = this.getConsoleForm(params);

        return {
            ledgerAddress: form.ledgerAddress,
            subAccountId: form.subAccount,
            subAccountNewName: form.subAccountNewName
        }
    }

    protected get handlerName(): Constructable<UpdateSubAccountHandler> {
        return UpdateSubAccountHandler;
    }

    protected formatOutputResult(data: any) {
        consoleOutput("Account was updated success");
        return Promise.resolve();
    }
}
