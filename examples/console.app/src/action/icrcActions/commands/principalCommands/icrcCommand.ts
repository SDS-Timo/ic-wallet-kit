import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { Icrc1PrincipalForm, Icrc1PrincipalHandler, Icrc1PrincipalResult } from "@app/action/icrcActions/handlers/icrc1PrincipalHandler";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { consoleOutput } from "@app/utils/consoleOutput";
import { SubAccountId } from "@ic-wallet-kit/icrc";

export class Icrc1Principal extends BaseActionModel<Icrc1PrincipalHandler, Icrc1PrincipalForm, Icrc1PrincipalResult, Icrc1PrincipalConsoleForm> {

    public parentCommandName: string = "icrc1";
    public commandName: string = "";
    public description: string = "convert principal and subAccount to account identifier";
    protected optionalParamNames: OptionalParamModel[] = [];

    protected get consoleFormDefaultObject(): Icrc1PrincipalConsoleForm {
        return new Icrc1PrincipalConsoleForm();
    }

    protected getForm(params: string): Promise<Icrc1PrincipalForm> {
        let form = this.getConsoleForm(params);

        return Promise.resolve({
            principal: form.principal,
            subAccount: form.subAccount
        });
    }

    protected get handlerName(): Constructable<Icrc1PrincipalHandler> {
        return Icrc1PrincipalHandler;
    }

    protected formatOutputResult(data: Icrc1PrincipalResult): Promise<void> {
        consoleOutput(data.accountIdentifier);
        return Promise.resolve();
    }
}

export class Icrc1PrincipalConsoleForm {

    public principal: string = "";
    public subAccount: SubAccountId = SubAccountId.Default();
    constructor() {
    }
}
