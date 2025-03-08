import { BaseActionModel } from "@app/action/baseActionModel";
import { Icrc84PrincipalForm, Icrc84PrincipalHandler, Icrc84PrincipalResult } from "@app/action/icrcActions/handlers/icrc84PrincipalHandler";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { consoleOutput } from "@app/utils/consoleOutput";
import { Constructable } from "typedi";

export class Icrc84Principal extends BaseActionModel<Icrc84PrincipalHandler, Icrc84PrincipalForm, Icrc84PrincipalResult, Icrc84PrincipalConsoleForm> {

    public parentCommandName: string = "icrc84";
    public commandName: string = "";
    public description: string = "convert principal and principal to account identifier";
    protected optionalParamNames: OptionalParamModel[] = [];

    protected get consoleFormDefaultObject(): Icrc84PrincipalConsoleForm {
        return new Icrc84PrincipalConsoleForm();
    }

    protected getForm(params: string): Promise<Icrc84PrincipalForm> {
        let form = this.getConsoleForm(params);

        return Promise.resolve({
            principal: form.principal,
            owner: form.owner
        });
    }

    protected get handlerName(): Constructable<Icrc84PrincipalHandler> {
        return Icrc84PrincipalHandler;
    }

    protected formatOutputResult(data: Icrc84PrincipalResult) {
        consoleOutput(data.accountIdentifier);
        return Promise.resolve();
    }
}

export class Icrc84PrincipalConsoleForm {
    public owner: string = "";
    public principal: string = "";

    constructor() {
    }
}
