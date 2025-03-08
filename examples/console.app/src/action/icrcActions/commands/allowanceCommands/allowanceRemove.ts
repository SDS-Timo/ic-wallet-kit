import { BaseActionModel, Constructable } from "@app/action/baseActionModel";
import { allowanceName } from "@app/action/icrcActions/commands/parentName";
import { OptionalParamModel } from "@app/types/optionalParamModel";
import { consoleOutput } from "@app/utils/consoleOutput";
import { AllowanceResult, RemoveAllowanceForm, RemoveAllowanceHandler, SubAccountId } from "@ic-wallet-middleware/icrc";

export class AllowanceRemoveConsoleForm {

    public ledgerAddress: string = "";
    public spenderPrincipal: string = "";
    public subAccountId: SubAccountId = SubAccountId.Default();
    public spenderSubId: SubAccountId = SubAccountId.Default();

    constructor() {
    }
}

export class AllowanceRemove extends BaseActionModel<RemoveAllowanceHandler, RemoveAllowanceForm, AllowanceResult, AllowanceRemoveConsoleForm> {

    public parentCommandName: string = allowanceName;
    public commandName: string = "remove";
    public description: string = "removes allowance";
    protected optionalParamNames: OptionalParamModel[] = [];

    protected get consoleFormDefaultObject(): AllowanceRemoveConsoleForm {
        return new AllowanceRemoveConsoleForm();
    }

    protected getForm(params: string): Promise<RemoveAllowanceForm> {

        const form = this.getConsoleForm(params);
        return Promise.resolve({
            ledgerAddress: form.ledgerAddress,
            spenderPrincipal: form.spenderPrincipal,
            spenderSubId: form.spenderSubId,
            subAccountId: form.subAccountId
        });
    }

    protected get handlerName(): Constructable<RemoveAllowanceHandler> {
        return RemoveAllowanceHandler;
    }

    protected formatOutputResult(data: any) {
        consoleOutput("Allowance was removed success");
        return Promise.resolve();
    }
}